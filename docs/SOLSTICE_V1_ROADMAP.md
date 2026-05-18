# Solstice v1 Roadmap

> Blueprint for the full Solstice v1 build. Pick up any task in any session. Read the context files first.

---

## Context files

Every session starts by reading these:

| File | What it gives you |
|------|-------------------|
| `BUSINESS_PROFILE.md` | Company, customer, problem, strategic mission, v1 scope |
| `CONTEXT.md` | Domain terms, brand voice, design system state, key decisions |
| `CLAUDE.md` | Architecture, conventions, agent skills config |
| `docs/design/brand_voice.md` | Malcolm — full brand voice definition (locked) |
| `docs/design/brand-guidelines.md` | Current design tokens, buttons, badges, layout (needs update) |
| `docs/design/typography.md` | Current typography docs (needs update — Geist Bold + System UI) |
| `docs/design/color-system.md` | 5 Solstice color schemes — implemented in settings_data.json ✅ |
| `docs/analytics/findings.txt` | 28-day analytics data, drop-off analysis |
| `docs/agents/issue-tracker.md` | GitHub issue tracker config |
| `docs/agents/triage-labels.md` | Triage label vocabulary |
| `docs/agents/domain.md` | Domain docs consumer rules |

---

## Phase 1 — Design system realignment

The design docs are stale. Typography pivoted, brand guidelines reflect pre-pivot state. This phase makes the design system current so every build decision references accurate tokens.

**Status:** Color scheme revision complete. Typography and brand guidelines still pending.

### 1.1 Typography documentation update

**What:** Rewrite `docs/design/typography.md` to reflect the actual typography direction.

- **Headings:** Geist Bold (replace Montserrat Black Italic)
- **Body:** System UI (replace Poppins)
- **Accent:** Decide — keep Archivo, switch to something else, or drop the accent role entirely
- Update type scale, line heights, letter spacing for the new fonts
- Update CSS variable references
- Update fallback stacks (System UI already implies system fonts as fallback)
- Document the rationale: Geist/System UI is utility-first, lets Malcolm's words carry authority

**Done when:** Typography doc accurately reflects Geist Bold + System UI with complete specs, CSS variables, and usage guidelines.

**Context:** `docs/design/typography.md`, `docs/design/brand-guidelines.md`

---

### 1.2 Color scheme revision ✅

**What:** Revise the color system from 9 legacy schemes to what Solstice actually needs.

- Audit the 9 existing schemes against Malcolm's voice and the trust architecture
- Decide which schemes stay, which merge, which drop
- Ensure every scheme supports the trust signals (authority, real business, human access)
- Validate contrast ratios for new typography (Geist/System UI may render differently)
- The brand colors (Adheseal Red `#ea1f27`, Charcoal `#231f20`, Warm White `#f4f4f2`) are likely stable — validate
- Consider whether 9 schemes is too many for a clean, utility-first design

**Completed:** Reduced from 9 legacy Horizon schemes to 5 Solstice schemes (Default Light, Brand Light, Dark, Brand Dark, Brand Red Pop). Applied to `config/settings_data.json` (current + presets). Stale schemes removed. Color doc `docs/design/color-system.md` was already correct — implementation caught up.

**Context:** `docs/design/color-system.md`, `BUSINESS_PROFILE.md` → Trust architecture section

---

### 1.3 Brand guidelines update

**What:** Update `docs/design/brand-guidelines.md` to reflect current state after typography and color revisions.

- Replace all font references (Montserrat/Poppins → Geist/System UI)
- Update color scheme references to revised set
- Review design tokens (border radius, spacing, buttons, badges, form elements) — do they still work with the cleaner direction?
- Update animation settings
- Update file references section
- Remove "Future Enhancements" that are now decided

**Done when:** Brand guidelines doc is a current, accurate reference for the visual system.

**Context:** `docs/design/brand-guidelines.md`, updated typography doc, updated color doc

---

### 1.4 Design system validation

**What:** Review the complete design system as a whole to ensure coherence.

- Do the typography, colors, tokens, and Malcolm's voice all tell the same story?
- Does "confident utility, not flash" hold across every element?
- Are there contradictions between the visual system and the brand voice?
- Produce a short validation summary with any remaining gaps

**Done when:** Design system is coherent, documented, and ready to build against. No contradictions between visual docs and brand voice.

**Context:** All `docs/design/` files, `BUSINESS_PROFILE.md`

---

## Phase 2 — Product page (v1 priority #1)

The single highest-leverage surface. 50-61% bounce on top product pages including paid traffic. This is where the conversion problem lives.

### 2.1 Product page research ✅

**What:** Research what a high-converting trade product page looks like.

- Study 3-5 competitor/analogue product pages (trade supplies, B2B-leaning e-commerce)
- Identify trust signal placement patterns that convert
- Map the Malcolm voice content structure (from `brand_voice.md` body template) to theme layout
- Identify what Horizon's `product-information.liquid` section currently provides vs what's needed
- Determine what's a theme concern vs what's Shopify admin content (descriptions, images, metafields)

**Done when:** Clear understanding of what the product page needs to do, what Horizon provides, and what needs to be custom-built.

**Context:** `BUSINESS_PROFILE.md`, `docs/design/brand_voice.md` (body template section), `docs/analytics/findings.txt`, live store product pages

**Output:** `docs/product-page-research.md`

---

### 2.2 Product page architecture ✅

**What:** Design the product page section architecture.

- Decide: modify Horizon's `product-information.liquid` or build custom `solstice-product-information.liquid`?
- Map trust signals to specific zones on the page (hero, variant picker, description, specs, cross-sell, footer)
- Define the content hierarchy: what's above the fold, what's below, what's in collapsible sections
- Define the cross-sell zone ("you'll also need") — instruction-led, not upsell
- Mobile layout — 40% of traffic, on-site tradespeople
- Define what gets built into the section schema (configurable in theme editor) vs hardcoded

**Decision:** Upstream-first approach. `templates/product.json` already has trust signals, cross-sell, shipping info, accordion configured via upstream blocks. Only 5 custom blocks needed instead of a full custom section.

**Done when:** Architecture documented with zone map, section schema outline, and build/modify decision per component.

**Context:** Phase 1 design system, `sections/product-information.liquid`, `blocks/` (product-related blocks)

**Output:** `docs/product-page-architecture.md`

---

### 2.3 Product page build — Phase 1 ✅

**What:** Build the custom product page blocks and wire them into the upstream template.

**Built (5 custom blocks + 1 replacement):**

| Block | File | JS | Purpose |
|-------|------|----|---------|
| Buy mode toggle | `blocks/solstice-buy-mode-toggle.liquid` | `assets/solstice-buy-mode-toggle.js` | Single vs Box variant detection with price display and savings badge |
| Vendor badge | `blocks/solstice-vendor-badge.liquid` | — | Vendor logo + name display with optional image picker |
| Sealant calculator | `blocks/solstice-sealant-calculator.liquid` | `assets/solstice-sealant-calculator.js` | Coverage calculator (joint width × depth × length → tubes needed), tag-gated |
| Quote form | `blocks/solstice-quote-form.liquid` | `assets/solstice-quote-form.js` | 2-step progressive disclosure trade quote form (Shopify contact form) |
| TDS zone | `blocks/solstice-tds-zone.liquid` | — | TDS/SDS document download links, metafield-driven |
| Trust badges | `blocks/solstice-trust-badges.liquid` | — | 2×2 grid trust strip with inline SVG icons (replaces upstream group+text) |

**Wiring:** All blocks registered in `templates/product.json` under `_product-details`. Block order: header → trust badges → divider → buy mode toggle → variant picker → inventory → buy buttons → shipping → description → accordion → calculator → quote form → TDS zone.

**Pushed to:** Dev theme `Development (127dbc-MSI)` (#153109954752).

**Done when:** Product page renders correctly with trust architecture, Malcolm-voiced content structure, and design system tokens. Passes theme check.

**Context:** Phase 1 design system, architecture doc from 2.2, Horizon product sections/blocks

**Output:** `docs/customizations/sections.md`, `docs/customizations/assets.md` updated with all entries.

---

## Phase 2.5 — Product documents panel + TDS zone migration (adhoc)

**What:** Two surfaces, one data source — migrate to `custom.product_documents` metaobject and add a sticky bar entry point.

**Migration — `solstice-tds-zone`:**
- Rewrite `blocks/solstice-tds-zone.liquid` to read from `custom.product_documents` metaobject instead of legacy `custom.tds_url` / `custom.sds_url` flat metafields
- Remove the old metafield settings from the block schema (`use_metafields`, `tds_url`, `sds_url`)
- Render the metaobject list (document type, name, file) as structured download links
- Graceful empty state — block hides when no documents exist

**New — sticky bar button + panel:**
- Add secondary "Download product docs" button next to "Add to Cart" in the sticky bar (`sections/product-information.liquid` + `assets/sticky-add-to-cart.js`)
- Build slide-out/drawer panel that lists the same `custom.product_documents` metaobject entries
- Handle variant-level documents if metaobjects are variant-scoped
- Button hides when no documents exist for current product/variant
- Mobile-friendly panel (bottom sheet on small screens)

**Why early:** The sticky bar is already being iterated on in Phase 2.3. Adding the button now avoids reopening the component later. The TDS zone migration is low-risk and unblocks any product that still has the old metafields configured.

**Done when:** Both surfaces read from `custom.product_documents`. Legacy metafield settings removed from TDS zone schema. Sticky bar has two buttons. Panel renders document list. Both hide gracefully when no documents exist. Passes theme check.

**Context:** `sections/product-information.liquid` (sticky bar markup), `assets/sticky-add-to-cart.js`, `blocks/solstice-tds-zone.liquid`, `custom.product_documents` metaobject definition

---

## Phase 2.6 — Product description split (short + full body)

**What:** Split the verbose Malcolm body narrative into two surfaces — a condensed short description near the buy buttons, and the full body further down the page.

**Problem:** The Malcolm body template (10+ sections, situation-led narrative, specs, limitations, compliance) is extremely verbose. It currently renders in the `_product-details` zone near the variant picker and buy buttons — the exact moment where tradies need speed, not a saga. This creates friction in the buy decision zone.

**Solution:**

- **`custom.short_description` metafield** — 1-3 sentences of Malcolm-voiced condensed copy. Renders in the `_product-details` zone (replaces current `product-description` block position). Answers "what is this, who is it for, why buy it" at a glance.
- **New `solstice-product-body` section** — renders the full verbose `product.description` (Malcolm body narrative) further down the page, after trust signals and cross-sell. Built as a custom section or block, not the upstream `product-description` block.
- **Graceful fallback** — if `custom.short_description` is empty, fall back to a truncated version of `product.description` (first paragraph only) or hide entirely.
- **Migration path** — existing products with verbose `product.description` continue to work. The short_description metafield is opt-in per product until merchandising fills it.

**Why early:** The product page is already being iterated on in Phase 2.3/2.5. The `product-description` block is currently in the `_product-details` zone — swapping it for short_description and adding the full body section is a natural part of the page architecture refinement.

**Done when:** Product page shows short_description near buy buttons. Full Malcolm body renders in a dedicated section below. Fallback behavior works when short_description is empty. Passes theme check.

**Context:** `blocks/product-description.liquid` (upstream), `blocks/_product-details.liquid`, `templates/product.json`, `custom.short_description` metafield, `docs/design/brand_voice.md` (progressive disclosure section)

Collections will receive more traffic with SEO investment. Need to convert discovery into clicks and clicks into purchases.

### 3.1 Collection page research and architecture

**What:** Research and design the collection page.

- Study what makes trade catalog pages effective (filtering by substrate, application, industry — not just product type)
- Audit Horizon's `main-collection.liquid` capabilities
- Define filtering approach (by product type, brand, application, industry)
- Define product card design — what shows at browse level (vendor logo, price, variant count, trust signal?)
- Grid vs list, pagination vs infinite scroll

**Done when:** Collection page architecture documented with filter design, card design, and layout decisions.

**Context:** `BUSINESS_PROFILE.md`, `sections/main-collection.liquid`, live store collection pages

---

### 3.2 Collection page build

**What:** Build the collection page.

- Implement architecture from 3.1
- Apply design system tokens
- Product cards with right level of information for trade buyers
- Filtering/sorting that maps to how tradies think (by job, by substrate, by brand)
- Mobile-optimized grid

**Done when:** Collection page renders with effective filtering, product cards, and trust signals. Passes theme check.

---

## Phase 4 — Homepage (v1 priority #3)

First impression for branded traffic. Currently 1,412 sessions/month with healthy 25.9% bounce. Opportunity to immediately communicate who Adheseal is.

### 4.1 Homepage design and build

**What:** Design and build the homepage.

- Hero: who is Adheseal, what do they do, why trust them — in 3 seconds
- Trust signals above the fold (30 years, Australian-owned, 4 stores, trade expertise)
- Product discovery entry points (popular categories, brand spotlight, search)
- Value proposition blocks (flat-rate shipping, trade pricing, nationwide dispatch)
- Footer integration (store locations, contact, policies)

**Done when:** Homepage communicates Adheseal's authority and value immediately. Routes visitors to product discovery. Passes theme check.

**Context:** `BUSINESS_PROFILE.md` → Trust architecture, Phase 1 design system, `sections/` (hero, slideshow, featured-product, collection-list, etc.)

---

## Phase 5 — Search and footer

### 5.1 Search experience

**What:** Optimize the search experience for "find fast."

- Predictive search configuration
- "What's popular" shortcuts (brand and category shortcuts like the live store)
- Search results page layout
- Ensure search works for both modes: know-the-product and know-the-job

**Done when:** Search surface helps tradies find products fast in both buying modes.

**Context:** `sections/predictive-search.liquid`, `sections/search-header.liquid`, `sections/search-results.liquid`

---

### 5.2 Footer with trust signals

**What:** Build trust into the footer.

- Store locations (Stafford, Slacks Creek, Gold Coast, Sunshine Coast) with phone numbers
- 30-year heritage signal
- Contact information prominently placed
- Policy links (shipping, returns, terms)
- Payment methods
- Newsletter signup (if desired)

**Done when:** Footer reinforces trust and provides easy access to human contact.

**Context:** `sections/footer.liquid`, `sections/footer-utilities.liquid`

---

## Phase 6 — Cart and checkout

### 6.1 Cart drawer

**What:** Optimize the cart for conversion.

- Cart drawer (already Horizon default)
- Shipping cost clarity — show estimated shipping before checkout (flat rate $17.95 for metro)
- Trust reinforcement at commitment moment
- Cross-sell: "for this job you might also need..."
- Clean variant display (colour + package type)
- Discount code field

**Done when:** Cart drawer reduces cart abandonment by addressing shipping uncertainty and reinforcing trust.

**Context:** `sections/main-cart.liquid`, `assets/cart-drawer.js`, `BUSINESS_PROFILE.md`

---

## Phase 7 — B2B layer

### 7.1 Bulk order / quote request form ✅

**What:** Build the bulk order form — the only B2B feature in v1.

- Design the form experience (product selection, quantity, contact details, message)
- Decide: custom section or Shopify page template?
- Form submission handling (email notification, Shopify form?)
- Mobile-friendly — tradespeople filling this out on-site

**Completed:** `solstice-quote-form` block built as part of Phase 2.3. 2-step progressive disclosure form on product pages using Shopify `{% form 'contact' %}`. Captures qty, name, email (step 1) then phone, company, industry, suburb, notes (step 2). Submits to Shopify contact form with product context.

**Context:** `BUSINESS_PROFILE.md` → B2B features section

---

## Phase 8 — Marketing and conversion optimisation

These can run in parallel with build phases. Apply after surfaces exist.

### 8.1 Customer research

**What:** Use `customer-research` skill to validate assumptions.

- Mine Reddit, trade forums, competitor reviews for what tradespeople actually care about when choosing an online supplier
- Validate or challenge the trust signals defined in BUSINESS_PROFILE.md
- Identify conversion copy that resonates

**Done when:** Research findings inform product page and homepage copy decisions.

---

### 8.2 Competitor profiling

**What:** Profile 3-5 competitors that are converting trade traffic.

- What trust signals do they use?
- How do they handle product pages for technical products?
- What does their purchase flow look like?
- Where is Adheseal's gap?

**Done when:** Competitor profiles identify specific, actionable improvements for Solstice surfaces.

---

### 8.3 Page CRO audit

**What:** Apply `page-cro` skill to the v1 surfaces once built.

- Audit product page, collection page, homepage for conversion optimisation
- Test trust signal placement
- Identify friction in the purchase flow
- Mobile-specific recommendations

**Done when:** CRO recommendations prioritised and applied to v1 surfaces.

---

### 8.4 Theme copywriting (Malcolm voice)

**What:** Write the actual theme copy using the `copywriting` skill.

- Hero messaging
- Trust block copy (30 years, Australian-owned, 4 stores, trade expertise)
- Value proposition blocks (shipping, pricing, dispatch)
- Empty states, error messages, confirmation copy
- Footer copy
- All in Malcolm's voice — confident, specific, no bullshit

**Done when:** Theme surfaces have Malcolm-voiced copy that communicates authority and trust.

**Context:** `docs/design/brand_voice.md`

---

## v2+ backlog

Features that don't pass the v1 decision filter but are documented for future milestones:

- Compare (side-by-side product comparison)
- Wish lists
- Quick View modal
- Brand spotlight sections (e.g. Megapoxy spotlight)
- Job-based product kits ("complete bathroom waterproofing kit")
- Reorder / saved orders / order templates
- Advanced cross-sell engine
- Store locator with inventory
- Content hub (application guides, project galleries, technical articles)
- Customer reviews / social proof system
- Customer research to inform v2 priorities
- Shopify Plus evaluation for B2B features (pricing tiers, company accounts, net terms)

---

## Dependency map

```
Phase 1 (Design system) ──┐
                           ├── Phase 2 (Product page) ✅ 2.1, 2.2, 2.3 Phase 1 (blocks built)
                           │    ├── Phase 2.5 (Product docs panel) — adhoc, runs with 2.3 iteration
                           │    └── Phase 2.6 (Description split) — adhoc, runs with 2.3 iteration
                           ├── Phase 3 (Collection page)
                           ├── Phase 4 (Homepage)
                           ├── Phase 5 (Search + Footer)
                           └── Phase 6 (Cart)

Phase 7 (B2B form) ─────── ✅ Built as solstice-quote-form in Phase 2.3

Phase 8 (Marketing) ────── runs in parallel, applies after surfaces exist
```

Phase 1 is the gate. Everything else depends on the design system being correct first.

## Current state (2026-05-17)

**Completed:**
- Phase 1.2 — Color scheme revision (9 → 5 schemes)
- Phase 2.1 — Product page research
- Phase 2.2 — Product page architecture (upstream-first approach)
- Phase 2.3 — Product page build Phase 1 (5 custom blocks + trust badges, wired into product.json, pushed to dev)
- Phase 7.1 — Bulk order form (built as solstice-quote-form in Phase 2.3)

**Pending:**
- Phase 1.1 — Typography documentation update
- Phase 1.3 — Brand guidelines update
- Phase 1.4 — Design system validation
- Phase 2.3 — Product page build Phase 2 (iteration on existing blocks, visual testing, remaining blocks)
- Phase 2.5 — Product documents panel + TDS zone migration (adhoc)
- Phase 2.6 — Product description split — short + full body (adhoc)
- Phase 3 — Collection page
- Phase 4 — Homepage
- Phase 5 — Search + Footer
- Phase 6 — Cart
- Phase 8 — Marketing and CRO
