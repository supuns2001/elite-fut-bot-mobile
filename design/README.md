# EliteFutBot – Modern redesign (onboarding + home)

Design source exported from Claude Design. These are **reference files**, not runnable app code.

## Files
- `screens/01-Register.html` – Create account
- `screens/02-Splash.html` – Splash / loading
- `screens/03-Intro.html` – 3-step intro carousel
- `screens/04-SignIn.html` – Sign in + forgot password sheet
- `screens/05-Paywall.html` – Mobile add-on paywall
- `screens/06-Home.html` – Home
- `screens/07-WebApp.html` – EA Web App + sniping controls drawer
- `components/StatusBar.html`, `components/TabBar.html` – shared parts
- `components/ActivityLog.html` – log sheet opened from Web App → "Activity log"
- `assets/logo.png`, `assets/logo-large.png` – app logo

Import names with suffixes (`MinStatusBar-l8wk`, `MinStatusBar-o3ji`, `MinTabBar-1qei`, `MinConsole-4x36`) are the same components above.

## How to read them
- Markup is HTML with inline styles. `{{value}}` = a dynamic value.
- `<sc-if value="{{x}}">` = render only when x is true. `<sc-for list="{{items}}">` = loop.
- `<dc-import name="MinStatusBar">` / `MinTabBar` = the components in `/components`.
- The `<script type="text/x-dc">` block at the bottom of each file holds the state + logic (React-like class: `state`, `setState`, `renderVals()` returns the values used in the markup).
- Frame size: 390 × 844 (iPhone 14).

## Design tokens
- Background `#0A0A0A`, surfaces `#141414` / `#1A1A1A` / `#1E1E1E`, borders `#262626`
- Accent (lime) `#CBF21D`, warning `#F5B841`, error `#FF8A80`
- Text `#FAFAFA`, muted `#A1A1A1`, faint `#808080`
- Fonts: Geist (UI), Geist Mono (numbers/logs)
- Radii: inputs 18, cards 22–28, pill buttons 28 (56px tall)

## Prompt to give your IDE agent
> Build an Expo (React Native + TypeScript) app from the design files in `/design`.
> Recreate every screen in `screens/` pixel-for-pixel using the tokens in README.md.
> Turn `components/StatusBar` and `components/TabBar` into shared components (use the real device status bar / safe area instead of the fake one).
> Port each file's `<script type="text/x-dc">` logic into React state/hooks.
> Navigation: Splash → Intro → Sign in / Register → Home (or Paywall if no mobile access). Tabs: Home, Web App, Help, Profile.
> Use expo-router, react-native-svg for icons, and expo-font for Geist.

Note: the files can't be opened directly in a browser (they need Claude Design's runtime). Add screenshots of each screen to `/design/screenshots` so the agent can match the look exactly.
