---
name: horizon-evolve
description: Proactively proposes merchant-value upgrades for Horizon components. Runs after architect, before build. Reads code + docs + Shopify ecosystem, then presents ranked upgrade opportunities as an interactive menu. Saves selections as an HTML evolution plan.
---

# Horizon Evolve

Run this skill **after `horizon-architect` and before `horizon-build`** to discover upgrade opportunities that reshape what gets built. Also works standalone on any existing component.

## Use When

- An architecture plan exists and the component is about to be built or rebuilt.
- User says "improve X", "make X better", "what else could X do", or "evolve X".
- After `horizon-triage` fixes quality gaps — evolve finds the next value layer.
- User has a vague idea and wants to see what's possible before committing.
- Proactively: after any new architecture plan is saved to `docs/features/`, suggest running evolve.

## Philosophy

Users often ask for the first thing they think of. The skill's job is to show them the full landscape — business logic, merchant configurability, UX polish, marketing hooks — so they build the right thing, not just the obvious thing.

The user has limited depth. The skill has deep context. Bridge that gap.

## Trigger

**Proactive**: When an architecture plan is saved to `docs/features/[component]-architecture.md`, suggest:
> "Architecture plan ready. Want me to run `horizon-evolve` to find upgrade opportunities before we build?"

**Reactive**: When user asks to improve, upgrade, evolve, or enhance a component.

## Workflow

### Step 1 — Gather Context

Read these in parallel:

1. **Architecture plan**: `docs/features/[component]-architecture.md`
2. **Component code**: all files listed in the architecture plan
3. **Feature docs**: `docs/features/[component]*.md` and `docs/legacy-theme-migrations/migration-[component]*.md`
4. **Block schema settings**: what's already configurable by the merchant
5. **Locale keys**: what text is already externalized
6. **JS assets**: what interactive behaviors exist
7. **AGENTS.md** and `docs/customizations/os3-architecture-contract.md` for constraints

### Step 2 — Analyze Upgrade Dimensions

For each dimension, scan the codebase for opportunities:

#### Dimension 1: Merchant Configurability

Look for:

- Hardcoded values that should be schema settings (colors, text, percentages, email addresses)
- Boolean toggles that could be merchant-facing (show/hide elements, enable/disable features)
- Missing preset variations in block schema
- Opportunity for merchant-selectable layouts or modes via `select` settings
- Per-item overrides via metafields where only global settings exist

Ask: "Can a merchant customize this without editing code?"

#### Dimension 2: Business Logic Expansion

Look for:

- Fixed calculations that could be per-product (discount rates, thresholds, tiers)
- Single-mode components that could support multiple modes
- Hardcoded rules that could be tag-based, metafield-based, or collection-based
- Missing conditional display logic (show only for certain products, collections, customer tags)
- Form submission paths that could have variants (email vs modal vs drawer)
- Integration points with Shopify features (B2B, wholesale, discounts, customer accounts)

Ask: "Does the business logic match how merchants actually work?"

#### Dimension 3: Visual/UX Polish

Look for:

- Missing responsive breakpoints or suboptimal mobile layouts
- Opportunities for micro-interactions (hover states, transitions, loading states)
- Empty states that could be more helpful
- Error states that could be more forgiving
- Missing focus management and keyboard flows
- Animation opportunities that respect `prefers-reduced-motion`
- Progressive disclosure opportunities (simplify default, expand on demand)

Ask: "Does it feel good to use?"

#### Dimension 4: Conversion & Marketing Hooks

Chain relevant marketing skills to evaluate:

- **analytics-tracking**: Missing event tracking? Could conversion be measured better?
- **page-cro**: Is the CTA hierarchy optimal? Could the layout convert better?
- **copywriting**: Are headlines, CTAs, and benefit copy compelling?
- **form-cro**: For form components — field ordering, friction reduction, progressive disclosure
- **signup-flow-cro**: If the component gates content behind signup
- **onboarding-cro**: If the component appears post-signup
- **popup-cro**: If the component uses overlays or interrupt patterns
- **schema-markup**: Could structured data improve search visibility?
- **ai-seo**: Could content be optimized for AI search?

Ask: "Does this component drive the business outcome it's meant to drive?"

#### Dimension 5: Data Architecture

Look for:

- Metafield opportunities where settings are global but should be per-product
- Metaobject opportunities where structured data would replace hardcoded lists
- Custom data that could feed into other components
- Settings that should cascade (global → section → block → item)

Ask: "Is the data architecture flexible enough for real merchant use?"

### Step 3 — Research Shopify Capabilities

For the component's domain, research what Shopify supports:

1. Use `shopify-dev` or `shopify-liquid` skills to check:
   - Relevant Liquid objects and filters
   - Available schema setting types
   - Theme app extensions that could integrate
2. If the component involves forms, products, or cart — check for newer Shopify APIs
3. If the component involves custom data — check metafield and metaobject capabilities
4. If the component could benefit from apps — note integration points

### Step 4 — Rank and Present

Score each opportunity:

| Factor | Weight |
|---|---|
| Merchant value (revenue, conversion, retention impact) | 40% |
| Effort (lines of code, new files, schema changes) | 25% |
| Risk (breaks existing behavior, touches upstream, tracking contract) | 20% |
| Delight (unexpected polish that merchants notice) | 15% |

Present as an **interactive menu** grouped by dimension:

```
## Merchant Configurability
  [1] Per-product discount rate via metafield (HIGH value, LOW effort)
      Currently hardcoded at 10%. Allow merchants to set different rates per product
      via a number metafield. Fallback to global setting.
      
  [2] Configurable benefits list (MEDIUM value, LOW effort)
      Benefits are locale-keyed but fixed at 3. Allow merchants to add/edit/reorder
      via block settings or a metaobject.

## Business Logic
  [3] Volume tier pricing (HIGH value, MEDIUM effort)
      Instead of flat %, support 3 tiers: 10+ units = X%, 25+ = Y%, 100+ = Z%.
      Requires new schema settings and pricing snippet update.
      
  [4] Conditional display by customer tag (MEDIUM value, LOW effort)
      Show different panels to B2B-tagged customers vs retail.

## Visual/UX
  [5] Expand/collapse mode (MEDIUM value, LOW effort)
      Default collapsed with a trigger button. Reduces page clutter.
      Merchant can choose expanded/collapsed default.

## Conversion
  [6] A/B testable headline variants (HIGH value, LOW effort)
      Add alternate headline settings so merchants can test copy.
      Wire into analytics tracking for measurement.

## Data Architecture  
  [7] Bulk pricing metaobject (HIGH value, HIGH effort)
      Replace hardcoded formula with a metaobject defining tiers, MOQ, lead times.
      Enables merchant-managed pricing without code changes.
```

Ask the user to select items. Use the `question` tool with `multiple: true`.

### Step 5 — Generate HTML Evolution Plan

Save the selected items as a visual HTML file:

**Location**: `docs/features/[component]-evolution.html`

The HTML file should include:

1. **Header** — component name, date, status
2. **Selected upgrades** — each with:
   - Title and dimension tag
   - Current behavior vs proposed behavior
   - Implementation notes (which files change, what's new)
   - Schema additions preview
   - Effort/value badges
3. **Dependency graph** — which upgrades depend on which
4. **Implementation order** — sorted by dependency + effort
5. **Scope summary** — total new files, modified files, schema changes, locale keys

Style it with clean CSS (system fonts, good hierarchy, print-friendly). No external dependencies.

### Step 6 — Update Architecture Plan

After selections are confirmed, update `docs/features/[component]-architecture.md`:

1. Add an "Evolution Scope" section listing selected upgrades
2. Update file structure if new files are needed
3. Update data flow if new data sources or parameters are introduced
4. Flag any schema changes that will require `npm run build:schemas`

This keeps the architecture plan as the single source of truth that `horizon-build` consumes.

## Skill Chaining

This skill coordinates:

**Upstream** (inputs):
- `horizon-architect` — provides the architecture plan
- `horizon-triage` — provides quality context (what's broken)
- `docs/features/*` — existing feature documentation

**Research** (parallel):
- `shopify-dev` / `shopify-liquid` — Shopify capabilities
- `shopify-custom-data` — metafield/metaobject patterns
- Marketing skills (`page-cro`, `copywriting`, `analytics-tracking`, `form-cro`) — conversion analysis

**Downstream** (consumers):
- `horizon-build` — implements the evolution plan
- `horizon-shopify` — routes through evolve mode

## Where It Fits in the Chain

```
horizon-shopify (coordinator)
  ├─ New build:       upstream-guard → architect → EVOLVE → build → validate → docs
  ├─ Migration:       upstream-guard → migrate → architect → EVOLVE → build → parity verify → validate → docs
  ├─ Triage:          triage → (if P0 arch violations → architect → EVOLVE → build)
  ├─ Refactor:        structural → architect → EVOLVE → build | surface → direct fix
  └─ Evolve:          evolve → (update architect plan) → build
```

The EVOLVE step is optional but always offered. It never blocks — if the user says "just build it", proceed to `horizon-build` directly.

## Mandatory Reading

Before running evolve on a component, read:

1. The component's architecture plan (or generate one via `horizon-architect`)
2. `docs/customizations/os3-architecture-contract.md` — know the constraints
3. Any existing feature docs for the component
4. The block schema — understand what merchants can already configure

## Output Checklist

- [ ] All 5 dimensions analyzed
- [ ] Shopify capabilities researched for the component's domain
- [ ] Each opportunity scored (value/effort/risk/delight)
- [ ] Interactive menu presented to user
- [ ] HTML evolution plan saved to `docs/features/[component]-evolution.html`
- [ ] Architecture plan updated with evolution scope
- [ ] No changes to component code — evolve only plans, never implements
