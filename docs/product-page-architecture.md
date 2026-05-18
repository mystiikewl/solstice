# Product Page Architecture — Phase 2.2

> Zone map, block inventory, content hierarchy, and build decisions for the Solstice product page.

---

## 1. Build decision: Upstream section + custom blocks

**Decision (revised):** Keep the upstream `product-information.liquid` section. Add custom Solstice blocks as new block types that slot into the existing template configuration.

**Why the revision:** The `templates/product.json` template is already heavily configured with trust signals, cross-sell, shipping info, accordion sections, and proper block ordering using the upstream section. Building a full custom section would duplicate ~80% of what's already working. Adding custom blocks to the upstream section is lower-risk and faster.

### What's already configured in the template

| Block | Status | How |
|---|---|---|
| Trust strip (30+ years, 4 stores, AUS-owned, Call us) | **Done** | `group_trust` with text blocks in `_product-details` |
| Vendor + title + SKU + price | **Done** | `group_header` in `_product-details` |
| Variant picker (buttons + swatches) | **Done** | Upstream `variant-picker` block |
| Inventory status | **Done** | Upstream `product-inventory` block |
| Buy buttons + quantity + accelerated checkout | **Done** | Upstream `buy-buttons` block |
| Shipping + payment info | **Done** | `group_shipping` with text + payment-icons |
| Product description | **Done** | Text block with `{{ closest.product.description }}` |
| Accordion (Specs, Application, TDS, Limitations) | **Done** | Upstream `accordion` block with rows |
| Cross-sell ("You'll also need for this job") | **Done** | `product-recommendations` section (related, 4 products) |
| Sticky add-to-cart | **Done** | Upstream section setting |

### What still needs custom blocks

| Component | Block type | Purpose |
|---|---|---|
| `solstice-buy-mode-toggle` | Custom block | Single Buy vs Box Buy toggle with price comparison, uses units-per-box metafield |
| `solstice-sealant-calculator` | Custom block | Coverage calculator for sealant products |
| `solstice-quote-form` | Custom block | Inline trade quote request form (2-step) |
| `solstice-vendor-badge` | Custom block | Show brand logo (Sika, Ardex, etc.) at decision point |
| `solstice-tds-zone` | Custom block | TDS/SDS document download links (replaces placeholder accordion row) |

---

## 2. Zone map

### Desktop — Two-column layout (media left, details right)

```
┌──────────────────────────────┬──────────────────────────────┐
│         MEDIA COLUMN         │      DETAILS COLUMN          │
│                              │                              │
│  ┌──────────────────────┐    │  Breadcrumb (upstream text)   │
│  │   Product Media       │    │                              │
│  │   Gallery             │    │  Product Title               │
│  │   (carousel/grid)     │    │                              │
│  │                       │    │  ┌────────────────────────┐  │
│  │                       │    │  │ SOLSTICE-TRUST-STRIP   │  │
│  │                       │    │  │ 30 years · 4 stores    │  │
│  │                       │    │  │ AUS-owned · Experts    │  │
│  │                       │    │  └────────────────────────┘  │
│  │                       │    │                              │
│  │                       │    │  Vendor badge + SKU + stock  │
│  │                       │    │                              │
│  │                       │    │  Price + GST notice          │
│  │                       │    │                              │
│  │                       │    │  ┌────────────────────────┐  │
│  │                       │    │  │ SINGLE / BOX TOGGLE    │  │
│  │                       │    │  │ [Single Tube] [Box 20] │  │
│  │                       │    │  └────────────────────────┘  │
│  │                       │    │                              │
│  │                       │    │  Variant picker (colour,     │
│  │                       │    │  size, etc.)                 │
│  │                       │    │                              │
│  │                       │    │  Quantity + Add to Cart      │
│  │                       │    │  + Accelerated checkout      │
│  │                       │    │                              │
│  │                       │    │  ┌────────────────────────┐  │
│  │                       │    │  │ SOLSTICE-HUMAN-ACCESS  │  │
│  │                       │    │  │ Call 1300 XXX XXX      │  │
│  │                       │    │  └────────────────────────┘  │
│  │                       │    │                              │
│  │                       │    │  Shipping summary            │
│  │                       │    │  (flat rate $17.95 metro)   │
│  └──────────────────────┘    │                              │
│                               │  Accordion / Tabs (below)    │
└──────────────────────────────┴──────────────────────────────┘

  BELOW THE FOLD (full width)
  ┌─────────────────────────────────────────────────────────┐
  │  SOLSTICE-SEALANT-CALCULATOR  (appears for sealants)    │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │  SOLSTICE-CROSS-SELL  "For this job you'll also need"   │
  │  Instruction-led, 3-4 products with "why" explanation   │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │  Accordion rows (collapsible):                          │
  │  ▸ Description (Malcolm body copy)                      │
  │  ▸ Technical specs                                      │
  │  ▸ Uses & Applications                                  │
  │  ▸ How to apply                                         │
  │  ▸ Shipping & returns                                   │
  │  ▸ FAQ                                                  │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │  SOLSTICE-QUOTE-FORM  "Need a custom trade quote?"      │
  │  2-step inline form: Qty, Name, Email → Phone, Company, │
  │  Industry, Suburb, Project notes                        │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │  SOLSTICE-TDS-ZONE  Technical Data Sheets / SDS         │
  └─────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────────────────────────────┐
  │  Complementary products (upstream product-recommendations)│
  └─────────────────────────────────────────────────────────┘
```

### Mobile — Single column, stacked

```
  Breadcrumb
  Product Media Gallery (carousel, swipable)

  Product Title
  SOLSTICE-TRUST-STRIP (compact, single line)
  Vendor badge + SKU + stock
  Price + GST notice
  SOLSTICE-SINGLE-BOX-TOGGLE
  Variant picker
  Quantity + Add to Cart
  SOLSTICE-HUMAN-ACCESS (compact)
  Shipping summary
  Accordion rows (same as desktop)
  SOLSTICE-SEALANT-CALCULATOR
  SOLSTICE-CROSS-SELL
  SOLSTICE-QUOTE-FORM
  SOLSTICE-TDS-ZONE
  Complementary products
```

**Key mobile decisions:**
- Trust strip stays compact (icons only or icons + condensed text) — fits in 2 lines
- Human access block is a single "Call us" button or link — no horizontal space wasted
- Accordion rows are collapsed by default on mobile (save scrolling)
- Calculator and cross-sell render between accordion and quote form (but above fold may be shorter — these blocks are for post-scroll decision support)
- Touch targets: minimum 44px for variant picker, quantity, and CTA buttons
- Sticky add-to-cart bar from upstream handles mobile CTA persistence

---

## 3. Block inventory and schema

### `solstice-product-information.liquid` schema structure

```jsonc
{
  "name": "Solstice Product Information",
  "settings": [
    // Same layout settings as upstream:
    // content_width, desktop_media_position, equal_columns, gap,
    // enable_sticky_add_to_cart, color_scheme, padding
    // + new Solstice toggle:
    "enable_trust_strip": true,
    "enable_sealant_calculator": true,
    "calculator_products_tags": "sealant"
  ],
  "blocks": [
    // Upstream child block types (passed through to _product-details):
    { "type": "text" },
    { "type": "icon" },
    { "type": "image" },
    { "type": "button" },
    { "type": "video" },
    { "type": "group" },
    { "type": "spacer" },
    { "type": "accordion" },
    { "type": "product-recommendations" },
    { "type": "price" },
    { "type": "variant-picker" },
    { "type": "buy-buttons" },
    { "type": "product-description" },
    { "type": "product-inventory" },
    { "type": "product-custom-property" },
    { "type": "_divider" },
    { "type": "review" },
    { "type": "accelerated-checkout" },

    // Custom Solstice blocks:
    { "type": "solstice-trust-strip" },
    { "type": "solstice-vendor-badge" },
    { "type": "solstice-cross-sell" },
    { "type": "solstice-quote-form" },
    { "type": "solstice-sealant-calculator" },
    { "type": "solstice-tds-zone" },
    { "type": "solstice-human-access" }
  ]
}
```

### Block placement (render order)

The custom section renders:

1. **{% content_for 'block', type: '_product-media-gallery' %}** — unchanged
2. **{% content_for 'block', type: '_product-details' %}** — contains all product detail blocks (title, price, variant picker, buy buttons, etc.)
3. **Additional blocks rendered in order after the details column:**
   - `solstice-sealant-calculator` (if product has sealant tag)
   - `solstice-cross-sell` (if metafields or tags have related products)
   - Accordion rows (already inside _product-details)
   - `solstice-quote-form`
   - `solstice-tds-zone`
   - Upstream `product-recommendations`

### What the custom section renders directly

The `solstice-*` blocks that appear **inside** the details column (trust strip, vendor badge, human access) are rendered as captured HTML injected into the `_product-details` block. The section passes them alongside the upstream content_for output.

Implementation approach: render `_product-details` content_for, then inject Solstice blocks at specific positions within the column by modifying the `block_order` in the section's default data (in settings_data.json), OR render the details column with both upstream and Solstice content combined.

**Simpler approach for v1:** The custom section manages its own details column render, wrapping the upstream `_product-details` content_for output with Solstice blocks inserted at fixed positions. The upstream `_product-details` block is used as the container for standard blocks only; Solstice blocks render alongside via captured output.

---

## 4. Content hierarchy

### Above the fold (visible without scrolling, desktop ~900px viewport)

Priority order for the details column:

| Priority | Element | Why |
|----------|---------|-----|
| 1 | Product title | Identification — first thing buyer needs |
| 2 | **Trust strip** | Trust hit before bounce decision (crucial: 44-61% bounce) |
| 3 | Vendor badge + SKU + stock | Brand credibility + specifics |
| 4 | Price + GST notice | Price clarity, no surprises |
| 5 | **Single/Box toggle** + variant picker | Choice of purchase unit |
| 6 | Quantity + Add to Cart | Primary action |
| 7 | **Human access** | Phone/CTA at decision moment |
| 8 | Shipping summary | Final friction remover |

### Below the fold (scrolling required)

| Section | Content | Visible/Collapsible |
|---------|---------|---------------------|
| Sealant calculator | Coverage calculator | Visible (when applicable) |
| Cross-sell | "You'll also need" product cards | Visible (3-4 products) |
| Accordion: Description | Malcolm body copy | Collapsible (open by default on desktop) |
| Accordion: Specs | Technical data table | Collapsible |
| Accordion: Uses & Applications | Substrates, applications list | Collapsible |
| Accordion: How to apply | Application guide | Collapsible |
| Accordion: Shipping & Returns | Policy info | Collapsible |
| Accordion: FAQ | Common questions | Collapsible |
| Trade quote form | 2-step quote request | Visible |
| TDS download zone | PDF links | Visible |
| Complementary products | Upstream recommendations | Visible |

### Mobile hierarchy

Same as desktop but:
- Trust strip is compact (icon + single line)
- Human access is a single "Call" button
- All accordion rows collapsed by default
- Sticky add-to-cart bar persists CTA on scroll

---

## 5. Single Buy vs Box Buy toggle

### Problem

Trade buyers think in boxes. A box of 20 sealant tubes is their purchase unit. The current interface shows "Box Buy" as a variant option, but it's not explicit enough — you land on a single tube price and have to discover the box option.

### Solution

A prominent two-segment toggle above the variant picker:

```
  [ Single Tube ]  [ Box of 20 ]
```

- Visually distinct (pill toggle, colour fill on active)
- Shows price per unit underneath each option
- Switching the toggle selects the corresponding variant (single vs bulk package)
- If only one option is available, hide the toggle and show the available option as default
- Works with any product that has a "single" vs "box/multi-pack" variant pattern

### Implementation

- Read product variants, detect "Single" vs "Box" patterns from option values
- Render toggle that pre-selects the appropriate variant on click
- Falls back to standard variant picker if no Single/Box pattern detected

---

## 6. Cross-sell zone — "You'll also need"

### Design principle

Instruction-led, not upsell. If someone buys waterproofing membrane, they need primer, backing rod, angles, and sealant. Frame it as:

> **For this job you'll also need:**
> — *Supaprime* — prime the surface before applying membrane
> — *Backing Rod 10mm* — fill gaps before sealing
> — *Sikasil Sealant* — seal the finished joint

### Sourcing

- Product metafield: `related_products` (product references)
- Fallback: product tags (e.g. `related:supaprime`, `related:backing-rod-10mm`)
- Fallback: upstream complementary products

### Render

- 3-4 product cards in a horizontal row
- Each card: thumbnail, product name, brief "why" text, price, "Add" button
- Mobile: 2-column grid or horizontal scroll

---

## 7. Quote form — inline trade quote

### Current pattern (from legacy audit)

2-step inline form:
1. **Step 1:** Qty, Name, Email → "Next" button
2. **Step 2:** Phone, Company, Industry, Suburb, Project notes → "Submit"

Submits to Shopify Form API or email notification.

### Architecture

- Custom block `solstice-quote-form` with section schema settings for:
  - Form title (default: "Need a custom trade quote?")
  - Email recipient
  - Success message
- 2-step progressive disclosure (JS-driven, no page reload)
- Mobile-friendly: full-width inputs, large touch targets
- Submit via Shopify Form API or POST to a notification endpoint

### Rendering

- Always visible below the fold on product page
- Could also be used standalone on a contact page

---

## 8. Sealant calculator

### Purpose

A coverage calculator for sealant products. Answers: "How many tubes do I need for this job?"

### Inputs

- Joint width (mm)
- Joint depth (mm)
- Joint length (m)
- Tube size (default from product variant)

### Output

- Number of tubes needed
- Recommended Single vs Box Buy

### Architecture

- Custom block `solstice-sealant-calculator`
- Conditionally visible based on product tag (`sealant`, `coverage-calculator`) or metafield
- JS calculation (simple formula: `(width × depth × length) / tube_volume`)
- No external API needed
- Results show recommended purchase quantity

---

## 9. Mobile layout — additional notes

| Concern | Decision |
|---------|----------|
| Breakpoint | Horizon standard 750px |
| Media gallery | Swipable carousel, no zoom-in-left-column pattern |
| Trust strip | Compact: icons only or single line |
| Variant picker | Full-width buttons, 44px min height |
| Quantity selector | +/- buttons, large touch targets |
| Add to cart | Sticky bar follows scroll |
| Accordion | All collapsed by default |
| Quote form | Full-width, stacked, no side-by-side |
| Calculator | Single column, large inputs |
| Cross-sell | 2-column grid or horizontal scroll |

---

## 10. Section schema — default block order

In `config/settings_data.json`, the default `solstice-product-information` block order for the details column:

```jsonc
[
  "product-title",
  "solstice-trust-strip",
  "solstice-vendor-badge",
  "price",
  "solstice-single-box-toggle",
  "variant-picker",
  "quantity",
  "buy-buttons",
  "solstice-human-access",
  "shipping-summary",
  "accordion"
]
```

Below-fold blocks (rendered outside the details column):

```jsonc
[
  "solstice-sealant-calculator",
  "solstice-cross-sell",
  "solstice-quote-form",
  "solstice-tds-zone",
  "complementary-products"
]
```

---

## 11. Files to create / modify

| File | Action | Purpose |
|------|--------|---------|
| `sections/solstice-product-information.liquid` | **Create** | Custom PDP section |
| `blocks/solstice-trust-strip.liquid` | **Create** | Trust signal strip block |
| `blocks/solstice-vendor-badge.liquid` | **Create** | Vendor logo display |
| `blocks/solstice-cross-sell.liquid` | **Create** | Instruction-led cross-sell |
| `blocks/solstice-quote-form.liquid` | **Create** | Trade quote form |
| `blocks/solstice-sealant-calculator.liquid` | **Create** | Coverage calculator |
| `blocks/solstice-tds-zone.liquid` | **Create** | TDS/SDS download zone |
| `blocks/solstice-human-access.liquid` | **Create** | Phone/CTA block |
| `assets/solstice-product.js` | **Create** | JS for calculator, toggle, quote form, cross-sell |
| `assets/solstice-product.css` | **Create** | Styles for custom blocks |
| `locales/en.default.json` | **Modify** | Translations for new blocks |
| `config/settings_data.json` | **Modify** | Default preset for new section |

---

## 12. Build order (Phase 2.3 sub-phases)

1. **Section scaffold** — Create `solstice-product-information.liquid` with upstream-compatible layout, pass-through for `_product-details` blocks
2. **Trust blocks** — Trust strip, vendor badge, human access
3. **Single/Box toggle** — Enhanced variant UX
4. **Cross-sell block** — Instruction-led product cards
5. **Sealant calculator** — Coverage calculator JS + render
6. **Quote form** — 2-step form with submit
7. **TDS zone** — Document download block
8. **Mobile polish** — Responsive tuning per zone map
9. **Integration** — Template wiring, schema defaults, locale updates, theme check
