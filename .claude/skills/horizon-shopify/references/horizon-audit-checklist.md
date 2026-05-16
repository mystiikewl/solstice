# Horizon Audit Checklist

Use this checklist for component triage and polish passes.

## Liquid and Structure

- Snippet includes `{% doc %}` with correct params.
- Liquid syntax is valid and uses supported tags/filters only.
- No schema edits are made directly in generated `.liquid` schema blocks.
- Naming follows kebab-case and existing repo conventions.

## Localization

- All user-visible strings use translation keys.
- New keys are added in `locales/en.default.json` with hierarchical snake_case structure.
- Interpolated copy uses `| t: param: value` rather than string concatenation.

## CSS

- Styles are in `{% stylesheet %}` for snippets/sections/blocks.
- No hardcoded color hex/rgba when tokenized alternatives exist.
- No hardcoded font families when theme font tokens should apply.
- Logical properties are used where directional styles matter.
- No `!important` unless fully justified.
- Animations use transform/opacity, not width/height/margin/padding/top/left.

## JavaScript

- Interactive components follow `@theme/component` patterns.
- Cleanup is handled in `disconnectedCallback` when needed.
- Early returns are used to simplify branching.
- JSDoc typedefs are present for complex refs and payloads.

## Accessibility

- Interactive controls are keyboard-accessible.
- Icon-only buttons include `aria-label`.
- ARIA state attributes (`aria-expanded`, `aria-controls`, etc.) are accurate.
- Reduced motion preferences are respected where motion is used.

## Upstream Mergeability

- Prefer composition/new files over core file replacement.
- Core-file edits are minimal and documented when unavoidable.
- Customization docs are updated in `docs/customizations/`.

## Validation

- Shopify MCP `validate_theme` passes for changed files.
- Optional strict CLI lint passes: `npx shopify theme check --path . --fail-level error`.
