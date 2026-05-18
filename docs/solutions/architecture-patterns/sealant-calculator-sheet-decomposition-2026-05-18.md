---
title: "Sealant calculator sheet decomposition for Horizon themes"
date: 2026-05-18
category: architecture-patterns
module: Solstice theme
problem_type: architecture_pattern
component: development_workflow
severity: medium
applies_when:
  - "When building a sheet/dialog form that needs a trigger-inline or overlay pattern"
  - "When extracting dialog lifecycle from a monolithic custom element in a Horizon theme"
  - "When splitting a monolith custom element into two elements following OS3 decomposition"
  - "When deciding whether modal lifecycle logic belongs in a form component or a separate sheet wrapper"
tags:
  - custom-elements
  - sealant-calculator
  - sheet
  - dialog
  - decomposition
  - horizon
  - shopify
  - architecture
---

## Context

The `solstice-sealant-calculator` custom element was a monolithic 331-line JS component and 805-line snippet violating OS3 decomposition guidelines (~150 line limit for JS custom elements, ~80 line limit for snippets). Modal lifecycle code (open/close/animation/focus/outside-click) was mixed with pure calculation and form logic, making the component harder to review, test, and maintain.

This was the second component to apply the sheet+form decomposition pattern after the bulk quote sheet at `docs/solutions/best-practices/bulk-quote-sheet-component-architecture-2026-05-18.md`.

## Guidance

Split monolithic custom elements into separate components following a **Sheet + Form** decomposition pattern:

1. **Sheet component** (e.g., `solstice-sealant-calculator-sheet`): owns trigger button, dialog lifecycle (open/close/animation/backdrop-click/Escape/focus-return), and `aria-expanded` state on the trigger. Imports `isClickedOutside` and `onAnimationEnd` from `@theme/utilities`. Modeled after `solstice-quote-sheet`.

2. **Form component** (e.g., `solstice-sealant-calculator`): pure calculation and form logic. Listens for native dialog `close` event to reset form state. No knowledge of the sheet's open/close lifecycle.

3. **Snippet HTML**: Nest the form element inside the sheet element's dialog so the sheet owns the chrome and the form owns the content:

```html
<solstice-sealant-calculator-sheet>
  <button ref="triggerButton" on:click="/handleOpenSheet">
  <dialog ref="sheet">
    <div class="sheet__panel">
      <header>
        <h2>Title</h2>
        <button ref="closeButton" on:click="/handleCloseSheet">
      </header>
      <solstice-sealant-calculator>
        ...form fields...
      </solstice-sealant-calculator>
    </div>
  </dialog>
</solstice-sealant-calculator-sheet>
```

4. **CSS**: Split into sheet-scoped (`.sealant-calculator-sheet__*`) and form-scoped (`.sealant-calculator__*`) class namespaces. Use right-side panel on desktop (`min(560px, 92vw)`) and bottom sheet on mobile with `env(safe-area-inset-bottom)`.

5. **Block file**: The block (`blocks/solstice-sealant-calculator.liquid`) renders the snippet, which includes both script tags. No changes needed to the block when splitting—it already delegates to the snippet.

## Why This Matters

Each component stays under OS3 size limits, making code review tractable. Sheet lifecycle bugs (focus trap, animation timing, Escape handling) and calculation bugs can be reasoned about and tested independently. The pattern is reusable across all modal/sheet UIs in the theme—every sheet component follows the same interface and lifecycle.

## When to Apply

- A JS custom element exceeds OS3 line limits (~150 lines) by mixing UI lifecycle with domain logic
- A snippet exceeds OS3 line limits (~80 lines) by nesting modal chrome around a form
- A new sheet/modal component is being created and could follow a consistent lifecycle pattern
- The same component needs to be reused in different contexts (e.g., embedded inline vs. in a sheet)

## Examples

**Before**: Single 331-line custom element managing trigger → modal → form → add-to-cart → presets → animation → outside-click → Escape in one class. Single 805-line snippet containing modal wrapper, header, close button, and all form fields.

**After**: 82-line sheet element (trigger + dialog lifecycle only). 299-line form element (pure calculation, listens for `close` event). Snippet nests `<solstice-sealant-calculator>` inside `<solstice-sealant-calculator-sheet>`'s dialog so markup mirrors the component hierarchy.

## Files Changed

| File | Action | Lines |
|------|--------|-------|
| `assets/component-sealant-calculator-sheet.js` | Created | 82 lines |
| `assets/component-sealant-calculator.js` | Refactored (removed modal lifecycle) | 299 lines (-32) |
| `snippets/sealant-calculator.liquid` | Rewritten (sheet structure + calculator icon + split CSS) | - |
| `blocks/solstice-sealant-calculator.liquid` | Unchanged | - |

## Related

- `docs/solutions/best-practices/bulk-quote-sheet-component-architecture-2026-05-18.md` — the proven `solstice-quote-sheet` + `solstice-quote-form` pattern this follows
- `docs/solutions/runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md` — references the original monolithic calculator file (line numbers now stale after split)
- `docs/solutions/best-practices/modularizing-oversized-components-BulkQuoteSheet-20260518.md` — companion doc covering the decomposition process
- `docs/solutions/best-practices/js-component-simplification-patterns-2026-05-18.md` — JS-level patterns that apply to the refactored calculator class
