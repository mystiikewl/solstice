# Solstice Theme Context

## Domain

Solstice is a Shopify Horizon theme fork for **Adheseal** — a 30-year family-owned adhesives and sealants distributor based in SEQ, expanding nationally. See `BUSINESS_PROFILE.md` for full business context.

## Strategic pillars

1. **Find fast, buy fast** — speed of transaction is the competitive advantage
2. **Never let them forget something** — surface related products as useful instruction
3. **Make reordering trivial** — repeat purchase is where the money lives

Decision filter: does this help tradespeople find fast, buy complete, or come back?

## Brand voice

**Malcolm** — 40-year trade veteran. Locked. See `docs/design/brand_voice.md`.

## Domain Terms

| Term | Meaning |
|------|---------|
| **Solstice** | Custom Horizon theme fork for Adheseal |
| **Malcolm** | Brand voice persona — authoritative, no bullshit, warmth through competence |
| **Trust architecture** | Trust signals placed at specific decision moments across every surface |
| **Mega Nav** | Three-level navigation system: L1 header items, L2 group headings, L3 links |
| **L1 / L2 / L3** | Navigation depth levels — L1 (top nav), L2 (group heading), L3 (child link) |
| **Mega panel** | Desktop dropdown opened by an L1 trigger |
| **Drawer** | Mobile navigation surface opened by the hamburger button |
| **Trigger** | L1 item with children — opens a panel or accordion |
| **Direct link** | L1 item that navigates without opening a panel |
| **solstice-mega-nav** | Custom section replacing the upstream Horizon header |
| **solstice-trust-badges** | 2×2 grid trust strip with inline SVG icons (replaces upstream group+text) |
| **solstice-buy-mode-toggle** | Single vs Box buy mode toggle with savings badge, syncs with variant-picker |
| **solstice-vendor-badge** | Vendor logo + name block for product pages |
| **solstice-sealant-calculator** | Coverage calculator (joint dimensions → tube count), tag-gated visibility |
| **solstice-quote-form** | 2-step progressive disclosure trade quote form (Shopify contact form) |
| **solstice-tds-zone** | TDS/SDS document download links, metafield-driven |
| **Upstream-first** | Product page strategy: keep upstream `product-information.liquid`, add custom blocks via `@theme` type |

## Design system

- **Typography:** Geist Bold (headings) + Geist Medium (subheadings) + System UI (body) + Geist Mono (accent). Updated 2026-05-17.
- **Color:** 5 schemes (Default Light, Brand Light, Dark, Brand Dark, Brand Red Pop). Updated 2026-05-17 in `config/settings_data.json`.
- **Design principle:** Confident utility, not flash.
- **Full system:** `docs/design/brand-guidelines.md` — still reflects pre-typography-pivot state (pending update).
- **Gitignore:** Cleaned up 2026-05-17 — `config/settings_data.json`, `docs/design/`, `docs/analytics/`, `CONTEXT.md`, `BUSINESS_PROFILE.md`, `docs/SOLSTICE_V1_ROADMAP.md` no longer gitignored.

## Key Decisions

- **Breakpoint**: 750px (Horizon standard) switches desktop nav to mobile drawer
- **Desktop activation**: Click to open (no hover)
- **Mobile pattern**: Left-side drawer with overlay, accordion navigation
- **Section naming**: `solstice-` prefix per convention in CLAUDE.md
- **Panel layout**: Single-column progressive disclosure — 320px L2 column with 260px L3 column cascading right via flex (not absolute positioning, no horizontal scroll). L3 column has tinted background for visual separation.
- **Block-based L1 config**: `menu_item` blocks with label, URL, optional child menu (replaces single `link_list` picker)
- **Panel styling**: `border-radius: 0 0 8px 8px`, `border-top` spanning full width, nav links have horizontal padding + `border-radius: 4px` for comfortable hover targets
- **v1 scope**: Core shopping flow (browse → product → cart → checkout) with trust architecture. Not a migration. Features earn in via the decision filter.
- **Product page: upstream-first** (2026-05-17): Keep upstream `product-information.liquid` + add custom blocks. Template already configured with trust signals, cross-sell, shipping, accordion via upstream blocks. Only 5 custom blocks needed.
- **Trust badges: 2×2 grid** (2026-05-17): Replaced upstream 4-in-a-row text group with `solstice-trust-badges` block — inline SVGs, accent-colored icons, configurable text.
- **Buy mode toggle: savings badge** (2026-05-17): Pill badge below toggle shows per-unit savings when box mode selected (`Save $X.XX per unit (Y% off)`). Calculates from price difference + unit count extracted from variant name.
- **Sealant calculator: tag-gated** (2026-05-17): Only renders for products with `sealant` or `coverage-calculator` tags (or `force_show` setting).
- **Quote form: Shopify contact form** (2026-05-17): Uses `{% form 'contact' %}`, 2-step progressive disclosure, no external API.
- **All blocks theme-editor configurable** (2026-05-17): Merchant can add/reorder/remove each block independently.
