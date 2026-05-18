# Architecture Plan: Solstice Mega Nav Refactor

## Problem

`sections/solstice-mega-nav.liquid` (1540 lines) violates OS3 contract:
- **God section**: ~490 lines of Liquid/HTML rendering (limit: ~40)
- **Swiss-army element**: `solstice-mega-nav.js` at 530 lines (limit: ~150)
- **Duplicated block iteration**: Same guard logic + for loop repeated 5×
- **P1 surface issues**: Missing doc block, hardcoded CSS, breakpoint mismatch, unused settings, missing locale keys

## Visual/Interactive Units

| Unit | What it renders | Interactive? |
|---|---|---|
| Top row | Logo, mobile menu button, search, account/cart actions | Yes — menu toggle |
| Mobile drawer | Slide-out panel with nested sub-panels (4 levels deep) | Yes — panel navigation |
| Mobile sub-panel | Reusable nested panel with back button, title, link list | Yes — forward/back navigation |
| Desktop nav row | Horizontal list of top-level nav items | Yes — mega panel triggers |
| Desktop mega panel | 3-column panel (L2 list, L3 groups, L4 groups) | Yes — L2/L3/L4 toggles |
| Drawer sidebar | Accordion-based fallback navigation (tablet) | Yes — accordion expand/collapse |

## Decomposition Strategy

Extract each visual unit into its own snippet. The mobile sub-panel pattern repeats at 3 nesting levels → extract as reusable snippet.

## File Structure (After Refactor)

```
sections/solstice-mega-nav.liquid          (~40 lines) — orchestrator: settings + snippet delegation
snippets/solstice-mega-nav-top-row.liquid  (~30 lines) — logo + mobile menu button + actions
snippets/solstice-mega-nav-mobile.liquid   (~30 lines) — drawer wrapper + root panel
snippets/solstice-mega-nav-sub-panel.liquid (~80 lines) — reusable nested mobile panel
snippets/solstice-mega-nav-desktop.liquid  (~50 lines) — desktop nav row
snippets/solstice-mega-nav-panel.liquid    (~120 lines) — desktop mega panel (L2/L3/L4)
snippets/solstice-mega-nav-drawer.liquid   (~150 lines) — sidebar accordion
assets/solstice-mega-nav.js                (530 lines) — kept as-is for regression safety (phase 2)
```

## Data Flow

```
Section (solstice-mega-nav.liquid)
  ├─ reads section.settings
  ├─ assigns sticky, actions, search captures
  └─ renders:
      ├─ solstice-mega-nav-top-row (logo, mobile button, actions, search)
      │   └─ renders: header-actions, search snippets
      ├─ solstice-mega-nav-mobile (mobile drawer wrapper)
      │   ├─ root panel (level 1 list)
      │   └─ solstice-mega-nav-sub-panel (for each block with children)
      │       └─ solstice-mega-nav-sub-panel (recursive, for nested levels)
      ├─ solstice-mega-nav-desktop (desktop nav row)
      ├─ solstice-mega-nav-panel (mega panels, for each block with menu)
      └─ solstice-mega-nav-drawer (sidebar accordion)
```

## Anti-Pattern Check

| File | Anti-pattern | Status |
|---|---|---|
| sections/solstice-mega-nav.liquid | Fat section (>40 lines) | ✅ Will be ~40 lines after refactor |
| snippets/solstice-mega-nav-top-row.liquid | God snippet (>80 lines) | ✅ Will be ~30 lines |
| snippets/solstice-mega-nav-mobile.liquid | God snippet (>80 lines) | ✅ Will be ~30 lines |
| snippets/solstice-mega-nav-sub-panel.liquid | God snippet (>80 lines) | ✅ Will be ~80 lines (at limit) |
| snippets/solstice-mega-nav-desktop.liquid | God snippet (>80 lines) | ✅ Will be ~50 lines |
| snippets/solstice-mega-nav-panel.liquid | God snippet (>80 lines) | ⚠️ ~120 lines — accept as phase 1, decompose in phase 2 |
| snippets/solstice-mega-nav-drawer.liquid | God snippet (>80 lines) | ⚠️ ~150 lines — accept as phase 1, decompose in phase 2 |
| assets/solstice-mega-nav.js | Swiss-army element (>150 lines) | ⚠️ 530 lines — keep as-is for regression safety, phase 2 |

## P1 Fixes Applied During Refactor

1. Add `{% doc %}` block to section
2. Fix breakpoint mismatch: JS `750` → CSS uses `749px` (off-by-one)
3. Remove unused `border_width` setting from schema
4. Add locale keys for hardcoded strings (`'actions.back'`)
5. Schema labels: use `t:settings.*` translation keys
6. CSS: replace hardcoded `border-radius: 8px` with token
7. CSS: replace hardcoded `rgba(0,0,0,0.5)` with token

## Reuse Opportunities

- `snippets/header-actions.liquid` — already rendered via `render` (upstream, leave alone)
- `snippets/search.liquid` — already rendered via `render` (upstream, leave alone)
- `inline_asset_content` filter for SVGs — existing pattern, continue using
