# Solstice Theme Context

## Domain

Solstice is a Shopify Horizon theme fork for **Adheseal** — an adhesives and sealants brand.

## Domain Terms

| Term | Meaning |
|------|---------|
| **Solstice** | Custom Horizon theme fork for Adheseal |
| **Mega Nav** | Three-level navigation system: L1 header items, L2 group headings, L3 links |
| **L1 / L2 / L3** | Navigation depth levels — L1 (top nav), L2 (group heading), L3 (child link) |
| **Mega panel** | Desktop dropdown opened by an L1 trigger (deferred to later tickets) |
| **Drawer** | Mobile navigation surface opened by the hamburger button |
| **Trigger** | L1 item with children — opens a panel or accordion |
| **Direct link** | L1 item that navigates without opening a panel |
| **solstice-mega-nav** | Custom section replacing the upstream Horizon header |

## Key Decisions

- **Breakpoint**: 750px (Horizon standard) switches desktop nav to mobile drawer
- **Desktop activation**: Click to open (no hover)
- **Mobile pattern**: Left-side drawer with overlay, accordion navigation
- **Section naming**: `solstice-` prefix per convention in CLAUDE.md
- **Panel layout**: Single-column progressive disclosure — 320px L2 column with 260px L3 column cascading right via flex (not absolute positioning, no horizontal scroll). L3 column has tinted background for visual separation.
- **Block-based L1 config**: `menu_item` blocks with label, URL, optional child menu (replaces single `link_list` picker)
- **Panel styling**: `border-radius: 0 0 8px 8px`, `border-top` spanning full width, nav links have horizontal padding + `border-radius: 4px` for comfortable hover targets
