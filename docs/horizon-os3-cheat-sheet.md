# Horizon OS3 Cheat Sheet

## The Golden Rule

One file, one job. Sections are containers, blocks are configurable components, snippets are generic renderers, and custom elements have one interactive concern.

## Horizon Archived Mode (Must Follow)

- Horizon upstream is archived and read-only.
- Treat this repo as the maintained source of truth.
- Use composition-first customization (new files in `sections/`, `blocks/`, `snippets/`, `assets/`).
- Direct edits to Horizon core files are last resort and must be logged in `docs/customizations/upstream-sync-log.md`.

## Do and Don't

### Do

1. Do create new custom files instead of replacing core files whenever possible.
2. Do keep core overrides minimal and document anchors + rollback steps.
3. Do run validation gates before merge:
   - `shopify theme check --path .`
   - `npx shopify theme check --path . --fail-level error`
   - `npm run build:schemas` (if available in current tooling)
4. Do smoke-test key journeys in `shopify theme dev` (product, collection, cart, search, header/mobile nav).
5. Do tag meaningful release baselines when making structural changes.

### Don't

1. Don't assume future fixes/features will arrive from `Shopify/horizon`.
2. Don't make broad core-file rewrites when composition can solve the same need.
3. Don't merge changes without Theme Check and a quick storefront smoke pass.
4. Don't let core overrides exist without an entry in the Core Override Ledger.
5. Don't couple snippets directly to domain-specific metafield paths when generic params can be passed at the section boundary.

## File Size Limits

| File type | Max lines | Notes |
|---|---|---|
| Section (Liquid/HTML) | ~40 | Excluding schema. Wrapper + data sourcing + delegation only |
| Snippet (Liquid/HTML) | ~80 | Excluding `{% stylesheet %}`. If exceeded, decompose into orchestrator + sub-snippets |
| Block (Liquid/HTML) | ~30 | Thin pass-through: `{% render %}` + schema |
| Custom element (JS) | ~150 | One interactive concern |

## Architecture Decision Tree

```text
1. Where does the data come from?
   |- Theme editor -> {% content_for 'blocks' %}
   |- Metafields -> section reads, maps to generic params, delegates to snippets
   `- Hybrid -> both paths, snippets are shared renderers

2. Is the visual unit reusable?
   |- Yes -> Generic snippet with generic params (title, description, image, chips)
   `- No -> Named snippet, still single-responsibility

3. Is it >80 lines?
   |- Yes -> Extract sub-snippets, each with own {% stylesheet %}
   `- No -> Single snippet is fine

4. Is there interactive behavior?
   |- Yes, one concern -> One custom element
   |- Yes, multiple -> Multiple focused elements
   `- No -> No JS needed
```

## Naming

| Purpose | Convention | Example |
|---|---|---|
| Section | `kebab-case.liquid` | `product-bulk-panel.liquid` |
| Block | `kebab-case.liquid` | `bulk-discount.liquid` |
| Snippet | `kebab-case.liquid` | `card.liquid` |
| Static block | `_kebab-case.liquid` | `_product-card.liquid` |
| Custom element | `kebab-case` | `<floating-action-button>` |
| JS file | `component-kebab-case.js` | `component-floating-action-button.js` |

Name files by what they render, not what uses them.
- Good: `card.liquid`, `dialog.liquid`, `pricing-comparison.liquid`
- Avoid: `use-case-card.liquid`, `bulk-discount-dialog.liquid`

## Generic Params Pattern

```liquid
{% doc %}
  @param title {String} Card heading (required)
  @param description {String} Body text
  @param badge {String} Optional label
  @param chips {Array} Array of {label, icon} hashes
{% enddoc %}
```

The mapping from metaobject/metafield fields to generic params happens in the section, not the snippet:

```liquid
{% comment %} Correct: section maps, snippet renders {% endcomment %}
{% render 'card',
  title: step.title.value,
  description: step.instruction.value,
  badge: step.condition.value
%}
```

## CSS Standards

```css
/* Use theme tokens, never hardcoded values */
.component {
  --component-gap: var(--gap-sm);
  --component-radius: var(--style-border-radius-popover);
  background: rgb(var(--color-foreground-rgb) / var(--opacity-05));
  padding: var(--padding-sm);
  font-size: var(--font-paragraph-medium--size);
}

/* BEM naming */
.component__element { }
.component--modifier { }
.component__element--modifier { }

/* Logical properties */
padding-inline: 2rem;
padding-block: 1rem;
text-align: start;

/* Mobile first */
@media screen and (min-width: 750px) { }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) { }

/* No IDs as selectors. No !important. Low specificity (0 1 0). */
```

## Schema Checklist

- Only settings merchants actually need to change
- Translation keys (`t:names.*`, `t:settings.*`) for all labels
- `t:content.padding` header for spacing if needed
- No dead settings: start minimal, add only when requested

## Before Building

1. Check current repo patterns for existing solutions first.
2. Use composition-first design (section/block/snippet split) before coding.
3. Run upstream guard checks if touching a core Horizon file.
4. Run Theme Check before commit.

## Quick Commands

| Command | When |
|---|---|
| `shopify theme dev` | Local preview |
| `shopify theme check --path .` | Standard lint |
| `npx shopify theme check --path . --fail-level error` | Strict lint gate |
| `git fetch upstream` | Historical reference sync only |
| `git log --oneline --decorate upstream/main -n 20` | Inspect archived upstream history |
