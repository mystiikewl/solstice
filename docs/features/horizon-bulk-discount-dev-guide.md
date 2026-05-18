# Horizon Bulk Quote Panels: Developer Guide

## Scope

This guide documents the current implementation of:

- `snippets/bulk-discount.liquid`
- `snippets/bulk-discount-cta.liquid`

It also defines a Horizon-native rebuild direction using a trigger-to-sidebar (or trigger-to-sheet) interaction model.

Primary files in current system:

- `snippets/bulk-discount.liquid`
- `snippets/bulk-discount-cta.liquid`
- `snippets/bulk-discount-form-fields.liquid`
- `assets/bulk-discount-progressive.js`
- `assets/contact-form-tracking.js`

## Current Architecture (What Exists Today)

### 1) Render Gating Primitive

The two snippets are mutually exclusive by product tag:

- `bulk-discount.liquid` renders when `product.tags contains 'bulk-discount'`
- `bulk-discount-cta.liquid` renders when product does not contain that tag

This guarantees one quote panel variant per PDP.

### 2) Pricing Proof Primitive (Priced Variant)

`bulk-discount.liquid` computes pricing proof in Liquid:

```liquid
discount_percentage = 0.9
discount_price = product.price * discount_percentage
rounded_discount_price = round(discount_price)
savings_amount = product.price - rounded_discount_price
```

Output is rendered as:

- standard price
- bulk price
- savings value

### 3) Quote Value Primitive (Inquiry Variant)

`bulk-discount-cta.liquid` uses non-price proof copy:

- value chip
- concise support text

No price math in this branch.

### 4) Native Shopify Form Primitive

Both variants rely on native contact form posts:

- `{% form 'contact' %}`
- form identity (`form_id`) includes product ID
- source/variant metadata passed via data attributes and hidden fields

Shared hidden metadata includes:

- submission source
- form variant
- product title/handle
- variant title
- page URL
- routing note

### 5) Progressive Two-Step Form Primitive

`snippets/bulk-discount-form-fields.liquid` + `assets/bulk-discount-progressive.js` provide:

- step 1: quantity, name, email
- continue button (`data-bulk-progressive-continue`)
- step 2: phone, company, industry, suburb, postcode, message, follow-up
- submit hidden until step 2 opens

Behavior contracts:

- Enter on step 1 advances to step 2
- step 1 validity required before expansion
- step 2 auto-expands on server-side errors
- step 2 field set disabled while collapsed

### 6) Tracking Primitive

`assets/contact-form-tracking.js` tracks:

- `bulk_quote_view`
- `bulk_quote_start`
- `bulk_quote_submit_attempt`
- success events via `contact_posted=true` redirect and session metadata restore

This tracking contract should be preserved during any rebuild.

## Why a Trigger -> Sidebar/Sheet Rebuild Is Better

Yes, your intuition is right. For Horizon, a trigger-first model is cleaner because:

1. PDP visual noise drops (form no longer always expanded inline).
2. Conversion intent is explicit (user opts into quote flow).
3. Reuses proven pattern already used by calculator sidebar.
4. Better mobile ergonomics (bottom sheet with focused fields).
5. Easier future expansion (attach files, delivery preferences, project type presets).

## Recommended Horizon v2 Pattern

### Primitive A: Trigger Surface

Inline compact panel with:

- eyebrow/title/subtitle
- proof row (priced or inquiry)
- single CTA button: `Get trade pricing`

Contract:

- `data-open-bulk-quote-sidebar`
- `aria-controls="bulk-quote-sidebar"`

### Primitive B: Quote Sidebar/Sheet Surface

Dedicated container rendered once on PDP:

- `id="bulk-quote-sidebar"`
- `data-bulk-quote-sidebar`
- `role="dialog"`
- `aria-modal="true"`
- close control: `data-close-bulk-quote-sidebar`

Desktop: right sidebar. Mobile: bottom sheet.

### Primitive C: Form Engine

Reuse existing field partial:

- `snippets/bulk-discount-form-fields.liquid`

Keep progressive disclosure JS behavior, but scope selectors to sidebar root to avoid collisions with future inline forms.

### Primitive D: Variant Context Sync

Before submit, always sync:

- current PDP selected variant title -> hidden `contact[Variant Title]`

Current tracking script already does this; keep equivalent behavior.

### Primitive E: Success State

Inside sidebar:

- success card after post
- optional secondary CTA: `Continue shopping`
- close action returns focus to trigger

## Rebuild Contract (Must Keep)

Do not change these without a deliberate analytics migration:

- `data-bulk-quote-form`
- `data-bulk-quote-source`
- `data-bulk-quote-variant`
- hidden metadata key names under `contact[...]`
- progressive step behavior and required fields
- event names in `contact-form-tracking.js`

## Implementation Blueprint

1. Add new snippet `snippets/bulk-quote-trigger.liquid` (priced + inquiry visual shell).
2. Add new snippet `snippets/bulk-quote-sidebar.liquid` (dialog container + form mount).
3. Add new JS `assets/component-bulk-quote-sidebar.js` (open/close, focus trap, Escape, reset, overlay click).
4. Reuse `bulk-discount-form-fields` inside sidebar.
5. Keep `bulk-discount-progressive.js` and `contact-form-tracking.js` compatibility attributes.
6. Feature-flag rollout by theme setting or product tag (`bulk-quote-v2`) before replacing legacy inline render path.

## Acceptance Criteria for Horizon Rebuild

- Exactly one trigger panel shown on PDP.
- Quote form opens in sidebar/sheet from trigger click.
- Keyboard and screen-reader behavior match calculator-grade dialog quality.
- Progressive step logic remains identical to current behavior.
- Submission metadata and analytics parity preserved.
- Success and error states stay inside the quote surface.

## File References

- `snippets/bulk-discount.liquid`
- `snippets/bulk-discount-cta.liquid`
- `snippets/bulk-discount-form-fields.liquid`
- `assets/bulk-discount-progressive.js`
- `assets/contact-form-tracking.js`
