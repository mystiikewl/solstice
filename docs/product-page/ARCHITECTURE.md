# Product Page Architecture (Phase 2.2)

> Zone map, section schema, and build plan for the Solstice product page.

---

## Layout zones

```
┌─────────────────────────────────────────────────────────┐
│ SECTION: product-information                             │
│                                                           │
│  ┌──────────────────┐  ┌──────────────────────────────┐  │
│  │                  │  │ ZONE A: HEADER                │  │
│  │                  │  │   Vendor name / logo           │  │
│  │   MEDIA          │  │   Product title (h1)           │  │
│  │   GALLERY        │  │   Price                        │  │
│  │                  │  │   SKU                          │  │
│  │   (left column)  │  ├──────────────────────────────┤  │
│  │                  │  │ ZONE B: TRUST BAR              │  │
│  │                  │  │   "30 years" · "4 stores" ·   │  │
│  │                  │  │   "Australian-owned" · phone   │  │
│  │                  │  ├──────────────────────────────┤  │
│  │                  │  │ ZONE C: VARIANT SELECTION      │  │
│  │                  │  │   Colour swatches              │  │
│  │                  │  │   Size / package type buttons   │  │
│  │                  │  │   Stock indicator               │  │
│  │                  │  ├──────────────────────────────┤  │
│  │                  │  │ ZONE D: BUY                    │  │
│  │                  │  │   Quantity selector             │  │
│  │                  │  │   Add to cart (primary CTA)     │  │
│  │                  │  │   Accelerated checkout           │  │
│  │                  │  │   Shipping estimate              │  │
│  │                  │  │   Payment icons                  │  │
│  │                  │  ├──────────────────────────────┤  │
│  │                  │  │ ZONE E: DESCRIPTION             │  │
│  │                  │  │   Situation-led opening          │  │
│  │                  │  │   Key specs (Malcolm voice)      │  │
│  │                  │  │   "Why this product exists"      │  │
│  │                  │  ├──────────────────────────────┤  │
│  │                  │  │ ZONE F: TECHNICAL DETAILS        │  │
│  │                  │  │   Accordion: Specifications      │  │
│  │                  │  │   Accordion: Application guide   │  │
│  │                  │  │   Accordion: TDS / SDS downloads │  │
│  │                  │  │   Accordion: Don't use when...   │  │
│  └──────────────────┘  └──────────────────────────────┘  │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │  ZONE G: CROSS-SELL (full width, below details)      │  │
│  │  "You'll also need for this job"                      │  │
│  │  [Product card] [Product card] [Product card]          │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

### Mobile layout

```
┌───────────────────────┐
│ Media gallery (full w) │
├───────────────────────┤
│ ZONE A: Header         │
│  Vendor · Title · Price│
│  SKU                   │
├───────────────────────┤
│ ZONE B: Trust bar      │
│  "30yr" "4 stores"    │
├───────────────────────┤
│ ZONE C: Variants       │
│  Colour swatches       │
│  Size buttons           │
│  Stock indicator        │
├───────────────────────┤
│ ZONE D: Buy            │
│  Qty + Add to Cart     │
│  Shipping estimate     │
│  Payment icons          │
├───────────────────────┤
│ ZONE E: Description    │
├───────────────────────┤
│ ZONE F: Accordions     │
│  Specs · Guide · TDS   │
├───────────────────────┤
│ ZONE G: Cross-sell     │
│  2-col grid on mobile  │
└───────────────────────┘
│ Sticky add-to-cart bar │ (fixed bottom on scroll)
```

---

## Block configuration

The entire product page is assembled from Horizon blocks within the `_product-details` block. No custom section needed — just the template JSON.

### Block order (top to bottom in sidebar)

| # | Block type | Name | Settings | Purpose |
|---|-----------|------|----------|---------|
| 1 | `group` | Header | column layout, gap:12 | Container for title + price |
| 1a | └ `text` | Vendor | `{{ closest.product.vendor }}`, body font, small, subdued | Brand identification |
| 1b | └ `text` | Title | `<h1>{{ closest.product.title }}</h1>`, h3 preset | Product name |
| 1c | └ `sku` | SKU | default settings | SKU display |
| 1d | └ `price` | Price | show_sale_price_first:true, paragraph preset | Price display |
| 2 | `group` | Trust bar | row layout, gap:16, centered | Trust signal strip |
| 2a | └ `text` | 30 years | icon + "30+ years" | Authority |
| 2b | └ `text` | 4 stores | icon + "4 stores" | Physical presence |
| 2c | └ `text` | AU owned | icon + "Australian-owned" | Trust |
| 2d | └ `text` | Phone | icon + phone number, link to tel: | Human access |
| 3 | `_divider` | — | thin, full width | Visual separator |
| 4 | `variant-picker` | Variants | buttons style, show_swatches:true | Variant selection |
| 5 | `product-inventory` | Stock | default | Availability indicator |
| 6 | `buy-buttons` | Buy | stacked, show_pickup:false | Quantity + CTA + express checkout |
| 7 | `group` | Shipping + payment | row layout | Commitment confidence |
| 7a | └ `text` | Shipping | "Flat rate $17.95 metro · Free pickup" | Shipping clarity |
| 7b | └ `payment-icons` | Payment | default | Accepted methods |
| 8 | `_divider` | — | thin, full width | Visual separator |
| 9 | `text` | Description | `{{ closest.product.description }}`, rte | Malcolm-voiced content |
| 10 | `accordion` | Specifications | collapsible | Technical data |
| 10a | └ row | Specs | product-custom-property or text | Key specifications |
| 10b | └ row | Application guide | text | How to use |
| 10c | └ row | TDS / Downloads | text with links | Technical data sheets |
| 10d | └ row | Limitations | text | "Don't use when..." |

### Cross-sell section (separate section below)

| Setting | Value |
|---------|-------|
| Section | `product-recommendations` |
| Header text | "You'll also need for this job" |
| Type | Related products |
| Layout | Grid, 4 columns |
| Mobile | 2 columns |

---

## What's configurable vs hardcoded

### Configurable in theme editor (JSON template)

- All block content, ordering, visibility
- Trust bar text and links
- Shipping text
- Accordion content
- Cross-sell heading and layout
- Media gallery style (grid/slideshow)
- Details column width and position
- Color scheme per section
- Sticky details toggle
- Sticky add-to-cart toggle

### Hardcoded (not configurable without code change)

- Trust bar icon choices (selected at build time)
- Shipping estimate text content (static, not dynamic by location)
- Variant swatch style (determined by variant-picker settings)

### Requires Shopify admin content

- Product descriptions (Malcolm-voiced, written per product)
- Product images and media
- Variant setup (colours, sizes, SKUs)
- Product metafields (specs, TDS links, application guide)
- Vendor logos (if using metafields)

---

## Custom files needed

| File | Type | Purpose |
|------|------|---------|
| `snippets/solstice-trust-icons.liquid` | Snippet | Reusable trust signal icons (if icon blocks don't suffice) |
| `templates/product.json` | Template (modify) | Updated block configuration with all zones |

**That's it.** Everything else uses Horizon's built-in block system.

---

## Design tokens to apply

| Element | Token | Value |
|---------|-------|-------|
| Product title | `--font-heading--family` | Geist Bold (via CSS override) |
| Body text | `--font-body--family` | System UI (via CSS override) |
| Price | `--font-heading--family` | Geist Medium |
| Trust bar text | `--font-body--family`, small | System UI 14px |
| Accordion headers | `--font-heading--family` | Geist Medium |
| Add to cart button | Border radius: 100px | Pill shape |
| Trust bar background | `--color-background-secondary` | Subtle bg |
| Section color scheme | `scheme-1` (Warm White) | Default |
| Sticky add-to-cart | `settings.popover_color_scheme` | Charcoal on white |

---

## Key decisions

1. **Modify template JSON, not section Liquid** — Horizon's block system is flexible enough
2. **Trust bar = assembled from text/icon blocks** — no custom section needed
3. **Cross-sell = rename existing recommendations section** — "You'll also need" not "You may also like"
4. **Accordions for technical details** — keeps page clean, specs available when needed
5. **Sticky add-to-cart: ON** — critical for mobile conversion
6. **Sticky details: ON** — keeps buy button visible while scrolling media on desktop
7. **Colour swatches: ON** — tradespeople need to see exact product colour
8. **Media position: LEFT** — standard for product pages, media dominates
9. **Equal columns: OFF** — media should be wider than details on desktop (2:1 at 1200px+)

---

## Mobile-first notes

- Trust bar collapses to 2 items visible + scroll or 2x2 grid
- Sticky add-to-cart bar is fixed at bottom on mobile (Horizon provides this)
- Accordion sections are collapsed by default on mobile
- Cross-sell shows 2 columns on mobile
- Media gallery is full-width slideshow on mobile (Horizon default)
