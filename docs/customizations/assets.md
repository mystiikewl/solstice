# Assets Customizations

## `solstice-mega-nav.js` (header controller + mobile progressive disclosure)

- File: `assets/solstice-mega-nav.js` (loaded by `sections/solstice-mega-nav.liquid` as a module)
- Custom element: `MegaNavHeader extends HTMLElement` for the `<mega-nav-header>` root.
- Responsibilities (desktop): trigger/panel open/close, inert management, focus trap, Escape-to-close.
- Responsibilities (mobile): controls the `<details data-mobile-menu>` drawer and progressive disclosure panel navigation.
- Mobile behavior contract:
- Clicking `data-mobile-nav-forward` / `data-mobile-nav-back` reads `aria-controls`, clears `data-active` from all `[data-mobile-panel]`, then sets `data-active` on the target panel.
- Closing the drawer resets to root: `#closeMobileMenu()` removes `open` from the `<details>` and `#resetMobileMenu()` marks the first `[data-mobile-panel]` active.
- Key selectors: `[data-mobile-menu]`, `[data-mobile-panel]`, `[data-mobile-nav-forward]`, `[data-mobile-nav-back]`, `[data-mobile-drawer-close]`.
- Known failure mode: “click hamburger, page locks, but drawer is invisible” is usually a markup/CSS mismatch; this component relies on `data-active` (not `aria-expanded`) to choose which mobile panel is visible.
- Test plan (mobile): open hamburger, drill down 2 levels, go back, close via overlay, re-open and confirm it resets to the root panel.
