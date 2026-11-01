export type BotTabType = "safe" | "caution" | "risky";

export type BotLogLevel = "info" | "success" | "warning" | "error";

// A card row in the console's Filter Snipe results table.
export interface BotLogCard {
  name: string;
  rating: number;
  buyNowPrice: number;
  // Seconds until the auction ends.
  expires: number;
}

// Optional structure behind a log line, so the console can render it as
// more than text (loop headers, a results table, buy/snipe cards). The
// plain `message` is always kept too, for logs and older consoles.
export type BotLogDetail =
  | { kind: "start" }
  | { kind: "stop" }
  | {
      kind: "loop";
      loop: number;
      filterMode: boolean;
      minPrice: number;
      maxPrice: number;
    }
  | { kind: "search"; filters: string[]; rating: string | null }
  | {
      kind: "results";
      total: number;
      cheapest: number | null;
      highest: number | null;
      // Cheapest first, at most FILTER_LOG_MAX_CARDS of them.
      cards: BotLogCard[];
      // Index into `cards` of the card the bot will try to buy, if any.
      targetIndex: number | null;
    }
  | { kind: "alert"; title: string; body: string }
  | { kind: "buy"; name: string; price: number; reactionMs: number }
  | {
      kind: "snipe";
      name: string;
      rating?: number;
      price: number;
      // Max Price minus what was paid.
      underMax: number | null;
      // Auto-list is off: the card waits in Unassigned.
      listManually: boolean;
    };

export interface BotRunLoopPayload {
  minPrice: number;
  maxPrice: number;
  minBid?: number;
  maxBid?: number;
  autoList: boolean;
  listMinPrice: number | null;
  listMaxPrice: number | null;
  // "List for target profit": when set, listing is priced from the bought
  // price instead of listMinPrice/listMaxPrice (see botLogic.ts).
  listTargetProfit?: number | null;
  // "List for fixed price": when set, every card is listed with this Buy
  // Now regardless of the bought price (see botLogic.ts).
  listFixedPrice?: number | null;
  purchaseLimit: number | null;
  currentPurchases: number;
  maxPurchasesPerSearch: number;
  minRating?: number | null;
  maxRating: number | null;
  cardRating: number | null;
  actionDelayMs: number;
  actLikeHuman?: boolean;
  humanPlusPlus?: boolean;
  // Filter Snipe: search with only the EA filters the user set (Quality,
  // Position, League, ...) and buy any card under max price — no player
  // name required. Omitted/false = single-player mode.
  filterMode?: boolean;
}

export interface BotLoopResult {
  ok: boolean;
  stopped?: boolean;
  error?: string;
  boughtCount?: number;
  estimatedProfit?: number;
  spent?: number;
  searchedCount?: number;
}

export interface BotProgressPayload {
  level: BotLogLevel;
  message: string;
  detail?: BotLogDetail;
}

export interface BotPurchasePayload {
  name: string;
  rating?: number;
  price: number;
  tradeId?: number | string;
}

export interface BotPlayerInfoPayload {
  name: string;
  rating?: number;
  maskedDefId?: number | null;
  // Sent when the user searched for a player in EA's own UI (not by the
  // bot), so the panel can preview that player before START.
  fromUserSearch?: boolean;
}

// Human-readable summary of the EA search filters used in Filter Snipe mode
// (e.g. ["Quality: Gold", "Position: Midfielders"]).
export interface BotFilterInfoPayload {
  filters: string[];
}

export interface BotLogPayload {
  action: string;
  params?: unknown;
  result?: unknown;
  error?: string;
}

export interface PageEnvelopeBase {
  source: "futsnipe-extension" | "futsnipe-page";
  requestId?: string;
}

export interface PageRunMessage extends PageEnvelopeBase {
  source: "futsnipe-extension";
  type: "FUTSNIPE_RUN";
  payload: BotRunLoopPayload;
}

export interface PageStopMessage extends PageEnvelopeBase {
  source: "futsnipe-extension";
  type: "FUTSNIPE_STOP";
}

export interface PageGetUserInfoMessage extends PageEnvelopeBase {
  source: "futsnipe-extension";
  type: "FUTSNIPE_GET_USER_INFO";
}

export type ExtensionToPageMessage =
  PageRunMessage | PageStopMessage | PageGetUserInfoMessage;

export interface PageResultMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "FUTSNIPE_RESULT";
  payload: BotLoopResult;
}

export interface PageProgressMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_PROGRESS";
  payload: BotProgressPayload;
}

export interface PagePurchaseMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_PURCHASE";
  payload: BotPurchasePayload;
}

export interface PagePlayerInfoMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_PLAYER_INFO";
  payload: BotPlayerInfoPayload;
}

export interface PageFilterInfoMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_FILTER_INFO";
  payload: BotFilterInfoPayload;
}

export interface BotUserInfoResultPayload {
  id?: number | string;
  selectedPersonaId?: number | string;
  personaName?: string;
  clubName?: string;
  clubAbbr?: string;
  platform?: string;
  coins?: number;
  error?: string;
}

export interface PageUserInfoResultMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_USER_INFO_RESULT";
  payload: BotUserInfoResultPayload;
}

export interface PageLogMessage extends PageEnvelopeBase {
  source: "futsnipe-page";
  type: "BOT_LOG";
  payload: BotLogPayload;
}

export type PageToExtensionMessage =
  | PageResultMessage
  | PageProgressMessage
  | PagePurchaseMessage
  | PagePlayerInfoMessage
  | PageFilterInfoMessage
  | PageUserInfoResultMessage
  | PageLogMessage;

export interface RuntimeBotRunLoopMessage {
  type: "BOT_RUN_LOOP";
  payload: BotRunLoopPayload;
  targetTabId?: number;
}

export interface RuntimeBotStopMessage {
  type: "BOT_STOP";
  targetTabId?: number;
}

export interface RuntimeBotOpenConsoleMessage {
  type: "BOT_OPEN_CONSOLE";
  targetTabId?: number;
}

export interface RuntimeBotPageEventMessage {
  type: "BOT_PAGE_EVENT";
  payload: PageToExtensionMessage;
}

export interface RuntimeBotEventRelayMessage {
  type: "BOT_EVENT_RELAY";
  payload: PageToExtensionMessage;
}

export interface RuntimeBotGetUserInfoMessage {
  type: "BOT_GET_USER_INFO";
  targetTabId?: number;
}

export interface RuntimeBotGetFutbinPlayerMessage {
  type: "BOT_GET_FUTBIN_PLAYER";
  searchTerm: string;
  fifaId: number;
  buyingPrice: number;
}

export interface RuntimeBotGetFutggPricesMessage {
  type: "BOT_GET_FUTGG_PRICES";
  fifaId: number;
  // Only fetch these platforms (e.g. retrying one failed price). Default: both.
  platforms?: ("console" | "pc")[];
}

export interface RuntimeBotToggleOverlayMessage {
  type: "BOT_TOGGLE_OVERLAY";
}

export interface RuntimeBotClickSequenceMessage {
  type: "BOT_CLICK_SEQUENCE";
  targetTabId?: number;
}

export interface BotClickSequenceResult {
  ok: boolean;
  error?: string;
}

export type RuntimeInboundMessage =
  | RuntimeBotRunLoopMessage
  | RuntimeBotStopMessage
  | RuntimeBotOpenConsoleMessage
  | RuntimeBotPageEventMessage
  | RuntimeBotGetUserInfoMessage
  | RuntimeBotGetFutbinPlayerMessage
  | RuntimeBotGetFutggPricesMessage
  | RuntimeBotToggleOverlayMessage
  | RuntimeBotClickSequenceMessage;

export type RuntimeOutboundMessage = RuntimeBotEventRelayMessage;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isPageToExtensionMessage(
  value: unknown
): value is PageToExtensionMessage {
  if (
    !isRecord(value) ||
    value.source !== "futsnipe-page" ||
    typeof value.type !== "string"
  ) {
    return false;
  }

  if (value.type === "FUTSNIPE_RESULT") {
    return isRecord(value.payload) && typeof value.payload.ok === "boolean";
  }

  if (value.type === "BOT_PROGRESS") {
    return (
      isRecord(value.payload) &&
      typeof value.payload.message === "string" &&
      (value.payload.level === "info" ||
        value.payload.level === "success" ||
        value.payload.level === "warning" ||
        value.payload.level === "error") &&
      (value.payload.detail === undefined ||
        (isRecord(value.payload.detail) &&
          typeof value.payload.detail.kind === "string"))
    );
  }

  if (value.type === "BOT_PURCHASE") {
    return (
      isRecord(value.payload) &&
      typeof value.payload.name === "string" &&
      typeof value.payload.price === "number"
    );
  }

  if (value.type === "BOT_PLAYER_INFO") {
    return isRecord(value.payload) && typeof value.payload.name === "string";
  }

  if (value.type === "BOT_FILTER_INFO") {
    return isRecord(value.payload) && Array.isArray(value.payload.filters);
  }

  if (value.type === "BOT_USER_INFO_RESULT") {
    return isRecord(value.payload);
  }

  if (value.type === "BOT_LOG") {
    return isRecord(value.payload) && typeof value.payload.action === "string";
  }

  return false;
}

export function isExtensionToPageMessage(
  value: unknown
): value is ExtensionToPageMessage {
  if (
    !isRecord(value) ||
    value.source !== "futsnipe-extension" ||
    typeof value.type !== "string"
  ) {
    return false;
  }

  if (value.type === "FUTSNIPE_STOP") {
    return true;
  }

  if (value.type === "FUTSNIPE_RUN") {
    return isRecord(value.payload);
  }

  if (value.type === "FUTSNIPE_GET_USER_INFO") {
    return true;
  }

  return false;
}
