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
- Known failure mode: click hamburger, page locks, but drawer is invisible is usually a markup/CSS mismatch; this component relies on `data-active` (not `aria-expanded`) to choose which mobile panel is visible.
- Test plan (mobile): open hamburger, drill down 2 levels, go back, close via overlay, re-open and confirm it resets to the root panel.

## `solstice-buy-mode-toggle.js` (Single/Box buy mode controller)

- File: `assets/solstice-buy-mode-toggle.js` (loaded by `blocks/solstice-buy-mode-toggle.liquid` as a module)
- Custom element: `SolsticeBuyModeToggle extends Component` for `<solstice-buy-mode-toggle>`.
- Responsibilities: detects Single vs Box variant keywords, renders toggle UI, syncs selection 2-way with upstream `variant-picker`.
- Sync mechanism: finds the variant-picker radio input matching the selected mode value and dispatches a `change` event. Uses MutationObserver on the variant picker to detect external changes and update toggle state.
- Key selectors: `variant-picker[data-product-id]`, `[data-mode]`, `[data-active]`, `input[type="radio"]` inside variant picker fieldsets.
- Settings read from block: `single_keywords`, `box_keywords`, `show_unit_savings` (via data attributes on the custom element).

## `solstice-sealant-calculator.js` (coverage calculator controller)

- File: `assets/solstice-sealant-calculator.js` (loaded by `blocks/solstice-sealant-calculator.liquid` as a module)
- Custom element: `SealantCalculator extends Component` for `<solstice-sealant-calculator>`.
- Responsibilities: manages modal open/close with focus trap, preset job selection, real-time preview calculation, unit size handling (300/600/custom), wastage toggle, add-to-cart integration.
- Static calculation engine: `SealantCalculator.calculate(lengthM, widthMm, depthMm, unitSizeMl, includeWastage)` — pure function, no side effects.
- Preset map: 10 job types (bath_tub, kitchen_sink, window_frame, expansion_joint, concrete_slab, metal_cladding, roof_flashing, floor_joint, pipe_penetration, general_gap) with recommended width/depth values.
- ATC flow: POST to `/cart/add.js` with variant ID and calculated quantity. On success, dispatches `ThemeEvents.cartUpdate` and closes sidebar.
- Focus management: imports `trapFocus`/`removeTrapFocus` from `@theme/focus`. Traps focus in modal on open, releases on close. Escape key closes modal.
- Key selectors: `[ref="modal"]`, `[ref="triggerButton"]`, `[data-close-calculator-modal]`, `[ref="jointLength|Width|Depth"]`, `[ref="presetSelect"]`, `[ref="unitSize[]"]`, `[ref="wastageToggle"]`, `[ref="addToCartBtn"]`.

## `solstice-quote-form.js` (2-step quote form controller)

- File: `assets/solstice-quote-form.js` (loaded by `blocks/solstice-quote-form.liquid` as a module)
- Custom element: `SolsticeQuoteForm extends Component` for `<solstice-quote-form>`.
- Responsibilities: manages 2-step progressive disclosure. Step 1 has required fields (qty, name, email). Step 2 has optional fields (phone, company, industry, suburb, notes).
- Validates Step 1 required fields via native `checkValidity()` before advancing.
- Key selectors: `[data-step="1"]`, `[data-step="2"]`, `[data-next-step]`, `[data-prev-step]`.
