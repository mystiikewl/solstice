---
module: Solstice Theme
date: 2026-05-18
problem_type: best_practice
component: development_workflow
symptoms:
  - "Monolithic Liquid snippet (720+ lines) violating Horizon OS3 limits"
  - "Excessive inline CSS (500+ lines) hindering maintainability"
  - "Mixed concerns (trigger, modal, calculation logic, result UI) in one file"
root_cause: logic_error
resolution_type: workflow_improvement
severity: low
tags: [modularization, composition, shopify-theme, os3, best-practice, calculator]
---

# Troubleshooting: Modularizing Oversized Components (Sealant Calculator)

## Problem
The Sealant Calculator snippet was a 720+ line monolithic file ("God snippet") that contained trigger markup, modal structure, detailed calculation inputs, results display, and over 500 lines of inline CSS. This violated the Horizon OS3 80-line limit for snippets and made the component difficult to maintain or style.

## Environment
- Module: Solstice Theme
- Affected Component: Sealant Calculator (Liquid snippets and Assets)
- Date: 2026-05-18

## Symptoms
- `snippets/sealant-calculator.liquid` exceeded 720 lines (Limit: ~80 lines).
- Inline CSS blocks accounted for ~70% of the file size.
- Hard to navigate and edit specific UI sections (e.g., Presets vs. Dimensions) due to extreme file length.

## What Didn't Work
**Direct solution:** The problem was identified and fixed using the **Orchestrator Snippet** pattern, following the successful refactor of the Bulk Quote Sheet.

## Solution
The component was decomposed into a highly modular architecture consisting of one orchestrator, nine specialized sub-snippets, and one external CSS asset.

1.  **Externalized CSS**: Moved 500+ lines of CSS to `assets/component-sealant-calculator-sheet.css`.
2.  **Specialized Sub-snippets**:
    *   `snippets/sealant-calculator-trigger.liquid`: Interactive trigger button.
    *   `snippets/sealant-calculator-header.liquid`: Modal header and close action.
    *   *Inputs*: `presets.liquid`, `dimensions.liquid`, `unit-size.liquid`, `wastage.liquid`.
    *   *Display*: `summary.liquid`, `error.liquid`, `results.liquid`.
3.  **Orchestrator Integration**: Refactored the main snippet to delegate to these parts, reducing its size to 66 lines.

**Code Example (Modularized Orchestrator):**
```liquid
{% comment %} snippets/sealant-calculator.liquid {% endcomment %}
{{ 'component-sealant-calculator-sheet.css' | asset_url | stylesheet_tag }}

<solstice-sealant-calculator-sheet ...>
  {% render 'sealant-calculator-trigger', ... %}
  
  <dialog ...>
    <div class="sealant-calculator-sheet__panel">
      {% render 'sealant-calculator-header', ... %}

      <solstice-sealant-calculator ...>
        {% render 'sealant-calculator-presets', ... %}
        {% render 'sealant-calculator-dimensions', ... %}
        {% render 'sealant-calculator-unit-size', ... %}
        {% render 'sealant-calculator-wastage' %}
        {% render 'sealant-calculator-summary' %}
        {% render 'sealant-calculator-error', ... %}
        {% render 'sealant-calculator-results', ... %}
      </solstice-sealant-calculator>
    </div>
  </dialog>
</solstice-sealant-calculator-sheet>
```

## Why This Works
1.  **Readability**: Developers can now jump directly to the relevant file (e.g., `dimensions.liquid`) to change specific logic without scanning 700 lines of code.
2.  **Compliance**: Brings the snippet well under the 80-line Horizon OS3 guardrail.
3.  **Separation of Concerns**: UI components are decoupled from the main container, allowing for easier reuse or swapping of parts in the future.
4.  **Optimized Rendering**: Moving CSS to an asset file allows the browser to cache styles and reduces the HTML payload.

## Prevention
1.  **Atomic Design**: Think of components as a collection of atoms/molecules from the start.
2.  **Snippet Limits**: Monitor file size during development; once a snippet hits ~50 lines, evaluate it for sub-snippet extraction.
3.  **No Inline CSS**: Always prefer `assets/*.css` over inline `{% stylesheet %}` blocks for feature-heavy components.

## Related Issues
- See also: [modularizing-oversized-components-BulkQuoteSheet-20260518.md](../best-practices/modularizing-oversized-components-BulkQuoteSheet-20260518.md)
- Similar to: [bulk-quote-sheet-component-architecture-2026-05-18.md](../best-practices/bulk-quote-sheet-component-architecture-2026-05-18.md)
