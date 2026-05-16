---
name: horizon-architect
description: Pre-build architecture gate that forces OS3 decomposition thinking before any component code is written. Use before horizon-build for every new component or significant refactoring.
---

# Horizon Architect

**This skill is the mandatory first step before building any custom component.** It produces an architecture plan that `horizon-build` then executes.

## Use When

- Building a new custom component (section + snippets + assets).
- Refactoring an existing component that violates the OS3 architecture contract.
- Planning a migration that involves structural changes to component boundaries.
- Any task where you are about to create or significantly modify more than one Liquid/JS file.

## Do NOT Use When

- Quick bug fixes that don't change structure.
- Locale or config-only changes.
- Cosmetic CSS tweaks that don't affect component boundaries.

## Mandatory Reading (Before Planning)

Read these files in order:

1. `docs/customizations/os3-architecture-contract.md` — the architectural rules
2. The relevant `.cursor/rules/` files for the file types involved (see AGENTS.md "Mandatory .cursor/rules/ References" table)
3. `docs/customizations/custom-component-workflow.md` — surface authoring standards
4. 2-3 existing upstream components for reference patterns:
   - `sections/section.liquid` — the universal container pattern
   - `snippets/group.liquid` — the generic container renderer pattern
   - `blocks/group.liquid` — the block-to-snippet delegation pattern

## The Architecture Planning Protocol

Run this protocol **before writing any code**. Produce the output described at the end.

### Step 1 — Identify the Visual/Interactive Units

List every distinct visual and interactive concern in the component:

| Unit | What it renders | Interactive? |
|---|---|---|
| e.g., "Phase bar" | Horizontal tab-like navigation with phase labels and counts | Yes — click to navigate |
| e.g., "Step card" | Numbered card with title, description, chips, footnote | No |
| e.g., "Scroll viewport" | Vertical scroll-snap container holding cards | Yes — scroll snap |

**Decomposition rule**: If you list 3+ units, the component MUST use an orchestrator + sub-snippets pattern. Each unit becomes its own snippet.

### Step 2 — Map the Data Source

Answer these questions:

1. **Where does the data come from?**
   - Theme editor blocks → use `{% content_for %}` in the section
   - Metafields/metaobjects → section reads data, passes to snippets
   - Both → hybrid approach

2. **What are the domain-specific field paths?**
   List them (e.g., `step.title.value`, `step.instruction.value`, `step.timing.value`).

3. **What are the generic parameter names for each?**
   Map domain fields to generic names the renderer will receive:
   ```
   step.title.value       → title
   step.instruction.value → description
   step.timing.value      → chips[0]
   step.tools.value       → chips[1]
   step.condition.value   → badge
   step.inferred.value    → footnote
   ```

**The rendering boundary rule**: Snippets never see `step.title.value`. They see `title`. The mapping happens in the section or orchestrator.

### Step 3 — Define the File Structure

Produce the complete file list with estimated line counts:

```
sections/product-feature.liquid          (~35 lines) — container + data sourcing + mapping
snippets/product-feature.liquid          (~50 lines) — orchestrator, composes sub-snippets
snippets/product-feature-nav.liquid      (~40 lines + CSS) — navigation unit
snippets/product-feature-content.liquid  (~30 lines + CSS) — content area unit
snippets/product-feature-card.liquid     (~40 lines + CSS) — generic card renderer
snippets/product-feature-sidebar.liquid  (~30 lines + CSS) — optional sidebar unit
assets/component-snap-viewport.js        (~80 lines) — reusable scroll snap behavior
assets/component-feature-viewer.js       (~100 lines) — orchestrator wiring
```

**Validation checks**:
- Section under ~40 lines (excluding schema)? If not, move rendering to snippets.
- Every snippet under ~80 lines (excluding stylesheet)? If not, decompose further.
- Every JS file under ~150 lines? If not, split into focused elements.
- Any snippet domain-locked? Rename and genericize params.

### Step 4 — Define the Data Flow

Show the data flow from source to renderer:

```
Metafield: product.metafields.custom.feature_steps
  │
  ▼
Section: sections/product-feature.liquid
  ├─ reads metafield
  ├─ maps domain fields → generic params
  └─ {% render 'product-feature', steps: mapped_steps, settings: section.settings %}
      │
      ▼
  Orchestrator: snippets/product-feature.liquid
    ├─ {% render 'product-feature-nav', phases: phases %}
    ├─ {% render 'product-feature-content', steps: steps %}
    │   └─ {% render 'product-feature-card', title: step.title, description: step.desc, ... %}
    ├─ {% render 'product-feature-sidebar', steps: steps %}
    └─ {% render 'product-feature-jump-sheet', steps: steps %}
```

### Step 5 — Check Against Anti-Patterns

For each planned file, verify it does NOT match any anti-pattern from `docs/customizations/os3-architecture-contract.md`:

- [ ] God snippet: one file doing 3+ visual units
- [ ] Domain-locked renderer: snippet accessing `.value` chains
- [ ] Fat section: section with substantial rendering logic
- [ ] Swiss-army element: one JS class managing 3+ unrelated concerns

If ANY check fails, redesign before proceeding to `horizon-build`.

### Step 6 — Check Existing Code for Reuse

Before creating new files, check if any existing snippet or custom element can be reused:

1. Search `snippets/` for generic renderers that match planned units.
2. Search `assets/` for custom elements that match planned interactive behaviors.
3. Check upstream Horizon patterns — does the component follow the same structure as an existing upstream component?

If a reusable piece exists, plan to extend it rather than create a new one.

## Architecture Plan Output

The output of this skill is a structured architecture plan. **Save it to disk** so other skills can find it:

**Save location**: `docs/features/[component-name]-architecture.md`

Example: `docs/features/bulk-discount-architecture.md`, `docs/features/step-viewer-architecture.md`

### Plan Structure

```markdown
# Architecture Plan: [Component Name]

## Visual/Interactive Units
[table from Step 1]

## Data Source
[data source analysis from Step 2]

## File Structure
[file list from Step 3 with line estimates]

## Data Flow
[diagram from Step 4]

## Anti-Pattern Check
[checklist from Step 5 — all must pass]

## Reuse Opportunities
[findings from Step 6]
```

This plan is the input to `horizon-build`. Do NOT write code until this plan is saved and all anti-pattern checks pass.

## Skill Routing

After producing the architecture plan:

1. If the plan passes all checks → proceed to `horizon-build` to implement.
2. If the plan fails anti-pattern checks → redesign and re-run this skill.
3. If the component involves an upstream file → run `horizon-upstream-guard` before `horizon-build`.
4. If the component is a migration from legacy → hand off to `horizon-migrate` with the architecture plan attached.

## Common Decomposition Patterns

### Pattern: Data-Driven List with Navigation

A component that reads metafield data and renders a navigable list.

```
Section (container)
  └─ reads metafield, maps fields
  └─ {% render 'list-viewer', items: items, settings: settings %}
      └─ {% render 'list-viewer-nav', groups: groups %}
      └─ {% render 'list-viewer-viewport', items: items %}
          └─ {% render 'list-viewer-card', title: item.title, ... %}  (per item)
      └─ {% render 'list-viewer-footer', items: items %}
```

### Pattern: Static Layout with Dynamic Data

A component with fixed structure but data-driven content areas.

```
Section (container)
  └─ reads metafield
  └─ {% render 'feature-layout', media: media, content: content %}
      └─ {% render 'feature-media', image: media.image, video: media.video %}
      └─ {% render 'feature-content', title: content.title, body: content.body %}
```

### Pattern: Merchant-Configurable Blocks with Metafield Enrichment

A component where merchants add blocks but data from metafields enriches the output.

```
Section (container)
  ├─ reads metafield for enrichment data
  └─ {% content_for 'blocks' %}
      └─ blocks/*.liquid → {% render 'snippet', settings: block.settings, enrichment: enrichment %}
```
