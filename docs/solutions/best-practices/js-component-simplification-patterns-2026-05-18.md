---
title: "JavaScript custom element simplification patterns"
date: 2026-05-18
category: best-practices
module: Solstice theme
problem_type: best_practice
component: frontend_stimulus
severity: medium
applies_when:
  - "When writing or refactoring JavaScript custom elements"
  - "After code review identifies duplication or anti-patterns"
  - "Before merging component changes"
tags:
  - javascript
  - custom-elements
  - code-quality
  - simplification
  - best-practice
  - refactoring
---

# JavaScript custom element simplification patterns

## Context

A `ce-simplify-code` pass was run on JavaScript custom elements in the Solstice Shopify theme after a code review identified 6 P0/P1 bugs ([related doc](../runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md)). The review revealed that beyond the runtime bugs, the code contained structural issues — duplicated logic, inconsistent state management patterns, and anti-patterns in class method definitions — that expanded the bug surface area and made the code harder to maintain.

## Guidance

### Pattern 1: Extract shared DOM query helpers

When the same DOM query pattern appears in multiple methods, extract it into a private helper with null-safety guards. This eliminates copy-paste duplication and makes the query intent explicit.

### Pattern 2: Unify state update logic into a single source of truth

When multiple methods perform the same state updates but accept different input types (element reference vs value string), consolidate into one method that accepts the normalized value. All callers normalize their input and delegate to the shared method.

### Pattern 3: Use prototype methods, not arrow function properties

Class methods should be defined as prototype methods (`async handleCloseModal() {}`) rather than arrow function properties (`handleCloseModal = async () => {}`). Arrow function properties create a new function object per instance, wasting memory and preventing proper method binding patterns.

### Pattern 4: Add `isConnected` guards after `await` in async flows

After any `await` in a custom element, check `this.isConnected` before continuing DOM manipulation. The component may have been removed from the DOM during the async wait, and operating on a disconnected element causes errors and prevents garbage collection.

### Pattern 5: Consolidate field declarations at class top or bottom

Group all private field declarations together with consistent JSDoc documentation. Avoid scattered inline declarations (e.g., a field declared both mid-method and at class bottom) — they signal confusion and can create shadowing issues.

## Why This Matters

- **Reduced duplication**: Shared helpers eliminate copy-paste errors and make updates atomic — change the query in one place, not two.
- **Single source of truth**: Unified state updates prevent divergence between similar code paths. When the state shape changes, only one method needs updating.
- **Memory efficiency**: Prototype methods are shared across all instances. Arrow function properties allocate a new closure per instance — negligible for singletons, wasteful for components that may appear multiple times on a page.
- **Async safety**: Disconnect guards prevent "zombie" operations on removed elements. Without the guard, `await` callbacks continue executing on dead DOM, potentially throwing or preventing garbage collection.
- **Scannability**: Consolidated field declarations make the class interface immediately readable. Developers can see all state at a glance without hunting through method bodies.
- **Bug surface reduction**: Each pattern directly addresses a class of bugs. Duplicated queries drift out of sync. Arrow function properties break `this` binding expectations. Missing disconnect guards cause post-removal crashes.

## When to Apply

- After code reviews identify structural issues in custom element code
- When duplicated DOM queries or state updates are found across methods
- When custom elements use arrow function properties for event handlers or public methods
- When async operations in custom elements lack disconnect checks
- When field declarations are scattered throughout a class definition
- During `ce-simplify-code` passes on JavaScript custom elements
- Before merging component changes into the main branch

## Examples

### Example 1: Extracted shared helper

**Before** (duplicated in `#selectVariantOption()` and `#syncWithPicker()`):
```js
// In two separate methods:
const fieldset = this.#variantPicker.querySelectorAll('fieldset')[this.#optionIndex];
```

**After**:
```js
#getFieldset() {
  return this.#variantPicker?.querySelectorAll('fieldset')[this.#optionIndex];
}

// Both methods now use:
const fieldset = this.#getFieldset();
```

### Example 2: Unified state updates

**Before** (two separate loops doing the same thing):
```js
#setActive(activeButton) {
  this.#options.forEach((option) => {
    option.removeAttribute('data-active');
    option.setAttribute('aria-checked', 'false');
  });
  activeButton.setAttribute('data-active', '');
  activeButton.setAttribute('aria-checked', 'true');
}

#syncWithPicker() {
  const currentValue = checkedInput.value.toLowerCase();
  this.#options.forEach((option) => {
    const optionValue = option.dataset.value?.toLowerCase();
    if (optionValue === currentValue) {
      option.setAttribute('data-active', '');
      option.setAttribute('aria-checked', 'true');
    } else {
      option.removeAttribute('data-active');
      option.setAttribute('aria-checked', 'false');
    }
  });
}
```

**After**:
```js
#setActive(activeButton) {
  this.#setActiveByValue(activeButton.dataset.value?.toLowerCase());
}

#syncWithPicker() {
  this.#setActiveByValue(checkedInput.value.toLowerCase());
}

#setActiveByValue(value) {
  this.#options.forEach((option) => {
    const optionValue = option.dataset.value?.toLowerCase();
    if (optionValue === value) {
      option.setAttribute('data-active', '');
      option.setAttribute('aria-checked', 'true');
    } else {
      option.removeAttribute('data-active');
      option.setAttribute('aria-checked', 'false');
    }
  });
}
```

### Example 3: Prototype method conversion

**Before**:
```js
handleCloseModal = async () => {
  const { modal, triggerButton } = this.refs;
  // ... modal close logic
};
```

**After**:
```js
async handleCloseModal() {
  const { modal, triggerButton } = this.refs;
  // ... modal close logic
}
```

### Example 4: Async disconnect guard

**Before**:
```js
async handleCloseModal() {
  await onAnimationEnd(modal, undefined, { subtree: false });
  modal.classList.remove('calc-closing');
  modal.close();
  triggerButton?.focus();
}
```

**After**:
```js
async handleCloseModal() {
  await onAnimationEnd(modal, undefined, { subtree: false });
  if (!this.isConnected) return;
  modal.classList.remove('calc-closing');
  modal.close();
  triggerButton?.focus();
}
```

## Related

- [Six JavaScript component lifecycle bugs](../runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md) — the code review that identified the original P0/P1 bugs and prompted this simplification pass
- `ce-simplify-code` skill — the workflow that produced these improvements
- Shopify Horizon OS3 architecture — custom element conventions for the Solstice theme
- [Bulk quote sheet component architecture](../best-practices/bulk-quote-sheet-component-architecture-2026-05-18.md) — applies simplification patterns (shared helpers, unified state) to a trigger-to-sheet refactor with bidirectional variant sync
