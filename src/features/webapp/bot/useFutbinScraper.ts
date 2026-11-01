import { useCallback, useEffect, useRef, useState } from 'react';
import type { WebView, WebViewMessageEvent } from 'react-native-webview';

export const FUTBIN_BASE_URL = 'https://www.futbin.com';

export const FC_YEAR = (() => {
  const now = new Date();
  const year = now.getFullYear() + (now.getMonth() >= 8 ? 1 : 0);
  return year.toString().slice(2, 4);
})();

export interface FutbinPrices {
  ps: number | null;
  pc: number | null;
}

interface PendingFutbinRequest {
  resolve: (res: { ok: boolean; status: number; text: string }) => void;
  reject: (err: Error) => void;
  timeoutId: ReturnType<typeof setTimeout>;
}

export function extractFutbinPrices(html: string): FutbinPrices {
  const extractForPlatform = (platform: 'ps' | 'pc'): number | null => {
    const boxRegex = /<div[^>]*class="[^"]*price-box[^"]*"[^>]*>/gi;
    let match: RegExpExecArray | null;
    let originalBoxHtml: { index: number; length: number } | null = null;
    let genericBoxHtml: { index: number; length: number } | null = null;

    while ((match = boxRegex.exec(html)) !== null) {
      const tagHtml = match[0].toLowerCase();
      if (tagHtml.includes(`platform-${platform}-only`)) {
        if (tagHtml.includes('price-box-original-player')) {
          originalBoxHtml = { index: match.index, length: match[0].length };
          break;
        } else if (!genericBoxHtml) {
          genericBoxHtml = { index: match.index, length: match[0].length };
        }
      }
    }

    const bestBox = originalBoxHtml || genericBoxHtml;
    if (!bestBox) return null;

    const chunk = html.substring(bestBox.index, bestBox.index + 20000);
    const priceClassRegex = /class="(?:[^"]*?\s)?price(?:\s|")[^"]*"[^>]*>/i;
    const priceClassMatch = priceClassRegex.exec(chunk);
    let priceStr: string | null = null;

    if (priceClassMatch) {
      const innerChunk = chunk.substring(
        priceClassMatch.index + priceClassMatch[0].length,
        priceClassMatch.index + priceClassMatch[0].length + 200
      );
      const textOnly = innerChunk.replace(/<[^>]*>/g, ' ').trim();
      const numMatch = textOnly.match(/([\d,]+)/);
      if (numMatch) {
        priceStr = numMatch[1].replace(/,/g, '');
      }
    }

    if (!priceStr) {
      const recentPricesRegex = /data-recent-prices="([^"]+)"/i;
      const recentMatch = chunk.match(recentPricesRegex);
      if (recentMatch && recentMatch[1]) {
        const pricesCsv = recentMatch[1];
        const recentPrices = pricesCsv
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
        if (recentPrices.length > 0) {
          priceStr = recentPrices[recentPrices.length - 1];
        }
      }
    }

    if (priceStr) {
      const parsed = parseInt(priceStr.replace(/[^\d]/g, ''), 10);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  };

  return {
    ps: extractForPlatform('ps'),
    pc: extractForPlatform('pc'),
  };
}

export function useFutbinScraper() {
  const futbinWebViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoadingPrice, setIsLoadingPrice] = useState(false);
  const [prices, setPrices] = useState<FutbinPrices | null>(null);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const pendingRequestsRef = useRef(new Map<string, PendingFutbinRequest>());

  useEffect(() => {
    const pending = pendingRequestsRef.current;
    return () => {
      pending.forEach(({ timeoutId }) => clearTimeout(timeoutId));
      pending.clear();
    };
  }, []);

  const handleFutbinMessage = useCallback((event: WebViewMessageEvent) => {
    let data: any = null;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }

    if (data?.source !== 'futbin-scraper' || !data.requestId) return;

    const pending = pendingRequestsRef.current.get(data.requestId);
    if (!pending) return;

    clearTimeout(pending.timeoutId);
    pendingRequestsRef.current.delete(data.requestId);

    if (data.error) {
      pending.reject(new Error(data.error));
    } else {
      pending.resolve({
        ok: Boolean(data.ok),
        status: Number(data.status || 200),
        text: String(data.text || ''),
      });
    }
  }, []);

  const executeFetchInWebView = useCallback(
    (url: string): Promise<{ ok: boolean; status: number; text: string }> => {
      return new Promise((resolve, reject) => {
        const webView = futbinWebViewRef.current;
        if (!webView) {
          reject(new Error('FUTBIN WebView is not mounted'));
          return;
        }

        const requestId = `futbin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const timeoutId = setTimeout(() => {
          pendingRequestsRef.current.delete(requestId);
          reject(new Error('FUTBIN fetch timed out'));
        }, 20000);

        pendingRequestsRef.current.set(requestId, { resolve, reject, timeoutId });

        const script = `
          (function() {
            try {
              fetch(${JSON.stringify(url)}, { credentials: 'include' })
                .then(function(res) {
                  return res.text().then(function(text) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      source: 'futbin-scraper',
                      requestId: ${JSON.stringify(requestId)},
                      ok: res.ok,
                      status: res.status,
                      text: text
                    }));
                  });
                })
                .catch(function(err) {
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    source: 'futbin-scraper',
                    requestId: ${JSON.stringify(requestId)},
                    error: String(err)
                  }));
                });
            } catch(e) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                source: 'futbin-scraper',
                requestId: ${JSON.stringify(requestId)},
                error: String(e)
              }));
            }
          })();
          true;
        `;

        webView.injectJavaScript(script);
      });
    },
    []
  );

  const fetchPlayerPrice = useCallback(
    async (
      playerName: string,
      maskedDefId?: number | null,
      platform: 'ps' | 'pc' = 'ps'
    ): Promise<number | null> => {
      if (!playerName.trim()) return null;

      setIsLoadingPrice(true);
      try {
        const encoded = encodeURIComponent(playerName.trim());
        const searchUrl = `${FUTBIN_BASE_URL}/players/search?query=${encoded}&year=${FC_YEAR}`;

        const searchRes = await executeFetchInWebView(searchUrl);
        if (!searchRes.ok || !searchRes.text) {
          setIsLoadingPrice(false);
          return null;
        }

        let playersList: any[] = [];
        try {
          playersList = JSON.parse(searchRes.text);
        } catch {
          setIsLoadingPrice(false);
          return null;
        }

        if (!Array.isArray(playersList) || playersList.length === 0) {
          setIsLoadingPrice(false);
          return null;
        }

        // Match the player: prefer maskedDefId, fallback to first item
        let matchedPlayer = playersList[0];
        if (maskedDefId) {
          const idMatch = playersList.find((p) => {
            const imgUrl: string = p.playerImage?.fixed?.url?.image1x || '';
            const m = imgUrl.match(/\/players\/(\d+)\.png/);
            const futId = m ? parseInt(m[1], 10) : null;
            return futId === maskedDefId || p.id === maskedDefId;
          });
          if (idMatch) matchedPlayer = idMatch;
        }

        let playerPageUrl = matchedPlayer.location?.url;
        if (!playerPageUrl && matchedPlayer.id) {
          playerPageUrl = `/player/${matchedPlayer.id}/${matchedPlayer.slug || 'player'}`;
        }

        if (!playerPageUrl) {
          setIsLoadingPrice(false);
          return null;
        }

        const fullPageUrl = playerPageUrl.startsWith('http')
          ? playerPageUrl
          : `${FUTBIN_BASE_URL}${playerPageUrl}`;

        const pageRes = await executeFetchInWebView(fullPageUrl);
        if (!pageRes.ok || !pageRes.text) {
          setIsLoadingPrice(false);
          return null;
        }

        const extracted = extractFutbinPrices(pageRes.text);
        setPrices(extracted);

        const chosenPrice = platform === 'pc' ? extracted.pc : (extracted.ps ?? extracted.pc);
        setCurrentPrice(chosenPrice);
        setIsLoadingPrice(false);
        return chosenPrice;
      } catch (err) {
        setIsLoadingPrice(false);
        return null;
      }
    },
    [executeFetchInWebView]
  );

  return {
    futbinWebViewRef,
    isReady,
    isLoadingPrice,
    prices,
    currentPrice,
    fetchPlayerPrice,
    handleFutbinMessage,
    onFutbinLoadEnd: () => setIsReady(true),
  };
}

