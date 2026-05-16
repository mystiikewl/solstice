---
name: horizon-triage
description: Audit and fix quality gaps in Horizon custom theme files using severity-first triage and validation loops. Includes OS3 architecture violation detection.
---

# Horizon Triage

Use this skill when auditing existing custom components and producing a prioritized fix pass.

## Use When

- A component feels inconsistent with Horizon standards.
- You need a pre-merge quality sweep.
- You are fixing accessibility, localization, or maintainability debt.
- An existing component may violate the OS3 architecture contract.

## Do First

1. Read `docs/customizations/os3-architecture-contract.md` for architectural rules.
2. Read `AGENTS.md` "OS3 Architecture Contract" section for the 5 non-negotiable rules.

## Workflow

### Phase 1 — Audit

Audit findings by severity:

**P0 — Architectural violations (must fix):**
- God snippet: one file doing 3+ visual units (over ~80 lines Liquid/HTML excluding stylesheet)
- Fat section: section with substantial rendering logic (over ~40 lines Liquid/HTML excluding schema)
- Swiss-army element: one JS class managing 3+ unrelated concerns (over ~150 lines)
- Broken behavior, invalid Liquid, failed validation

**P1 — Surface standards (should fix):**
- Domain-locked renderer: snippet accessing `.value` chains from specific metaobjects
- Missing `{% doc %}` in snippets/blocks
- Missing `{% stylesheet %}` (using `<style>` instead)
- Hardcoded design primitives (magic numbers instead of tokens)
- a11y/i18n regressions
- Missing locale keys (hardcoded English strings)

**P2 — Polish (nice to have):**
- Style consistency, readability, naming issues
- Missing `@example` in `{% doc %}` blocks
- CSS that could use logical properties for RTL

### Phase 2 — Fix Strategy

**For P0 architectural violations:**
Do NOT attempt to fix inline. Instead:
1. Flag the violation with the specific anti-pattern name and line count evidence.
2. Recommend running `horizon-architect` to produce a decomposition plan.
3. Only fix P0 violations after an architecture plan is approved.

**For P1 surface issues:**
Apply fixes directly in severity order.

**For P2 polish:**
Apply if time permits, document remaining items.

### Phase 3 — Validation

1. Confirm upstream safety before edits (`.upstream-baseline.json`, `horizon-upstream-guard` as needed).
2. Apply P1 fixes.
3. If section/block schema changed, run `npm run build:schemas`.
4. Validate with Shopify MCP `validate_theme`.
5. Run strict lint when possible: `npx shopify theme check --path . --fail-level error`.
6. Update `docs/customizations/*` and `upstream-sync-log.md` when core edits were unavoidable.

## Mandatory Outputs

- Short findings list with severity labels and anti-pattern names.
- P0 violations flagged with recommendation to run `horizon-architect`.
- Applied P1 fixes with minimal upstream risk.
- Validation evidence and documentation updates.
