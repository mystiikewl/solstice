# Continue — Sealant Calculator Modal Iteration

## What's done

- Sealant calculator rebuilt from simple inline form to modal dialog (commits `d1b0296`, `58b8687`)
- All 9 primitives implemented: trigger card, modal shell, presets (10 job types), dimension inputs, unit size selector (300/600/custom), wastage toggle, real-time preview, calculation engine, ATC integration
- Tag changed from `sealant,coverage-calculator` to `sealant-calculator`
- Files: `blocks/solstice-sealant-calculator.liquid`, `assets/solstice-sealant-calculator.js`, `locales/en.default.json`, `templates/product.json`
- All changes committed on `setup/project-foundation` branch

## Next action

Load the dev theme (`shopify theme push --store YOUR_STORE` or dev server) and visually test the modal on a product tagged `sealant-calculator`. Iterate on:
1. Modal sizing, spacing, and visual polish
2. Mobile responsiveness (bottom sheet vs centered modal)
3. Animation smoothness (scale+fade transition)
4. Input field styling and focus states
5. Preset dropdown behavior
6. ATC button state transitions

## Why

The calculator logic is complete and committed. The modal pattern works structurally but needs visual iteration — spacing, proportions, animation feel, and mobile behavior are all likely to need tweaking once seen on a real page.

## Open threads

- `solstice-vendor-badge` block is built but not wired into `product.json` block_order
- Phase 2.5 (product documents panel) and Phase 2.6 (description split) are on the roadmap but not started
- TDS zone still uses legacy `custom.tds_url`/`custom.sds_url` metafields — needs migration to `custom.product_documents`
- Typography, brand guidelines, and design system validation docs are still stale (Phase 1.1, 1.3, 1.4)

## Do not

- Do not change the calculation engine — it's pure and correct
- Do not change the tag from `sealant-calculator`
- Do not restructure the Liquid block's data attributes or ref names without updating the JS to match
