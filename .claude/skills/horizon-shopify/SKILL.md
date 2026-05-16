---
name: horizon-shopify
description: This skill should be used when building, triaging, polishing, or refactoring Shopify Horizon theme components in this repository, especially when work must follow Horizon conventions, .cursor rules, and Shopify MCP validation workflows.
---

# Horizon Shopify

Standardize custom component work in this Horizon-based Shopify theme.
Use this as the coordinator skill, then route into focused sub-skills.

## Use When

- Build new custom snippets, blocks, sections, or component JS.
- Migrate legacy components into Horizon conventions.
- Triage quality gaps in custom components.
- Refactor existing components for parity with Horizon patterns.
- Run pre-merge polish and validation passes on custom theme work.

## Preferred Skill Split

- `horizon-architect`: **mandatory first step** — produces OS3 architecture plan before any code.
- `horizon-build`: implements the architecture plan into production code.
- `horizon-migrate`: implement or rebuild from `docs/legacy-theme-migrations/` blueprints.
- `horizon-triage`: audit + prioritized fixes for existing files.
- `horizon-upstream-guard`: upstream safety checks and override logging.
- `horizon-evolve`: proactively proposes merchant-value upgrades. Runs after architect, before build.

## Quick Reference

Keep `docs/horizon-os3-cheat-sheet.md` open while working. Covers:
- File size limits (sections ~40, snippets ~80, JS ~150)
- Architecture decision tree
- Generic params pattern
- CSS token system and BEM conventions
- Schema checklist
- Naming conventions

## Quick Routing Table

**When in doubt, start with `horizon-upstream-guard`.**

- Building new snippet/section/block/asset: **`horizon-architect` first**, then **`horizon-evolve`** to scope upgrades, then `horizon-build`.
- Refactoring an existing component's structure: **`horizon-architect` first**, then **`horizon-evolve`** to find improvement opportunities, then `horizon-build` or `horizon-triage`.
- Refactoring or quality sweep without structural changes: use `horizon-triage` directly.
- Implementing a migration blueprint from `docs/legacy-theme-migrations/`: use `horizon-migrate`.
- Any task that might touch upstream-tracked files: start with `horizon-upstream-guard`.
- Multi-step customization: `horizon-upstream-guard` -> **`horizon-architect`** -> **`horizon-evolve`** -> `horizon-build` -> final validation/docs pass.
- Legacy migration: `horizon-migrate` orchestrates the full sequence (includes architect step internally).
- Evolving an existing component: `horizon-evolve` standalone -> update architecture plan -> `horizon-build`.
- User says "improve/upgrade/evolve X": route to `horizon-evolve` directly.

If a task spans multiple modes, sequence them in this order:
1. `horizon-upstream-guard`
2. **`horizon-architect`** (for any new build or structural refactoring)
3. `horizon-migrate` (for migrations) or `horizon-build` / `horizon-triage` (for direct work)
4. Final `validate_theme` + docs update pass.

## Do First

1. Read `docs/customizations/custom-component-workflow.md`.
2. Read `AGENTS.md` for repo-specific constraints.
3. Read relevant rule files in `.cursor/rules/`:
   - `snippets.mdc`, `liquid.mdc`, `css-standards.mdc`, `javascript-standards.mdc`, `html-standards.mdc`, `locales.mdc`, `upstream-guard.mdc`.
4. Verify upstream safety before edits:
   - Check `.upstream-baseline.json` `custom_files`.
   - If target is not custom, run `/safe-customize` workflow first.
5. Identify whether the task is `build`, `triage`, `refactor`, `evolve`, or `polish`.

## Operating Modes

### Mode: Build

1. **Run `horizon-architect` first** — produce an architecture plan before any code.
2. **Offer `horizon-evolve`** — after architect plan exists, suggest running evolve to find upgrade opportunities before building. Respect user's choice if they skip.
3. Implement the plan via `horizon-build` workflow:
   - Create or update files using Horizon naming and structure.
   - Follow the file structure and data flow from the architecture plan.
   - Verify line count guardrails: sections ~40, snippets ~80, JS ~150.
   - Ensure generic params — no domain `.value` chains in snippets.
3. Add LiquidDoc (`{% doc %}`) with accurate params.
4. Implement styles with `{% stylesheet %}` per snippet and theme tokens.
5. Implement JS with `@theme/component` patterns for interactive components.
6. Route all user-facing text through locale keys.
7. If section/block schema changed, run `npm run build:schemas`.
8. Validate with Shopify MCP `validate_theme`.

### Mode: Triage

1. Audit target files against `references/horizon-audit-checklist.md`.
2. Categorize findings by severity:
   - `P0`: broken behavior, invalid Liquid, failed validation.
   - `P1`: accessibility/localization regressions, hardcoded design primitives.
   - `P2`: style consistency, readability, maintainability issues.
3. Produce a concise fix plan ordered P0 to P2.
4. Apply fixes.
5. If section/block schema changed, run `npm run build:schemas`.
6. Re-validate with Shopify MCP.

### Mode: Refactor

1. **Determine scope of refactoring:**
   - Structural (decomposing a god snippet, splitting a monolithic element, changing file boundaries) → **Run `horizon-architect` first.** Do not refactor structure without an architecture plan.
   - Surface-only (tokens, locale keys, CSS properties, naming) → Proceed directly.
2. For structural refactoring, implement the architecture plan via `horizon-build`.
3. For surface refactoring, preserve behavior first, then improve:
   - Convert hardcoded strings to locale keys.
   - Replace hardcoded colors/fonts/sizing with Horizon tokens.
   - Convert layout-property animations to transform/opacity.
   - Normalize indentation, naming, and component boundaries.
4. If section/block schema changed, run `npm run build:schemas`.
5. Re-run full validation and confirm no functional regressions.

### Mode: Evolve

1. Run `horizon-evolve` on the target component.
2. Review the HTML evolution plan with the user.
3. Update the architecture plan with selected upgrades.
4. Route to `horizon-build` to implement.

### Mode: Polish

1. Run the full checklist in `references/horizon-audit-checklist.md`.
2. Ensure docs and customization logs are updated in `docs/customizations/*` (not `docs/customizations.md`).
3. Validate changed files with Shopify MCP `validate_theme`.

## Mandatory Standards

- **OS3 Architecture Contract**: Read `docs/customizations/os3-architecture-contract.md` before any new component. Sections are containers, snippets are single-responsibility renderers, custom elements have one concern each.
- **Architecture-first**: Run `horizon-architect` before `horizon-build` for any new build or structural refactoring.
- **Line count guardrails**: Sections ~40 lines, snippets ~80 lines, JS elements ~150 lines. Exceeding these triggers decomposition.
- Use `{% doc %}` in snippets and static blocks.
- Use `{% stylesheet %}` and `{% javascript %}` over raw tags where applicable.
- Use translation keys for all user-facing copy.
- Prefer logical CSS properties for RTL support.
- Avoid hardcoded visual values when a Horizon token exists.
- Avoid destructive upstream edits; prefer composition and custom files.
- If core Horizon file edits are unavoidable, log in `docs/customizations/upstream-sync-log.md` before merge.

## Scope by File Type

- Snippets: `{% doc %}`, `{% stylesheet %}`, localization keys, component-scoped behavior.
- Sections/Blocks: all of the above plus schema-authoring discipline and schema build pipeline.
- Assets (JS/CSS): `@theme/component` patterns, tokenized styles, accessibility and motion standards.
- Templates/Config/Locales: wiring and content updates only; preserve upstream mergeability.

## Validation Protocol

1. Initialize Shopify docs context with `learn_shopify_api` (Liquid or relevant API).
2. If section/block schema changed, run `npm run build:schemas` first.
3. Validate changed theme files using Shopify MCP `validate_theme`.
4. Resolve all validation errors before claiming completion.
5. Run strict CLI lint for parity when possible:
   - `npx shopify theme check --path . --fail-level error`

## Documentation Protocol

- Track customizations in typed ledgers only:
  - `docs/customizations/snippets.md`
  - `docs/customizations/sections.md`
  - `docs/customizations/blocks.md`
  - `docs/customizations/assets.md`
  - `docs/customizations/templates.md`
  - `docs/customizations/config-locales.md`
- Treat `docs/customizations.md` as index/redirect only.
- Update living guidance docs in `.cursor/prompts/` or `.cursor/references/` when new patterns or pitfalls are discovered.

## Skill Chaining

Use chained skills only when needed:

- `frontend-design`: Use for intentional visual direction and stronger component aesthetics.
- `impeccable`: Use for deep UI/UX polish, hierarchy, accessibility polish, and visual QA.
- `shopify-dev-mcp` tools: Use for authoritative validation and API-grounded implementation checks.

Apply chaining after core Horizon compliance is in place, not before.

## Deliverables

- Updated component files aligned with Horizon standards.
- Updated locale keys in `locales/en.default.json` when copy changes.
- Updated docs in `docs/customizations/` when behavior or architecture changes.
- Validation evidence from Shopify MCP `validate_theme`.

## Keep This Skill Tight

- Do not duplicate detailed checklists from focused skills.
- Keep this file as routing + shared standards only.
