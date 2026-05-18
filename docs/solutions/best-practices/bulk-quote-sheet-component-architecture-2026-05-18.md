---
title: "Bulk quote sheet component architecture for Horizon themes"
date: 2026-05-18
category: best-practices
module: Solstice theme
problem_type: best_practice
component: development_workflow
severity: medium
applies_when:
  - "When building a sheet/modal form that needs to work inline or as overlay"
  - "When adding dialog-based UI components to a Horizon theme"
  - "When extracting shared form fields between sheet and inline contexts"
  - "When syncing variant data between a form component and PDP variant picker"
  - "When structuring custom elements following OS3 conventions"
  - "When expanding select/option fields with many values"
tags:
  - javascript
  - custom-elements
  - quote-form
  - dialog
  - sheet
  - horizon
  - best-practice
  - variant-sync
  - liquid
  - os3
  - shopify
---

# Bulk quote sheet component architecture for Horizon themes

## Context

A bulk-quote-sheet feature was refactored on a Shopify Horizon theme (Solstice v3.4.0) to add a sheet/dialog overlay option alongside the existing inline form. The refactor touched JavaScript custom elements, Liquid sections/snippets, CSS, and template JSON. During implementation, several bugs emerged around script-tag conditional loading, dialog animation timing, bottom-cutoff on mobile, missing hidden fields, and race conditions in async close handlers. These were fixed and the patterns documented.

**This pattern has since been applied to a second component** — the `solstice-sealant-calculator` followed the same Trigger → Sheet → Form decomposition (see the [sealant calculator sheet decomposition](../architecture-patterns/sealant-calculator-sheet-decomposition-2026-05-18.md) doc). This confirms the pattern generalizes beyond the original quote-form context.

## Guidance

### Architecture pattern: Trigger → Sheet → Form

Use two separate custom elements that compose together:

- **`solstice-quote-sheet`** (`<dialog>` element): handles open/close, Escape key, outside-click dismiss, focus return, and animation timing. Renders as a right sheet (desktop) or bottom sheet (mobile).
- **`solstice-quote-form`** (form element): contains the form logic — field validation, variant-title sync from `selectedOptions`, industry select, and submission.

The sheet wraps the form: `{% if enable_sheet %}<solstice-quote-sheet>…</solstice-quote-sheet>{% else %}…inline…{% endif %}`. Both paths render the same form but the sheet adds the dialog wrapper.

### Pricing proof visual pattern (Dynamic discount math)

When a quote form is used for "Bulk Buy" or "Trade Pricing", replacing a simple static text box with a dynamic "Pricing Proof" grid significantly improves conversion. This visual shows the user exactly how much they save per unit.

**Pattern characteristics:**
- **Liquid calculation**: Calculate the initial 10% discount and savings based on the `selected_or_first_available_variant` for the first render.
- **Data-price attributes**: Add `data-price="{{ variant.price }}"` to the variant select options.
- **Dynamic JS updates**: Use `formatMoney` from `@theme/money-formatting` to update the Single Unit, Bulk Buy, and Save values whenever the variant selection changes.
- **Ref targeting**: Use specific `ref` attributes (`singleUnitPrice`, `bulkBuyPrice`, `savingsAmount`) for surgical DOM updates.

**Implementation Example:**

```liquid
{% comment %} snippets/quote-form-fields.liquid {% endcomment %}
<div class="quote-sheet__bulk-proof" ref="bulkProof">
  <p class="quote-sheet__bulk-intro">Better rates for larger orders - Send your quantity and we'll confirm the best trade price.</p>
  <div class="quote-sheet__bulk-grid">
    <div class="quote-sheet__bulk-item">
      <span class="quote-sheet__bulk-label">Single Unit</span>
      <span class="quote-sheet__bulk-value" ref="singleUnitPrice">{{ product.selected_or_first_available_variant.price | money }}</span>
    </div>
    <div class="quote-sheet__bulk-item">
      <span class="quote-sheet__bulk-label">Bulk Buy</span>
      {% assign bulk_price = product.selected_or_first_available_variant.price | times: 0.9 | round %}
      <span class="quote-sheet__bulk-value" ref="bulkBuyPrice">{{ bulk_price | money }}</span>
    </div>
    <div class="quote-sheet__bulk-item">
      <span class="quote-sheet__bulk-label">Save</span>
      {% assign savings = product.selected_or_first_available_variant.price | minus: bulk_price %}
      <span class="quote-sheet__bulk-value quote-sheet__bulk-value--savings" ref="savingsAmount">{{ savings | money }}</span>
    </div>
  </div>
</div>
```

```js
// assets/component-quote-form.js
#updatePricingProof() {
  if (!this.refs.bulkProof || !this.refs.quoteVariantSelect) return;

  const selected = this.refs.quoteVariantSelect.selectedOptions?.[0];
  const priceCents = parseInt(selected?.dataset?.price || '0', 10);
  const moneyFormat = window.Shopify?.money_format || '${{amount}}';

  if (priceCents > 0) {
    const bulkPrice = Math.round(priceCents * 0.9);
    const savings = priceCents - bulkPrice;

    this.refs.singleUnitPrice.textContent = formatMoney(priceCents, moneyFormat);
    this.refs.bulkBuyPrice.textContent = formatMoney(bulkPrice, moneyFormat);
    this.refs.savingsAmount.textContent = formatMoney(savings, moneyFormat);
  }
}
```

### Script-tag conditional loading

**Never wrap a `<script>` tag importing a custom element inside a Liquid conditional branch where that custom element is not rendered.** If the element is rendered only in the `{% if enable_sheet %}` branch, the `<script type="module" src="…">` must also be in that branch. Otherwise the custom element class is never registered and the trigger button does nothing.

**Correct structure:**

```liquid
{% if enable_sheet %}
  {{ 'component-quote-sheet.js' | asset_url | script_tag }}
  <solstice-quote-sheet>
    <solstice-quote-form>
      {% render 'quote-form-fields' %}
    </solstice-quote-form>
  </solstice-quote-sheet>
{% else %}
  <solstice-quote-form>
    {% render 'quote-form-fields' %}
  </solstice-quote-form>
{% endif %}
```

### Extract shared form fields into a snippet

When the same form fields render in both sheet and inline contexts, extract them to a shared snippet (`quote-form-fields.liquid`). This eliminates duplication and ensures the sheet and inline forms stay in sync.

The extracted snippet contains all fields (variant dropdown, quantities, industry select, message, hidden metadata fields) and is rendered by both branches. Schema-level attributes (like `contact[message]` vs `contact[notes]`) live in the snippet so changes apply everywhere.

### Bidirectional variant sync

The quote form contains a dropdown that mirrors the PDP variant picker. Sync must work in both directions:

1. **PDP picker change → quote form dropdown updates**: Listen for `selectedOptions` change events on the PDP picker; update the dropdown `value` to match.
2. **Quote form dropdown change → all PDP picker options update**: When the user picks a different variant in the quote form, programmatically click the corresponding radio button/option in each PDP fieldset.

The dropdown options are populated from an array of variant objects serialized from Liquid. The sync logic reads `selectedOptions` for direction 1 and dispatches click events on picker inputs for direction 2.

### Dialog open/close/animation timing

The `<dialog>` element with `showModal()` provides built-in top-layer rendering, Escape handling, and scroll locking. However:

- **Closing animation**: After calling `dialog.close()`, the dialog is immediately removed from the top layer. To run a closing animation, apply a `closing` class *before* calling `close()`, then use a timeout matching the CSS animation duration before actually closing. Common pitfall: a race condition where `close()` fires before the closing animation renders.
- **Bottom-cutoff on mobile**: Use `dialog:modal { max-block-size: 100dvh; overflow: hidden }` on the dialog element, and let the inner panel handle scrolling (`overflow-y: auto; overflow-x: hidden`). Add `env(safe-area-inset-bottom)` padding on mobile.
- **Focus return**: `showModal()` automatically traps focus; on close, explicitly `focus()` the trigger button to return focus.
- **Outside-click**: `<dialog>` with `showModal()` does not close on outside click by default. Add a click handler on the dialog backdrop that checks `if (event.target === dialog)` to close only on backdrop clicks (not panel clicks).
- **Bound handler cleanup**: Always store bound handler references and remove them in `disconnectedCallback`.

### OS3 component file size conventions

Horizon OS3 architecture recommends:

| File type | Max lines |
|-----------|-----------|
| Block (`.liquid`) | ~30 lines |
| Snippet (`.liquid`) | ~80 lines |
| JS custom element | ~150 lines |

When a component exceeds these limits, split into smaller pieces. For forms with many fields or complex logic, extract partial snippets and import shared utilities.

### Industry field expansion pattern

When expanding a select field from 7 to 23 options, use slug-style values (`facility-property-maintenance`, `glass-aluminium`) rather than display-formatted labels. The display label is the option text; the value is the machine-readable slug. This keeps translations and styling consistent.

## Why This Matters

- **Conditional script loading**: Wrapping the script tag in the wrong Liquid branch means the custom element never registers. The trigger button appears to do nothing — a silent failure with no console error.
- **Shared form snippet**: Duplicated form fields inevitably drift apart. A field added to the inline form but not the sheet (or vice versa) creates a confusing UX where the same feature behaves differently depending on context.
- **Bidirectional sync**: If sync is one-directional, the user can select a variant in the PDP picker, see it update in the quote form, but then when they change it in the quote form, the PDP picker still shows the old variant. This creates a disconnect between what the user sees and what gets submitted.
- **Dialog timing**: Without the animation timeout race condition pattern, the closing animation flickers or never plays. The dialog simply disappears.
- **Bottom-cutoff**: Without the `:modal` overflow fix and safe-area padding, the bottom of the sheet is hidden behind the mobile browser chrome — users can't see or tap the submit button.
- **OS3 conventions**: Exceeding file size limits indicates the component is doing too much. Breaking it apart makes the code easier to review, test, and maintain.

## When to Apply

- When adding a dialog/sheet/overlay version of an existing inline form
- When any custom element is gated behind a Liquid `{% if %}` condition
- When duplicate form markup appears in two or more templates/snippets
- When a form component needs to reflect PDP variant picker state
- When building `<dialog>`-based UI with enter/exit animations
- When form field options grow beyond a handful of items
- When reviewing component file sizes against OS3 limits

## Examples

### Example 1: Script-tag conditional branching bug

**What went wrong:** The `component-quote-sheet.js` script tag was inside the `{% else %}` (inline) block — meaning when `enable_sheet` was `true`, the script was never loaded, the `solstice-quote-sheet` custom element was never registered, and clicking the trigger button did nothing.

```liquid
{% comment %} WRONG: script tag in else branch runs only when sheet is disabled {% endcomment %}
{% if enable_sheet %}
  <solstice-quote-sheet>…</solstice-quote-sheet>
{% else %}
  {{ 'component-quote-sheet.js' | asset_url | script_tag }}
  <solstice-quote-form>…</solstice-quote-form>
{% endif %}
```

**Fixed by:**

```liquid
{% comment %} CORRECT: script tag in if branch where the element is rendered {% endcomment %}
{% if enable_sheet %}
  {{ 'component-quote-sheet.js' | asset_url | script_tag }}
  <solstice-quote-sheet>
    <solstice-quote-form>
      {% render 'quote-form-fields' %}
    </solstice-quote-form>
  </solstice-quote-sheet>
{% else %}
  <solstice-quote-form>
    {% render 'quote-form-fields' %}
  </solstice-quote-form>
{% endif %}
```

### Example 2: Bottom-cutoff dialog fix

**Problem:** On mobile, the sheet bottom was hidden behind browser chrome.

**Fix:** Apply the same pattern used for the cart drawer:

```css
solstice-quote-sheet:modal {
  max-block-size: 100dvh;
  overflow: hidden;
}

solstice-quote-sheet .quote-sheet__panel {
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: calc(env(safe-area-inset-bottom) + 1rem);
}
```

Key insight: The `:modal` dialog controls the top-layer viewport overflow; the inner panel controls the scrollable content. Padding on inner panel prevents content from hiding behind mobile chrome.

### Example 3: Shared fields extraction pattern

**Before:** Form fields duplicated in both the sheet block and inline snippet — each with their own copy of the variant dropdown, industry select, message field, and hidden metadata.

**After:** Created `snippets/quote-form-fields.liquid` containing all shared fields:

```liquid
{% comment %} snippets/quote-form-fields.liquid — rendered by both sheet and inline {% endcomment %}
<select name="properties[Product]" id="quote-product-select">
  {% for variant in product.variants %}
    <option value="{{ variant.id }}" data-title="{{ variant.title }}" data-price="{{ variant.price }}">
      {{ variant.title }} — {{ variant.price | money }}
    </option>
  {% endfor %}
</select>

<select name="contact[industry]" id="quote-industry">
  <option value="">Select your industry</option>
  <option value="facility-property-maintenance">Facility / Property Maintenance</option>
  <option value="glass-aluminium">Glass / Aluminium</option>
  {# ... 21 more options ... #}
</select>

<textarea name="contact[message]" placeholder="Message"></textarea>

<input type="hidden" name="contact[product_url]" value="{{ product.url }}">
<input type="hidden" name="contact[product_id]" value="{{ product.id }}">
```

Both `{% if enable_sheet %}` and `{% else %}` branches now render `{% render 'quote-form-fields' %}`.

### Example 4: Bidirectional variant sync

```js
// Direction 1: PDP picker → quote form dropdown
#onPickerChange() {
  if (!this.#variantPicker) return;
  const titles = this.#variantPicker.selectedOptions
    .map(f => f.dataset.value || f.textContent.trim());
  const match = titles.join(' / ');
  const select = this.refs.productSelect;
  if (select) select.value = match;
}

// Direction 2: Quote form dropdown → PDP picker
#onSelectChange() {
  const select = this.refs.productSelect;
  if (!select) return;
  const selectedTitle = select.options[select.selectedIndex]?.dataset?.title?.toLowerCase();
  if (!selectedTitle) return;
  const fieldsets = this.#getFieldsets();
  for (const fieldset of fieldsets) {
    const input = fieldset.querySelector(`input[value]`);
    // Map dropdown title back to picker options
  }
}
```

### Example 5: Async close handler with race condition guard

```js
async handleCloseSheet() {
  const { panel, triggerButton } = this.refs;
  panel.classList.add('calc-closing');
  // Wait for CSS animation to complete before closing
  await new Promise(resolve => setTimeout(resolve, 400));
  if (!this.isConnected) return;
  panel.classList.remove('calc-closing');
  this.close();
  triggerButton?.focus();
}
```

The `400ms` timeout matches the CSS `transition-duration`. Without it, `dialog.close()` fires before the closing animation renders, causing a flicker. The `this.isConnected` guard handles the case where the element is removed from the DOM during the async wait.

## Related

- [Six JavaScript component lifecycle bugs](../runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md) — covers the `customElements.get` guard, `isConnected` patterns, and Firefox-safe event handling that was also applied to this refactor
- [JavaScript custom element simplification patterns](./js-component-simplification-patterns-2026-05-18.md) — covers `this.refs` pattern, prototype methods, and async disconnect guards used in this implementation
- [Sealant calculator sheet decomposition](../architecture-patterns/sealant-calculator-sheet-decomposition-2026-05-18.md) — second application of this Trigger → Sheet → Form pattern, confirming it generalizes beyond the quote-form context
- `horizon-architect` skill — OS3 decomposition guidance for Horizon components
- `horizon-build` skill — schema-aware, tokenized component building conventions
