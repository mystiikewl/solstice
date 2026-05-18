# Sections Customizations

## `solstice-mega-nav` (custom header + navigation)

- Files: `sections/solstice-mega-nav.liquid`
- Wired by: `sections/header-group.json` (`"type": "solstice-mega-nav"`)
- Purpose: custom Solstice header + navigation UI.
- Mobile pattern: progressive disclosure (each depth is a panel that slides in; back button returns to the previous panel).
- Mobile DOM contract (required by `assets/solstice-mega-nav.js`):
- Drawer root is a `<details>` element with `data-mobile-menu`.
- Hamburger is the `<summary>` inside that details.
- Close affordances are any element with `data-mobile-drawer-close` (overlay + close button).
- Each depth view is a `[data-mobile-panel]` element.
- The currently visible mobile panel is marked with `data-active`.
- Forward navigation controls use `data-mobile-nav-forward` + `aria-controls="<panel-id>"`.
- Back navigation controls use `data-mobile-nav-back` + `aria-controls="<panel-id>"`.
- Implementation notes:
- Root panel is `#mega-nav-mobile-root-{{ section.id }}` and starts with `data-active`.
- Each submenu level is rendered as its own panel `id` and referenced only via `aria-controls`.
- View all links appear when a parent item has a URL and are rendered at the top of that child panel.
- Debug checklist:
- Hamburger opens but nothing changes: confirm CSS for `[data-mobile-panel][data-active]` is visible and siblings are hidden/translated.
- Forward/back does nothing: confirm `aria-controls` points at an existing `id` and the button has `data-mobile-nav-forward` or `data-mobile-nav-back`.
- Drawer closes but gets stuck: confirm `data-mobile-menu` is a `<details>` and close elements use `data-mobile-drawer-close` (not `data-drawer-close`).

## Product page custom blocks (Phase 2.3)

Custom theme blocks added to the upstream `product-information` section. All configurable in theme editor.

### `solstice-buy-mode-toggle` (Single/Box Buy toggle)

- File: `blocks/solstice-buy-mode-toggle.liquid`
- JS: `assets/solstice-buy-mode-toggle.js`
- Purpose: Detects Single vs Box variant patterns, renders a prominent toggle with price comparison.
- Custom element: `<solstice-buy-mode-toggle>` extends `Component`.
- DOM contract:
  - Option buttons have `data-mode="single|box"`, `data-value`, and `data-active`.
  - Reads variant picker via `document.querySelector('variant-picker[data-product-id]')`.
  - Syncs with upstream `variant-picker` by finding and checking the matching radio input.
- Settings: `single_keywords`, `box_keywords`, `show_unit_savings`.
- Debug: If toggle does not appear, product must have both single and box keywords in the same option (e.g. Package Type with Single Tube and Box of 20).

### `solstice-vendor-badge` (Brand logo display)

- File: `blocks/solstice-vendor-badge.liquid`
- Purpose: Shows vendor name and optional logo. Links to vendor collection.
- No JS. Pure Liquid render.
- Settings: `show_logo`, `logo_image`, `vendor_url`.
- Note: Built but not yet wired into `product.json` block_order (planned for Phase 2.3 Phase 2).

### `solstice-sealant-calculator` (Coverage calculator)

- File: `blocks/solstice-sealant-calculator.liquid`
- JS: `assets/solstice-sealant-calculator.js`
- Purpose: Two-part sealant coverage calculator — trigger card opens centered modal dialog with joint dimension inputs, preset jobs, unit size selection, wastage toggle, and add-to-cart integration.
- Custom element: `<solstice-sealant-calculator>` extends `Component`.
- DOM contract:
  - Trigger: `[ref="triggerButton"]` with `aria-controls` pointing to modal ID.
  - Modal: `[ref="modal"]` with `role="dialog"`, `aria-modal="true"`, `data-calculator-modal`.
  - Close: `[data-close-calculator-modal]` on overlay and close button.
  - Inputs: `[ref="jointLength"]`, `[ref="jointWidth"]`, `[ref="jointDepth"]`.
  - Presets: `[ref="presetSelect"]` with values matching `PRESETS` keys in JS.
  - Unit size: `[ref="unitSize[]"]` radio group (300/600/custom).
  - Custom size: `[ref="customUnitSize"]` (disabled unless custom radio selected).
  - Wastage: `[ref="wastageToggle"]` checkbox.
  - Summary: `[ref="summaryVolume"]`, `[ref="summaryUnits"]`, `[ref="summaryPlaceholder"]`, `[ref="summaryContent"]`.
  - Results: `[ref="resultsContainer"]`, `[ref="totalSealant"]`, `[ref="totalUnits"]`.
  - Variant select: `[ref="calculatorVariantSelect"]` (shown when product has multiple variants).
  - ATC: `[ref="addToCartBtn"]`, `[ref="atcButtonText"]`, `[ref="atcFeedback"]`.
  - Error: `[ref="errorContainer"]`, `[ref="errorText"]`.
- Calculation: `volume_ml = length_m * 1000 * width_mm * depth_mm * 0.001`, with optional 10% wastage. Units = `ceil(volume_ml / unit_size_ml)`.
- ATC flow: POST to `/cart/add.js` with variant ID and calculated quantity. Dispatches `ThemeEvents.cartUpdate` on success.
- Focus management: `trapFocus` on open, `removeTrapFocus` on close, Escape-to-close.
- Conditionally visible: shows only for products with tag `sealant-calculator`.
- Settings: `heading`, `subtitle`, `trigger_label`, `calculator_tags`, `force_show`, `default_volume_ml`.

### `solstice-quote-form` (Trade quote request)

- File: `blocks/solstice-quote-form.liquid`
- JS: `assets/component-quote-sheet.js`, `assets/component-quote-form.js`
- Purpose: compact trigger that opens a quote sheet (desktop right sheet, mobile bottom sheet) with 2-step form flow.
- Custom elements: `<solstice-quote-sheet>` and nested `<solstice-quote-form>` extend `Component`.
- DOM contract:
  - Trigger: `[ref="triggerButton"]`, `aria-controls`, `aria-expanded`.
  - Sheet dialog: `[ref="sheet"]`, `[data-close-bulk-quote-sidebar]`.
  - Step containers: `[data-step="1"]` and `[data-step="2"]`.
  - Navigation: `[data-next-step]` and `[data-prev-step]` buttons.
  - Metadata/analytics attributes: `data-bulk-quote-form`, `data-bulk-quote-source`, `data-bulk-quote-variant`.
- Submits via Shopify `{% form 'contact' %}`.
- Variant behavior: renders bulk variant when product has `bulk-discount` tag; otherwise renders general quote variant.
- Settings: `enable_sheet`, `heading`, `subtitle`, `trigger_label`, `button_label`, `success_message`, `bulk_heading`, `bulk_subtitle`, `bulk_trigger_label`.

### `solstice-tds-zone` (Technical document downloads)

- File: `blocks/solstice-tds-zone.liquid`
- Purpose: TDS/SDS download links. Reads from product metafields (`custom.tds_url`, `custom.sds_url`) or manual URL settings.
- No JS. Pure Liquid render.
- Conditionally visible: hidden if no URLs are found.
- Settings: `heading`, `use_metafields`, `tds_url`, `sds_url`.
- Note: Legacy metafield pattern. Migration to `custom.product_documents` metaobject planned (Phase 2.5).
