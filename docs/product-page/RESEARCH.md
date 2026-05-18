# Product Page Research (Phase 2.1)

> Why the product page, what it needs to do, and what Horizon provides.

---

## The problem in numbers

| Metric | Value | Context |
|--------|-------|---------|
| Conversion rate | 0.93% | Industry average: 2-3%. 2-3x revenue left on table. |
| Sikaflex Pro bounce | 44-61% | Top product by traffic. Paid + organic landing here. |
| Dowsil 795 bounce | 53.3% | Second-tier product, same pattern. |
| Dow Corning 888 bounce | 49.3% | Same. |
| Homepage bounce | 25.9% | Healthy. Product pages are where trust breaks down. |
| Device split | 60% desktop / 40% mobile | Both need to work. Mobile = on-site tradies. |

**Core issue:** Visitors find products via search, land on the page, don't recognise Adheseal, and bounce to a known supplier. The page doesn't communicate authority in the first 3 seconds.

---

## What a high-converting trade product page needs

### Trust signal placement

Based on the trust architecture in BUSINESS_PROFILE.md, signals must appear at the point of decision — not buried in a footer.

| Zone | Trust signals | Purpose |
|------|-------------|---------|
| **Above the fold (hero)** | Vendor badge/logo, "30 years", "Australian-owned" | First impression authority |
| **Variant selection** | Clear colour swatches, package type labels, stock indicator | Right product confidence |
| **Near buy button** | Shipping estimate, phone number, "talk to a human" link | Reduce commitment friction |
| **Description** | Situation-led opening (Malcolm voice), specs that answer "so what?" | Technical authority |
| **Below description** | Application guide, commonly bought together (instruction-led) | Right product confidence + cross-sell |
| **Cross-sell** | "You'll also need..." with instruction language | Complete-the-job selling |
| **Footer zone** | Store locations, returns policy, payment methods | Human access reinforcement |

### Content hierarchy for trade buyers

1. **What is this product?** (title, vendor, one-line descriptor)
2. **Is it right for my job?** (application, key spec, situation-led opening)
3. **Which variant do I need?** (colour swatches, size/quantity, package type)
4. **Why should I trust this supplier?** (authority signals, physical stores, expertise)
5. **What else do I need?** (cross-sell as instruction, not upsell)
6. **How do I buy?** (clear CTA, shipping clarity, no surprises)

### Mobile-specific considerations

- 40% of traffic is mobile (on-site tradespeople)
- Variant selection must be thumb-friendly
- Sticky add-to-cart is critical on mobile
- Trust signals can't be hidden behind tabs on mobile
- Product images must show the actual product clearly (colour accuracy matters)

---

## Horizon product page audit

### What exists today

The product page template (`templates/product.json`) uses two sections:

1. **`product-information`** — main product layout (media + details)
2. **`product-recommendations`** — "You may also like" grid below

#### Current block structure (product-details sidebar)

```
group (Header)
  ├── text (title — h1)
  └── price
_divider
variant-picker (buttons style, no swatches)
buy-buttons (quantity + add-to-cart + accelerated checkout)
text (product description — rte)
```

### What's missing for Solstice

| Need | Horizon provides? | What to do |
|------|-------------------|------------|
| Trust signal bar ("30 years / 4 stores / AU-owned") | No built-in | Custom block or text group with icon+text |
| Colour swatches on variant picker | Yes — `swatches` block exists | Enable in variant picker settings |
| Stock/inventory indicator | Yes — `product-inventory` block exists | Add to block order |
| SKU display | Yes — `sku` block exists | Add to block order |
| Collapsible specs/technical data | Yes — `accordion` block exists | Use for specs, application guide, TDS links |
| Cross-sell with instruction voice | Yes — `product-recommendations` section | Rename copy to "You'll also need" |
| Shipping estimate near buy button | No built-in | Custom text block or metafield-driven |
| Phone/contact link near CTA | No built-in | Custom text block with icon |
| Vendor logo/brand badge | No built-in | Custom block or metafield-driven image |
| Payment icons near buy button | Yes — `payment-icons` block exists | Add below buy-buttons |

### Key finding: Horizon's block system is flexible enough

Horizon's `_product-details` block supports: `@theme`, `@app`, `text`, `icon`, `image`, `button`, `video`, `group`, `spacer`, `accordion`, `product-recommendations`, `price`, `variant-picker`, `buy-buttons`, `product-description`, `review`, `accelerated-checkout`, `_divider`, `product-inventory`, `product-custom-property`.

This means most of the product page can be assembled from Horizon's built-in blocks **without custom Liquid**. The main gaps that need custom work:

1. **Trust signal bar** — can be faked with icon+text groups, or built as a custom block
2. **Shipping estimate** — needs a custom snippet or metafield-driven text
3. **Vendor logo** — needs custom Liquid or metafield

---

## Build vs modify decision

**Recommendation: Modify the existing template JSON, not the section Liquid.**

Reasons:
1. Horizon's `_product-details` block is a flexible container — we can add blocks to it via `templates/product.json` without touching `blocks/_product-details.liquid`
2. The `product-information` section and `product-information-content` snippet handle layout well (left/right media, sticky details, responsive grid)
3. Trust signals can be assembled from existing `text`, `icon`, and `group` blocks
4. Custom needs (vendor logo, shipping estimate) are small enough for custom blocks or snippets
5. Per CLAUDE.md convention: "Do not edit upstream Horizon sections/snippets directly — create overrides in custom files"

The only custom file we need is a `snippets/solstice-trust-bar.liquid` for the trust signal strip (if a snippet approach is cleaner than block assembly). Everything else is JSON template configuration.

---

## Sources

- `docs/analytics/findings.txt` — 28-day analytics
- `BUSINESS_PROFILE.md` — trust architecture, customer profiles
- `docs/design/brand_voice.md` — Malcolm voice, content structure
- `sections/product-information.liquid` — main product section
- `snippets/product-information-content.liquid` — layout rendering
- `blocks/_product-details.liquid` — product details block schema
- `templates/product.json` — current product template configuration
