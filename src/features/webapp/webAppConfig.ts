/**
 * EA Sports FC Web App WebView configuration & constants.
 */

// Official EA Sports FC Web App URL
export const EA_WEBAPP_URL = 'https://www.ea.com/ea-sports-fc/ultimate-team/web-app/';

/**
 * Modern Chrome Android User-Agent (Clean Mobile Chrome, without '; wv' WebView token).
 * Prevents EA Authentication & Akamai CDN from blocking CSS stylesheets, logos, and OAuth login flows.
 */
export const EA_CHROME_USER_AGENT =
  'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.102 Mobile Safari/537.36';

/**
 * Safe viewport script: ensures viewport scaling on the main Web App
 * while avoiding interference with EA Sign-In (signin.ea.com) native layout and colors.
 */
export const INJECTED_VIEWPORT_SCRIPT = `
  (function() {
    try {
      var host = window.location.hostname || '';
      // Do not override background or styles on authentication pages
      if (host.includes('signin') || host.includes('accounts')) {
        return;
      }
      var meta = document.querySelector('meta[name="viewport"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'viewport';
        document.head.appendChild(meta);
      }
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.body.style.backgroundColor = '#0A0A0A';
    } catch(e) {}
  })();
  true;
`;
