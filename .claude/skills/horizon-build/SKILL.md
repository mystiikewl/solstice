---
name: horizon-build
description: Build or extend Horizon custom theme components with strict upstream-safe, schema-aware, tokenized standards.
---

# Horizon Build

Use this skill when creating new snippets, blocks, sections, templates wiring, or related assets.

## Use When

- Building a new custom component.
- Extending behavior via composition.
- Shipping net-new UI and interaction patterns.

## Prerequisite: Architecture Plan

**Before writing any code**, an architecture plan must exist. Check in this order:

1. **Saved plan on disk**: Look for `docs/features/[component-name]-architecture.md`. If found, read it.
2. **Migration blueprint**: If implementing a migration, check `docs/legacy-theme-migrations/` for the blueprint. If found, also look for its companion architecture plan (produced by `horizon-migrate` Step 3).
3. **No plan exists**: Run `horizon-architect` to generate one. It will save to `docs/features/[component-name]-architecture.md`.

Do NOT proceed with implementation until an architecture plan exists and all its anti-pattern checks pass.

## Workflow

1. Read the architecture plan (check `docs/features/` or produce one via `horizon-architect`).
2. Read `AGENTS.md` — specifically the "OS3 Architecture Contract" and "Mandatory .cursor/rules/ References" sections.
3. Read `docs/customizations/os3-architecture-contract.md` for decomposition rules.
4. Read `docs/customizations/custom-component-workflow.md` for surface authoring standards.
5. Read the relevant `.cursor/rules/` files for the file types being created or modified.
6. Verify upstream safety:
   - Check `.upstream-baseline.json` `custom_files`.
   - If target is not custom, run `horizon-upstream-guard` before edits.
7. Create files in this order:
   - Snippets (leaf renderers) first.
   - Orchestrator snippet next.
   - Section last (container that wires everything).
   - Assets (JS/CSS) alongside their Liquid counterpart.
8. Author every file to the OS3 architectural contract:
   - Section: under ~40 lines of Liquid/HTML (excluding schema). Container only.
   - Snippet: under ~80 lines of Liquid/HTML. Single responsibility. Generic params.
   - JS: under ~150 lines per custom element. One interactive concern per element.
   - `{% doc %}` for all snippets and static blocks.
   - `{% stylesheet %}` scoped per snippet — never one monolithic stylesheet.
   - Theme tokens — no magic numbers.
   - `@theme/component` for interactive JS.
   - Locale keys for all user-facing copy.
9. If section/block schema changed, run `npm run build:schemas`.
10. Validate changed files with Shopify MCP `validate_theme`.
11. Run strict lint when possible: `npx shopify theme check --path . --fail-level error`.
12. Update docs ledgers in `docs/customizations/*` (not `docs/customizations.md`).

## Line Count Guardrails

After implementation, verify:

- [ ] Section Liquid/HTML (excluding schema) under ~40 lines
- [ ] Every snippet under ~80 lines of Liquid/HTML (excluding stylesheet)
- [ ] Every JS custom element under ~150 lines
- [ ] No snippet accesses domain-specific `.value` chains
- [ ] Each snippet has its own `{% stylesheet %}` block

If any guardrail is exceeded, decompose further before claiming completion.

## Mandatory Outputs

- Files are upstream-safe and mergeable.
- Architecture plan was consulted (or produced) before coding.
- Validation evidence (`validate_theme`, and CLI lint when run).
- Customization registry entry in typed docs.
- All line count guardrails met.
