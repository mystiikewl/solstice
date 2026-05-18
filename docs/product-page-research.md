# Product Page Research — Phase 2.1

## What Horizon provides out of the box

The `product-information.liquid` section (upstream) gives us:

- **Media gallery** — grid or carousel, zoom, thumbnails, aspect ratio, video looping
- **Product details column** with block-level composability:
  - Product title (H1 via text block)
  - Price + tax info
  - Variant picker (pills or swatches)
  - Buy buttons (add to cart + accelerated checkout)
  - Product description
  - Inventory status
  - Accordion blocks (for collapsible sections like specs, shipping, FAQ)
  - Complementary products (Shopify product recommendations, "styled with" UI)
  - Text, icon, image, button, group, spacer, divider blocks
- **Sticky add-to-cart bar** on scroll
- **Layout:** media left/right, equal columns, gap, content width (narrow/normal/wide)
- **Sticky details** on desktop option

### What Horizon doesn't provide

| Missing | Why Solstice needs it |
|---------|----------------------|
| Trust signal zone (above the fold) | 30 years, 4 stores, Australian-owned — must hit before bounce decision |
| Technical authority block | Specs with "so what?" interpretation, not just a table |
| "You'll also need" cross-sell block | Instruction-led cross-sell (not "you might also like") |
| Single Buy vs Box Buy variant UX | Trade buyers think in boxes, not units |
| Malcolm-voiced content structure | Body template sections (situation-led opening, quick specs, why this exists, the numbers that matter, etc.) |
| Human access block | Phone number, "talk to an expert" CTA at point of decision |
| Quote request integration | "Custom trade quote" form on product page (already exists in legacy) |
| TDS/SDS document download zone | PDF docs are product data — need a dedicated block |
| Vendor logo display | Show brand logo (Sika, Ardex, etc.) at decision point |

---

## Current legacy product page audit

Live Sikaflex Pro page (adheseal.com.au) has:

**Above the fold:**
- Breadcrumb
- Product images (carousel)
- Title + vendor link + SKU + stock status
- Price + "Prices do not include GST"
- Colour swatches + Package Type dropdown (Box Buy only)
- Quantity + Add to Cart + Wishlist
- "Trade quote" toggle section (inline form)

**Below the fold:**
- Shipping info summary
- Tabbed content: Description, FAQ, Uses & Benefits, How To Apply, Limitations, Substrates
- Spec table (physical properties)
- Use cases (image + description cards)
- Alternative products carousel
- "Need Help?" CTA
- Recently viewed

**Trust signals present:**
- Shipping banner at top (flat rate $17.95)
- Vendor logo
- Phone number in header
- Store locations in footer
- "Custom trade quote" form

**Trust signals MISSING (the gap):**
- No "30 years in the industry" statement anywhere on the page
- No "Australian-owned" signal
- No "4 physical stores" above the fold
- No "used by tradespeople across Australia" social proof
- No application expertise claim (Adheseal is positioned as a store, not an authority)
- The Malcolm voice content exists (description tabs) but is buried below the fold — the highest-quality trust-building content is invisible until you scroll past the spec table

---

## Competitor patterns observed

### Scrooz Fasteners
- "Get $100 OFF" promo banner at top
- Strong phone number presence (1300 794 499) in header
- Drop-down mega nav with exhaustive category taxonomy
- Product page: image, title, SKU, price, quantity, add to cart — utilitarian
- No brand story, no authority signals
- Trust = speed and range, not expertise

### Trade Supply Direct
- Homepage hero: Sika + Dowsil product spotlights
- Value props in footer: "Trade discounts available for bulk orders", "Free shipping over $200", "Same-day dispatch", "Price beat guarantee"
- Product page: basic Shopify (Dawn-like)
- No authority storytelling — pure transactional

### Ellsworth Adhesives (US)
- "Ask The Glue Doctor" — human access/technical support as differentiator
- Tiered pricing visible (qty breaks)
- Strong TDS/SDS library
- Brand catalog approach (by manufacturer)

---

## Key insight: the authority gap

The legacy theme already has decent Malcolm-voiced content (Sikaflex Pro page has the full body template). But it's buried. The product page needs:

1. **Above-fold trust hit** — "30 years | 4 stores | Australian-owned | Trade experts" in the hero zone
2. **Authority block at decision point** — compact trust strip between variant picker and add-to-cart
3. **Malcolm content surfaced** — "The numbers that matter" should be visible without scrolling past a spec table
4. **Human access** — phone number and "talk to an expert" at the point of commitment

---

## Theme concern vs Shopify admin content

| Layer | Handled by |
|-------|-----------|
| Layout, trust blocks, cross-sell zones, variant presentation, sticky bar, accordion organization | **Theme** (section schema + Liquid + CSS) |
| Product descriptions (Malcolm body copy) | **Shopify admin** — product description field, metafields |
| Images, videos, TDS/SDS PDFs | **Shopify admin** — media, file uploads |
| Certifications, compliance data | **Shopify admin** — metafields or description |
| "You'll also need" product links | **Theme** (cross-sell logic based on metafields or tags) |
| Colour swatches + Single/Box Buy toggle | **Theme** (variant picker customization) |
| Pricing, inventory, SKU | **Shopify admin** — product resource |

---

## Build vs modify decision

**Recommendation: Build `solstice-product-information.liquid`**

The custom blocks needed (trust strip, instruction-led cross-sell, quote form integration, vendor badge, TDS download zone) are too extensive to cleanly overlay on the upstream section. A custom section keeps Horizon upgrades clean.

The upstream `_product-details.liquid` block container can still be used for the basic blocks (title, price, description, accordion). The custom section wraps this with Solstice-specific trust and cross-sell blocks.

---

## Summary for Phase 2.2

The architecture should define:
- **Zone map** — where each trust signal lands, what content goes where
- **Block inventory** — which blocks are custom (solstice-), which are upstream
- **Content hierarchy** — above/below fold, collapsible vs visible
- **Mobile layout** — 40% traffic, stack order, touch targets
- **Variant picker enhancement** — Single Buy vs Box Buy as a clear toggle
- **Cross-sell zone** — instruction-led, sourced from metafields or tags
- **Quote form integration** — inline trade quote form pattern
