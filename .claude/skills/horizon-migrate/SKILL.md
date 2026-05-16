---
name: horizon-migrate
description: Execute legacy-theme migration blueprints from docs/legacy-theme-migrations/ into Horizon-built components. Detects whether the target already exists and routes to build or rebuild accordingly.
---

# Horizon Migrate

Use this skill when a migration blueprint in `docs/legacy-theme-migrations/` needs to be implemented — either as a fresh build or a rebuild of an existing component.

## Use When

- Implementing a migration doc from `docs/legacy-theme-migrations/`.
- Rebuilding an existing component that was previously migrated but needs Horizon compliance.
- Converting a legacy OS2 monolith into atomic OS3 blocks per a blueprint.

## Do First

1. Read the target migration doc in `docs/legacy-theme-migrations/`.
2. Read `docs/legacy-theme-migrations/horizon-migration-guide.md` for the canonical migration framework.
3. Read `docs/customizations/os3-architecture-contract.md` for the architectural rules.
4. Read `docs/customizations/custom-component-workflow.md` for authoring standards.
5. Read `AGENTS.md` for repo constraints.
6. Read relevant `.cursor/rules/` files for the component types involved.

## Workflow

### Step 1 — Parse the Blueprint

Every migration doc follows a predictable structure. Extract these sections:

| Section | What to Extract |
|---|---|
| Audit / RED Phase | Data sources (metafield keys, metaobject types), current UI behavior, edge cases |
| Atomic Mapping | Target file names (sections, blocks, snippets), block composition hierarchy, schema settings |
| Implementation Pattern | Liquid structure, JS component contract, CSS scoping approach |
| GraphQL Reference | Data query shapes — use to verify metafield/key paths |
| Parity Verification Matrix | Scenarios that must match OS2 behavior |
| Release Gates | Checklist items that must pass before merge |

If any section is missing or incomplete, note it and fill gaps from the source legacy code in the Current-Theme repo (paths referenced in `docs/integrations/current-theme-reference.md`).

### Step 2 — Existence Check

For each file named in the blueprint's atomic mapping:

1. Check if the file exists in the codebase (`sections/`, `blocks/`, `snippets/`, `assets/`).
2. Check `.upstream-baseline.json` `custom_files` to confirm custom status.
3. Check `docs/customizations/` ledgers for prior registration.

**Routing decision:**

| State | Route To | Action |
|---|---|---|
| File does not exist | `horizon-build` | Build from scratch per blueprint |
| File exists, not in ledgers | `horizon-build` | Build and register; treat as unowned |
| File exists, in ledgers, needs Horizon compliance | `horizon-triage` | Audit and fix against standards |
| File exists, in ledgers, needs architectural change | `horizon-build` | Rebuild preserving behavior |
| File is upstream-tracked | `horizon-upstream-guard` first | Safe-customize before any edit |

### Step 3 — Architecture Validation

**Run `horizon-architect` on the migration blueprint's target architecture.**

Migration blueprints were written before the OS3 architecture contract existed. Their proposed file structures may not meet decomposition rules (80-line snippet limit, generic params, single-responsibility).

1. Run the `horizon-architect` 6-step protocol on the component.
2. Compare the architect's output against the blueprint's "Target OS3 Architecture" section.
3. If the blueprint's architecture fails anti-pattern checks (god snippet, domain-locked renderer, fat section), redesign per the architect's plan.
4. Save the architecture plan to `docs/features/[component-name]-architecture.md`.
5. This plan becomes the input to `horizon-build` — the blueprint provides business context, the architect plan provides the file structure.

### Step 4 — Pre-Build Preparation

Before writing any code:

1. **Verify data contracts.** Confirm the metafield namespace/key and metaobject field keys referenced in the blueprint still exist. Cross-reference with the GraphQL reference section and the Current-Theme source if needed.
2. **Map locale keys.** Identify every user-facing string the component will render. Plan the locale namespace and key hierarchy (max 3 levels, snake_case). Write keys to `locales/en.default.json` before building.
3. **Plan the block tree.** Document which blocks nest inside which sections. Identify `{% content_for 'blocks' %}` insertion points.
4. **Identify JS components.** For interactive features, plan the `@theme/component` class name, `observedAttributes`, `refs`, and custom events.

### Step 5 — Build or Rebuild

Execute via `horizon-build` workflow:

1. Verify upstream safety (`horizon-upstream-guard`).
2. Create files in this order:
   - Snippets (leaf rendering units) first.
   - Blocks next (compose snippets or render directly).
   - Sections last (orchestrate blocks).
   - Assets (JS/CSS) alongside their Liquid counterpart.
3. Author to Horizon standards:
   - `{% doc %}` with accurate `@param` annotations.
   - `{% stylesheet %}` for scoped CSS with theme tokens.
   - `{% javascript %}` or `@theme/component` for interactive JS.
   - Logical CSS properties for RTL.
   - `transform`/`opacity` only for animations.
   - Locale keys for all user-facing copy.
4. If section/block schema changed, run `npm run build:schemas`.

For rebuilds via `horizon-triage`:

1. Audit existing implementation against the blueprint's parity matrix.
2. Identify P0/P1/P2 gaps.
3. Fix in severity order.
4. If section/block schema changed, run `npm run build:schemas`.

### Step 6 — Parity Verification

Complete the parity matrix from the migration doc:

| Column | Meaning |
|---|---|
| OS2 Result | Expected behavior from legacy theme |
| OS3 Result | Actual behavior after build/rebuild |
| Classification | `MATCH`, `BETTER`, `DELTA`, or `FAIL` |
| Action | Empty for MATCH/BETTER; sign-off note for DELTA; fix plan for FAIL |

Rules:
- No unresolved `FAIL` classifications.
- All `DELTA` rows require explicit acknowledgment.
- `BETTER` rows require a brief rationale.

### Step 7 — Validation

1. Initialize Shopify docs context with `learn_shopify_api` (Liquid).
2. Validate all changed files with Shopify MCP `validate_theme`.
3. Resolve all validation errors.
4. Run `npx shopify theme check --path . --fail-level error` when possible.
5. Do not claim completion until validation passes clean.

### Step 8 — Documentation

Update these docs in order:

1. **Customization ledgers** — Add entries to the correct typed file:
   - `docs/customizations/snippets.md`
   - `docs/customizations/sections.md`
   - `docs/customizations/blocks.md`
   - `docs/customizations/assets.md`
   - `docs/customizations/templates.md`
   - `docs/customizations/config-locales.md`
2. **Parity matrix** — Update the migration doc's parity verification section with actual results.
3. **Upstream sync log** — If any core file was edited, log in `docs/customizations/upstream-sync-log.md`.
4. **Integration reference** — Update `docs/integrations/current-theme-reference.md` with Horizon usage notes for the new component.

## Migration Doc Inventory

These are the known migration blueprints. When asked to "migrate X" or "implement the migration for X", match against this list:

| Migration Doc | Feature | Key Files |
|---|---|---|
| `migration-use-case-cards.md` | Use Case Cards -> Atomic Blocks | `sections/product-use-cases.liquid`, `blocks/use-case-card.liquid` |
| `migration-product-documents.md` | Product Documents -> Compliance FAB | `sections/compliance-fab.liquid`, `blocks/doc-link.liquid`, `blocks/hazard-alert.liquid` |
| `migration-visualiser-calculator.md` | Visualiser + Calculator -> Design Engine | `blocks/sealant-calculator.liquid`, `snippets/sealant-calculator.liquid`, `assets/component-sealant-calculator.js` |
| `migration-bulk-discount-panels.md` | Bulk Discount Trade Panels -> Unified Block | `snippets/bulk-discount-panel.liquid`, `blocks/bulk-discount.liquid` |

When a new migration doc is added to `docs/legacy-theme-migrations/`, update this inventory table.

## Skill Chaining

This skill coordinates these sub-skills:

1. `horizon-upstream-guard` — Always first. Verify custom file status before any edit.
2. **`horizon-architect`** — Mandatory before building. Validates the blueprint's architecture against OS3 contract.
3. `horizon-build` — For net-new files or full rebuilds (consumes architect plan).
4. `horizon-triage` — For auditing and fixing existing implementations.
5. `frontend-design` or `impeccable` — Only after Horizon compliance is in place, for visual polish.

## Deliverables

- Fully implemented component files matching the migration blueprint.
- Completed parity verification matrix in the migration doc.
- Locale keys added to `locales/en.default.json`.
- Customization ledger entries in `docs/customizations/*`.
- Validation evidence from Shopify MCP `validate_theme` and Theme Check.
- Updated `docs/integrations/current-theme-reference.md` with new component paths.
