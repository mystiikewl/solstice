---
module: Solstice Theme
date: 2026-05-18
problem_type: best_practice
component: development_workflow
symptoms:
  - "Large, complex files violating Horizon OS3 line count limits (400+ lines in snippets, 100+ in blocks)"
  - "Inline CSS in Liquid snippets making code difficult to read and maintain"
  - "Difficult to modify specific form sections without risking regressions in others"
root_cause: logic_error
resolution_type: workflow_improvement
severity: low
tags: [modularization, composition, shopify-theme, os3, best-practice]
---

# Troubleshooting: Modularizing Oversized Components (Bulk Quote Sheet)

## Problem
The Bulk Quote Sheet component had become an oversized "God file" violating Horizon OS3 limits (400+ lines in snippets, 100+ in blocks), making it unmaintainable and violating the repository's core mandates for file size and composition-first design.

## Environment
- Module: Solstice Theme
- Affected Component: Bulk Quote Sheet (Liquid snippets, Blocks, and Assets)
- Date: 2026-05-18

## Symptoms
- `snippets/quote-form.liquid` exceeded 400 lines (Limit: ~80 lines).
- `blocks/solstice-quote-form.liquid` was approaching 100 lines (Limit: ~30 lines for Liquid wrapper).
- Extensive inline CSS blocks inside Liquid files, hindering syntax highlighting and separation of concerns.

## What Didn't Work

**Direct Solution:** The problem was identified and fixed through systematic decomposition on the first attempt. No incorrect paths were taken, as the Horizon OS3 Cheat Sheet provided clear architectural guidance.

## Solution

The oversized component was decomposed into a modular architecture using the **Orchestrator Snippet** pattern.

1. **Externalized CSS**: Moved over 250 lines of inline CSS to `assets/component-quote-sheet.css`.
2. **Created Specialized Sub-snippets**:
   - `snippets/quote-form-trigger.liquid`: Handles the interactive trigger button.
   - `snippets/quote-form-sheet-header.liquid`: Handles the dialog/sheet header and close button.
   - `snippets/quote-form-contact-fields.liquid`: Focused on user contact information.
   - `snippets/quote-form-location-fields.liquid`: Handles address-related inputs.
   - `snippets/quote-form-variant-select.liquid`: Manages product variant selection logic.
   - `snippets/quote-form-hidden-fields.liquid`: Encapsulates form tracking and metadata.
   - `snippets/quote-form-industry-options.liquid`: Extracts long option lists (25+ items).
3. **Implemented Orchestrator**: Refactored `snippets/quote-form.liquid` to be a thin logic layer that uses `{% render %}` for the components above.

**Code Example (Orchestrator):**
```liquid
{% comment %} Before: 400+ lines of inline HTML, CSS, and logic {% endcomment %}

{% comment %} After (Orchestrator Pattern): {% endcomment %}
{% liquid
  # Logic to determine headings/labels
%}

{{ 'component-quote-sheet.css' | asset_url | stylesheet_tag }}

{% if enable_sheet %}
  {% render 'quote-form-sheet', ... %}
{% else %}
  {% render 'quote-form-inline', ... %}
{% endif %}
```

## Why This Works

1. **Root Cause**: The component was built as a single monolithic file, which is a common "anti-pattern" in legacy themes but prohibited by Horizon OS3 mandates.
2. **Modularization**: By splitting the component, we achieve "One file, one job." This reduces cognitive load and makes the code searchable by intent.
3. **Performance**: Externalizing CSS allows for browser caching and reduces the weight of the initial HTML document.
4. **Maintainability**: Future changes to specific areas (like adding a new industry option) now involve editing a 20-line file instead of navigating a 400-line one.

## Prevention

1. **Follow the Cheat Sheet**: Strictly adhere to the line count limits in `docs/horizon-os3-cheat-sheet.md` from the beginning of implementation.
2. **Orchestrator Pattern**: Use an orchestrator snippet for any feature that has both an "inline" and "overlay/sheet" version.
3. **Asset First**: Prefer external CSS files in `assets/` over `{% stylesheet %}` blocks in snippets for components with significant styling.
4. **Extract Option Lists**: Any `select` field with more than 10 options should have its options extracted to a sub-snippet for clarity.

## Related Issues

- [bulk-quote-sheet-component-architecture-2026-05-18.md](../best-practices/bulk-quote-sheet-component-architecture-2026-05-18.md)
- [six-js-component-lifecycle-bugs-2026-05-18.md](../runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md)
