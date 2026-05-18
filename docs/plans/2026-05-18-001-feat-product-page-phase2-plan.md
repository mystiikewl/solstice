```yaml
id: 2026-05-18-001
type: feat
title: Product page Phase 2 — vendor badge wiring + block iteration
status: completed
created: 2026-05-18
origin: docs/SOLSTICE_V1_ROADMAP.md (Phase 2.3 Phase 2)
```

# Product Page Phase 2 — Vendor Badge Wiring + Block Iteration

## Summary

Phase 2.3 Phase 1 built 5 custom product blocks and wired most of them into `templates/product.json`. Two items remain:
- **`solstice-vendor-badge`** — block is fully implemented but not yet wired into the product template
- **Block iteration** — quality review and polish of all existing custom blocks

This plan covers both items.

## Scope Boundaries

**In scope:**
- Wire `solstice-vendor-badge` into `templates/product.json` (block entry + block_order positioning)
- Refactor all 6 custom blocks to OS3 architecture (thin block → snippet delegation)
- Align CSS tokens with Horizon OS3 conventions
- Align schema labels with translation key conventions
- Align JS file naming with `component-*` convention
- Review companion JS files for cleanup and accessibility

**Deferred to follow-up work:**
- Phase 2.5 — Product documents panel + TDS zone migration to `custom.product_documents` metaobject
- Phase 2.6 — Product description split (short_description + full body section)
- Phase 1.1/1.3/1.4 — Design system documentation updates

## Implementation Units

### U1. Wire vendor badge into product template

**Goal:** Add `solstice-vendor-badge` as a block in `templates/product.json` so it renders in the product details column.

**Requirements:**
- The block is complete but has no entry in `templates/product.json`
- Must be added as a child of `_product-details` alongside the other custom blocks
- Must be positioned inside `group_header` (which contains vendor text, title, SKU, price) — replaces the current upstream `text_vendor` block

**Dependencies:** None.

**Files:**
- `templates/product.json` — modify

**Approach:**
1. Add a `vendor_badge` block entry under `product-details` > `blocks` with `type: "solstice-vendor-badge"`. Set defaults: `show_logo: false` (text-only by default to avoid empty image placeholders).
2. Add `vendor_badge` to `group_header` > `block_order`, positioned before `text_title`.
3. Remove `text_vendor` from `group_header` > `block_order` since the vendor badge block replaces it.

**Test scenarios:**
1. Vendor badge renders when no `logo_image` is set — displays vendor name as text only
2. Vendor badge renders with `logo_image` set — displays logo image alongside vendor name
3. Vendor badge links to vendor collection when `vendor_url` is configured
4. Vendor badge auto-links to vendor collection when `vendor_url` is empty and a matching collection exists (`collections[vendor_handle]`)

**Test expectation:** None beyond verifying the block renders without errors and passes `shopify theme check`.

**Verification:** `shopify theme check` passes. Block renders in theme editor preview and on product pages.

---

### U2. Refactor blocks to OS3 architecture

**Goal:** Restructure all 6 custom blocks to follow the OS3 "thin block → snippet delegation" pattern. Each block should be ~30 lines (excluding schema): a `{% render %}` call with generic params + the schema. Markup and CSS move to snippets.

**Requirements:**
- OS3 file size limits: blocks ~30 lines (excl. schema), snippets ~80 lines (excl. stylesheet)
- Snippets use generic params pattern — mapping from `block.settings`/metafields to generic params happens in the block, not the snippet
- Each snippet gets its own `{% stylesheet %}` block
- Snippet naming: by what they render, not what uses them (per OS3 naming convention)

**Dependencies:** U1 (vendor badge wiring must happen first so refactoring targets the correct block structure).

**Files:**
- `blocks/solstice-vendor-badge.liquid` — refactor to thin pass-through
- `blocks/solstice-buy-mode-toggle.liquid` — refactor to thin pass-through
- `blocks/solstice-trust-badges.liquid` — refactor to thin pass-through
- `blocks/solstice-sealant-calculator.liquid` — already uses `{% render 'sealant-calculator' %}` pattern; verify alignment
- `blocks/solstice-quote-form.liquid` — refactor to thin pass-through
- `blocks/solstice-tds-zone.liquid` — refactor to thin pass-through
- `snippets/vendor-badge.liquid` — create (markup + stylesheet)
- `snippets/buy-mode-toggle.liquid` — create (markup + stylesheet)
- `snippets/trust-badges.liquid` — create (markup + stylesheet)
- `snippets/quote-form.liquid` — create (markup + stylesheet)
- `snippets/tds-zone.liquid` — create (markup + stylesheet)

**Approach:**
For each block (except `solstice-sealant-calculator` which already delegates):
1. Extract the Liquid markup + `{% stylesheet %}` block into a new snippet file
2. Replace block body with a single `{% render 'snippet-name', param: value, ... %}` call
3. Map `block.settings` to generic params in the render call
4. Verify snippet stays under ~80 lines (excluding stylesheet) — decompose further if needed
5. Update `docs/customizations/sections.md` with new snippet references

**Test scenarios:**
1. Each refactored block renders identically to pre-refactor output
2. Block settings in theme editor still control all configurable values
3. `shopify theme check` passes with no new warnings
4. Sealant calculator snippet (`sealant-calculator.liquid`) already exists — verify it follows generic params pattern

**Verification:** Visual comparison before/after on a product page. All blocks render identically. Theme check passes.

---

### U3. CSS token and naming alignment

**Goal:** Align CSS variables, JS file naming, and schema conventions with OS3 standards.

**Requirements:**
- CSS tokens must use Horizon OS3 naming (e.g., `var(--gap-sm)`, `var(--padding-sm)`, `var(--style-border-radius-popover)`, `var(--opacity-05)`)
- JS files should follow `component-kebab-case.js` naming convention
- Schema labels should use translation keys (`t:names.*`, `t:settings.*`, `t:content.padding`)
- Media queries should be mobile-first (`min-width: 750px`) not desktop-first (`max-width`)

**Dependencies:** U2 (refactoring must happen first since CSS lives in snippets after refactor).

**Files:**
- `snippets/vendor-badge.liquid` — CSS token audit
- `snippets/buy-mode-toggle.liquid` — CSS token audit
- `snippets/trust-badges.liquid` — CSS token audit
- `snippets/quote-form.liquid` — CSS token audit
- `snippets/tds-zone.liquid` — CSS token audit
- `snippets/sealant-calculator.liquid` — CSS token audit (if not already aligned)
- `assets/component-buy-mode-toggle.js` — rename from `solstice-buy-mode-toggle.js`
- `assets/component-sealant-calculator.js` — rename from `solstice-sealant-calculator.js`
- `assets/component-quote-form.js` — rename from `solstice-quote-form.js`
- `blocks/solstice-buy-mode-toggle.liquid` — update script src after rename
- `blocks/solstice-sealant-calculator.liquid` — update script src after rename
- `blocks/solstice-quote-form.liquid` — update script src after rename

**Approach:**
1. Audit all CSS variables against the Horizon OS3 token list. Replace hardcoded fallbacks with proper token references.
2. Rename JS files from `solstice-*.js` to `component-*.js`. Update the `<script src>` references in the corresponding blocks.
3. Update schema labels to use translation keys where available. Add `t:content.padding` header for spacing settings.
4. Convert any `max-width` media queries to mobile-first `min-width: 750px` pattern.
5. Verify `reduced-motion` media query is present on any block with transitions/animations.

**Test scenarios:**

| Area | Scenario | Expected |
|------|----------|----------|
| CSS tokens | All blocks reference theme variables | No hardcoded color/spacing values |
| JS renaming | Blocks load renamed JS files | No 404s in network tab; custom elements register |
| Schema | Labels use translation keys | `shopify theme check` passes; labels render correctly |
| Responsive | Viewport ≥750px | Desktop styles apply via `min-width` media queries |
| Reduced motion | User has `prefers-reduced-motion: reduce` | Transitions disabled in buy mode toggle, calculator modal |

**Verification:** `shopify theme check` passes. No console errors. Visual comparison before/after on product page.

---

### U4. Quality iteration and accessibility review

**Goal:** Final pass on JS cleanup, accessibility, and edge case handling across all blocks.

**Requirements:**
- JS custom elements should clean up event listeners and observers in `disconnectedCallback`
- Interactive blocks should follow Horizon accessibility patterns (focus trap, ARIA roles, keyboard navigation)
- Blocks should handle loading/empty/error states gracefully

**Dependencies:** None.

**Files:**
- `assets/component-buy-mode-toggle.js` — review/fix
- `assets/component-sealant-calculator.js` — review/fix
- `assets/component-quote-form.js` — review/fix
- `snippets/buy-mode-toggle.liquid` — accessibility audit
- `snippets/trust-badges.liquid` — accessibility audit
- `snippets/quote-form.liquid` — accessibility audit
- `snippets/tds-zone.liquid` — accessibility audit
- `snippets/vendor-badge.liquid` — accessibility audit

**Approach:**
Review each custom element and snippet:

1. **JS cleanup** — verify `MutationObserver.disconnect()` and `removeEventListener` are called in `disconnectedCallback` for all custom elements
2. **Accessibility** — verify `role`, `aria-*`, focus management, and keyboard navigation. The sealant calculator modal should properly trap/restore focus. The buy mode toggle should use `role="radiogroup"` and `role="radio"`.
3. **Empty state handling** — verify blocks that depend on conditions (calculator tags, TDS URLs, vendor presence) hide gracefully when those conditions aren't met

**Test scenarios:**

| Area | Scenario | Expected |
|------|----------|----------|
| Buy mode toggle | Product has only single variants (no box pattern) | Block breaks (hides) gracefully |
| Buy mode toggle | Variant picker not yet rendered in DOM during `connectedCallback` | Toggle waits silently; no console error |
| Buy mode toggle | User rapidly clicks both toggle options | `#setActive` guards against redundant updates; no flickering |
| Sealant calculator | Modal opened and closed repeatedly | Focus restores correctly; no trapped tab state |
| Sealant calculator | Custom unit size entered then preset selected | Custom size input resets properly |
| Sealant calculator | ATC clicked with network error | Error is displayed; button re-enables |
| Quote form | Form submitted successfully | Success state renders; step UI resets |
| Quote form | Step 1 validation fails | Native `checkValidity()` catches it; no advance |
| TDS zone | No metafields and no manual URLs set | Block hides (no empty container) |
| TDS zone | Both TDS and SDS URLs available | Both links render; proper `target="_blank"` + `rel="noopener"` |
| Vendor badge | Vendor is empty string | Block breaks gracefully |

## Key Technical Decisions

- **Vendor badge placement:** Inside `group_header` replacing the upstream `text_vendor` block. This matches the Phase 2.2 zone map where vendor info sits above the title in the header group.
- **Default to text-only:** `show_logo: false` by default so the badge renders vendor name only unless a logo image is explicitly configured per product category.
- **OS3 block → snippet split:** All inline blocks refactored to thin pass-throughs (`{% render %}` + schema) with markup/CSS extracted to snippets. `solstice-sealant-calculator` already follows this pattern.
- **JS file naming:** Rename from `solstice-*.js` to `component-*.js` per OS3 convention. Block `<script src>` references updated accordingly.
- **CSS token alignment:** Replace any hardcoded fallbacks with proper Horizon OS3 token references. Use `var(--gap-sm)`, `var(--padding-sm)`, `var(--style-border-radius-popover)`, `var(--opacity-05)` etc.
- **Mobile-first CSS:** Convert `max-width` media queries to `min-width: 750px` pattern per OS3 standard.

## Risks

- **Theme editor auto-formatting:** `templates/product.json` is auto-generated and may be reformatted by the theme editor if re-saved. Fine to edit manually; if the editor overwrites changes, the vendor badge can be re-added via the theme editor UI.
- **OS3 refactoring regression:** Extracting block markup into snippets changes file boundaries. Visual comparison before/after is essential to catch any rendering differences.
- **JS file renaming:** Renaming `solstice-*.js` to `component-*.js` requires updating all `<script src>` references in blocks. Missing one reference causes a 404 and broken custom element.
- **CSS token mismatches:** If Horizon OS3 token names differ from expected (e.g., `--gap-sm` vs `--spacing-sm`), blocks will render with broken styles. Verify tokens against the theme's actual CSS custom properties before committing.
- **Snippet decomposition:** Some blocks (quote form at 314 lines, trust badges at 187 lines) may need to be split into multiple sub-snippets to stay under the ~80 line limit. This adds complexity but is required by OS3.
