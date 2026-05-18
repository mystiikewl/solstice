---
title: "Six JavaScript component lifecycle bugs caught by code review"
date: 2026-05-18
category: runtime-errors
module: Solstice theme
problem_type: runtime_error
component: frontend_stimulus
symptoms:
  - "MutationObserver never fires for variant picker programmatic changes"
  - "ReferenceError thrown on BuyModeToggle connect (bare observer reference)"
  - "SealantCalculator radio toggle broken in Firefox (implicit global event)"
  - "Memory leak on every disconnect/reconnect cycle (unremovable event listeners)"
  - "Duplicate fly-to-cart.js script loaded on product pages"
  - "setTimeout callback fires on removed component after navigation"
root_cause: async_timing
resolution_type: code_fix
severity: critical
related_components:
  - tooling
tags:
  - javascript
  - custom-elements
  - event-listeners
  - lifecycle-hygiene
  - firefox-compatibility
  - code-review
  - memory-leak
  - dom-timing
---

# Six JavaScript component lifecycle bugs caught by code review

## Problem

A proactive code review of JavaScript custom elements following a product page refactor in the Solstice Shopify theme found six P0/P1 bugs. All were related to component lifecycle hygiene, event handling correctness, and DOM timing — issues that would have caused runtime errors, memory leaks, and cross-browser incompatibilities in production.

## Symptoms

- **ReferenceError crash** when BuyModeToggle initializes — bare `observer` reference to non-existent variable
- **Variant picker changes silently ignored** — MutationObserver never fires when radio `checked` state changes via property assignment
- **SealantCalculator radio change handler crashes in Firefox** with `ReferenceError: event is not defined` (works in Chrome due to deprecated `window.event`)
- **QuoteForm event listeners never removed** on component teardown — handlers persist after element is removed from DOM, causing duplicate invocations if element is re-added
- **fly-to-cart.js loaded twice** on product pages — unnecessary network request and potential duplicate initialization
- **SealantCalculator setTimeout fires after component disconnected** — attempts to manipulate DOM on a removed element

## What Didn't Work

These bugs were not caught by failed investigation attempts or runtime debugging. They were discovered through **proactive code review** before reaching production. No runtime symptoms had yet been reported — this was a pre-emptive catch. The review process itself was the effective detection mechanism, highlighting the value of systematic code review for JavaScript custom elements, especially around lifecycle methods and event handling patterns.

The original Phase 2 plan (`docs/plans/2026-05-18-001-feat-product-page-phase2-plan.md`) had mandated disconnectedCallback cleanup as a requirement (U4), but the implementation contained bugs that the plan's verification step did not catch.

## Solution

### Bug 1: ReferenceError in BuyModeToggle (P0)

**File**: `assets/component-buy-mode-toggle.js:94`

**Before**:
```js
observer.observe(this.#variantPicker, {
  subtree: true,
  attributes: true,
  attributeFilter: ['checked'],
});
```

**After**:
```js
this.#observer.observe(this.#variantPicker, {
  subtree: true,
  attributes: true,
  attributeFilter: ['checked'],
});
```

### Bug 2: MutationObserver watches wrong thing (P0)

**File**: `assets/component-buy-mode-toggle.js:86-98`

**Before**:
```js
this.#observer = new MutationObserver(() => {
  this.#syncWithPicker();
  this.#updateSavingsDisplay();
});

this.#observer.observe(this.#variantPicker, {
  subtree: true,
  attributes: true,
  attributeFilter: ['checked'],
});
```

**After** (MutationObserver replaced entirely):
```js
this.#boundVariantChangeHandler = () => {
  this.#syncWithPicker();
  this.#updateSavingsDisplay();
};

this.#variantPicker.addEventListener('change', this.#boundVariantChangeHandler);
```

And in `disconnectedCallback`:
```js
this.#variantPicker?.removeEventListener('change', this.#boundVariantChangeHandler);
```

### Bug 3: Implicit global event in Firefox (P0)

**File**: `assets/component-sealant-calculator.js:70`

**Before**:
```js
#handleRadioChange() {
  const radio = event.currentTarget;
  // ...
}
// Bound as:
this.#handleRadioChangeBound = () => this.#handleRadioChange();
```

**After**:
```js
#handleRadioChange(event) {
  const radio = event.currentTarget;
  // ...
}
// Bound as:
this.#handleRadioChangeBound = (e) => this.#handleRadioChange(e);
```

### Bug 4: Event listener leak in QuoteForm (P1)

**File**: `assets/component-quote-form.js:16-20`

**Before**:
```js
connectedCallback() {
  this.#nextButton.addEventListener('click', this.#goToStep2.bind(this));
}

disconnectedCallback() {
  this.#nextButton.removeEventListener('click', this.#goToStep2);
}
```

**After**:
```js
#nextBound = null;
#backBound = null;

connectedCallback() {
  this.#nextBound = this.#goToStep2.bind(this);
  this.#nextButton.addEventListener('click', this.#nextBound);

  this.#backBound = this.#goToStep1.bind(this);
  this.#backButton.addEventListener('click', this.#backBound);
}

disconnectedCallback() {
  if (this.#nextButton && this.#nextBound) {
    this.#nextButton.removeEventListener('click', this.#nextBound);
  }
  if (this.#backButton && this.#backBound) {
    this.#backButton.removeEventListener('click', this.#backBound);
  }
}
```

### Bug 5: Duplicate script load (P1)

**File**: `snippets/scripts.liquid:254-259`

**Before**:
```liquid
<!-- Line 151: unconditional load -->
<script src="{{ 'fly-to-cart.js' | asset_url }}" type="module" fetchpriority="low"></script>

<!-- Lines 254-259: conditional duplicate load -->
{% if template == 'product' or template.name == 'product' or request.page_type == 'product' %}
  <script src="{{ 'fly-to-cart.js' | asset_url }}" type="module" fetchpriority="low"></script>
  ...
{% endif %}
```

**After**: Conditional duplicate block removed; only the unconditional load at line 151 remains.

### Bug 6: setTimeout leak in SealantCalculator (P1)

**File**: `assets/component-sealant-calculator.js:174`

**Before**:
```js
setTimeout(() => {
  feedback.setAttribute('hidden', '');
  this.handleCloseModal();
}, 1500);
```

**After**:
```js
// At class level:
#atcTimerId = null;

// In the callback:
this.#atcTimerId = setTimeout(() => {
  if (!this.isConnected) return;
  feedback.setAttribute('hidden', '');
  this.handleCloseModal();
}, 1500);

// In disconnectedCallback:
if (this.#atcTimerId) {
  clearTimeout(this.#atcTimerId);
  this.#atcTimerId = null;
}
```

## Why This Works

**Bug 1**: The private field was declared as `#observer` but referenced as bare `observer`, which doesn't exist in scope. Using `this.#observer` references the correctly initialized MutationObserver instance.

**Bug 2**: `input.checked = true` sets the DOM *property*, not the HTML *attribute*. MutationObserver only fires for attribute changes (like `setAttribute('checked', '')`). The `change` event is the correct mechanism for detecting form input state changes — it fires for both programmatic and user-initiated changes.

**Bug 3**: `window.event` is a deprecated, non-standard Chrome-only feature. Firefox and standards-compliant browsers do not expose it. Passing the event object explicitly as a parameter ensures the handler works across all browsers.

**Bug 4**: `.bind(this)` returns a **new function object** on every call. `removeEventListener` uses strict equality (`===`) to find the handler to remove. Since the bound function passed to `removeEventListener` was a different object than the one passed to `addEventListener`, the listener was never removed. Storing the bound function as a private field ensures the same reference is used for both add and remove.

**Bug 5**: The script was loaded unconditionally at line 151, then loaded again inside a product template conditional block. On product pages, the browser would fetch and execute the same script twice, wasting bandwidth and potentially causing duplicate initialization side effects.

**Bug 6**: A `setTimeout` scheduled on a custom element can fire after the element has been removed from the DOM. Without cleanup, this causes: (a) attempted DOM manipulation on a disconnected element, (b) the closure holding references to the element prevents garbage collection. Storing the timer ID and clearing it in `disconnectedCallback` ensures cleanup, and the `isConnected` guard provides a safety check if the timer somehow fires before cleanup.

## Prevention

1. **Always store bound event handlers as private fields** — `this.#handler = this.method.bind(this)` — and use that same reference for both `addEventListener` and `removeEventListener`. Never call `.bind()` inline in `addEventListener`.

2. **Never rely on `window.event`** — always declare `event` as an explicit parameter on handler methods. This is a hard Firefox incompatibility.

3. **Use DOM events (`change`, `input`), not MutationObserver, for form state changes** — MutationObserver watches attributes, not properties. Form inputs change state via properties.

4. **Clear all timers in `disconnectedCallback`** — every `setTimeout`/`setInterval` in a custom element must have its ID stored and cleared when the element is removed. Add an `isConnected` guard inside timer callbacks as defense-in-depth.

5. **Audit script includes for duplicates** — when adding conditional script loads, search the entire layout/template hierarchy to ensure the same asset isn't already loaded unconditionally elsewhere.

6. **Run systematic code review before merging any JavaScript custom element changes** — this review caught all six bugs before production. Make code review a mandatory gate for JS changes, with specific attention to:
   - Lifecycle method symmetry (every `addEventListener`/`setTimeout` in `connectedCallback` has a matching `removeEventListener`/`clearTimeout` in `disconnectedCallback`)
   - Private field references (`#field` vs bare `field`)
   - Cross-browser event handling (no `window.event` reliance)
   - Function reference identity for event listener removal

7. **Test in multiple browsers, specifically Firefox** — Firefox catches implicit globals and deprecated Chrome-only features that Chrome silently tolerates.

## Related Issues

- Original Phase 2 plan: `docs/plans/2026-05-18-001-feat-product-page-phase2-plan.md` (mandated the cleanup that these bugs reveal was incomplete)
- Asset customization docs: `docs/customizations/assets.md` (documents the three custom elements)
- Section customization docs: `docs/customizations/sections.md` (documents block-level DOM contracts)
