# EliteFutBot Mobile – Profile Page Future Enhancements & Roadmap

This document records the architectural, UI/UX, and backend feature suggestions identified for the **Profile Screen** (`app/(tabs)/profile.tsx`). While the current version strictly adheres to the minimalist Claude Design specification (`screenshots/ProfileScreen · modern@2x.png`), these items can be phased in as the product evolves.

---

## 1. Referral Program Integration

### UI Component: `ProfileReferralCard.tsx`
- **Current State:** Fully built in `src/features/profile/ProfileReferralCard.tsx` with copy-to-clipboard animation (`✓ Copied`), but unmounted to preserve the minimalist screenshot design.
- **Proposed Integration:**
  - Display user's unique 6-character referral code (generated at registration: e.g. `A4F91C`).
  - One-tap copy with native clipboard interaction.
  - "Share with friends" native share sheet.
- **Backend Needs:**
  - `GET /api/users/referrals`: Return total referred users count and earned rewards.
  - Automatic Trial Extension logic: Grant +2 days to referrer when a referred user joins or upgrades.

---

## 2. Discord Community & Support Link

### UI Component: `ProfileLinksCard.tsx` / `ProfileMoreGroup.tsx`
- **Current State:** Discord URL (`https://discord.gg/Rkb9nF6WG6`) is in `ProfileLinksCard.tsx`, but omitted from the active 5-row `ProfileMoreGroup`.
- **Proposed Integration:**
  - Add a "Join Discord Community" row to the `More` group with the official Discord icon (`#5865F2`).
  - Provides direct access to sniper filters, meta settings, and community announcements.

---

## 3. Subscription Upgrade & Billing Management

### UI Component: `ProfileAccountCard.tsx` / Paywall Modal
- **Current State:** Displays plan name (`Pro Sniper + Mobile` or `2-Day Free Trial`) and expiry with a "Refresh" button.
- **Proposed Integration:**
  - When trial is active or expired, show an "Upgrade to Pro" neon lime (`#CBF21D`) action button or banner.
  - Stripe Customer Portal / Checkout Session launch (`POST /api/subscription/create-checkout`).
  - Promo code / license key redemption dialog (`POST /api/subscription/redeem`).

---

## 4. Preferences Persistence & Global Hooking

### UI Component: `ProfilePreferencesGroup.tsx`
- **Current State:** Toggles (`Purchase alerts`, `Haptics`, `Keep screen awake`) use local in-memory React state (`useState(true)`).
- **Proposed Integration:**
  - **Local Persistence:** Save user preference changes to `AsyncStorage` (`@elite_fut_bot_preferences`).
  - **Global Hook:** Wire `haptics` toggle into `FloatingEdgeBotDock`, bottom controls, and bot notifications so disabling it mutes all device vibrations.
  - **Cloud Sync:** `PUT /api/users/preferences` to sync preferences across devices.
  - **FCM Push Notifications:** Endpoint `POST /api/users/fcm-token` to register device tokens for push alerts when cards are sniped in the background.

---

## 5. Real Cache & Session Clearing

### UI Component: `ProfileClearCacheSheet.tsx`
- **Current State:** Displays confirmation bottom sheet; on confirmation, shows a mock toast `"✓ Cache and session cleared"`.
- **Proposed Integration:**
  - **WebView Clearing:** Invoke `CookieManager.clearAll()` and `WebView.clearCache(true)` to genuinely wipe EA Web App cookies, local storage, and session caches.
  - **Server-Side Token Revocation:** Optional `POST /api/auth/logout` or `POST /api/auth/clear-session` to revoke active refresh tokens in MongoDB.

---

## 6. Account Security & Store Compliance

### UI Component: Security Modal / Row in More Group
- **Proposed Integration:**
  - **Change Password:** In-app sheet allowing authenticated users to change their password via `PUT /api/auth/change-password`.
  - **Delete Account (Store Policy):** Apple App Store and Google Play Store requirement for accounts created in-app. Include a destructive "Delete Account" flow with confirmation.
  - **Profile Information Editing:** Ability to update First Name and Last Name (`PUT /api/users/profile`).

---

## 7. Historical Activity Logs & Analytics

### UI Component: `ActivityLogSheet.tsx`
- **Current State:** Shows in-memory logs recorded during the current app session.
- **Proposed Integration:**
  - Fetch historical purchase records from MongoDB (`GET /api/users/recent-purchases` or `GET /api/users/activity-logs`).
  - Filter by date range and view cumulative profits over time.

