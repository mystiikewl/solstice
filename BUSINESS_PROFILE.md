# Adheseal Business Profile

> Source of truth for Solstice theme development. Every build decision starts here.

---

## Company

Adheseal is a 30-year family-owned adhesives and sealants distributor based in South East Queensland. Four physical stores: Stafford, Slacks Creek, Gold Coast, Sunshine Coast. Strong local trust and trade networks. Expanding nationally through SEO.

- **Platform:** Shopify (not Plus)
- **Catalog:** 400+ unique products, 2000+ including variants
- **Markets:** National (Australia), fulfilment from SEQ
- **Trade portal:** Separate password-protected site (adheseal-trade.com.au)

---

## Customer

Trade professionals — tilers, waterproofers, builders, glaziers, contractors, plumbers, auto glass installers. They think in **jobs**, not product categories. Two buying modes:

1. **Know the product** — searching for a specific SKU or brand (e.g. "Sikaflex Pro", "Megapoxy PM")
2. **Know the job** — know what they need to achieve, need the right product surfaced (e.g. "waterproofing a bathroom")

### Customer mix

- **B2B drives revenue.** Business owners are the primary customer.
- Treated as retail customers — same storefront, same checkout.
- B2B convenience features layered on: bulk ordering, sales rep contact.
- B2C (retail consumers / DIY) also served but secondary.

### Device split

- Desktop: 60% (office, home, detailed research)
- Mobile: 40% (on-site lookups, quick reorders)

---

## Problem

Strong SEO rankings drive 13k+ sessions/month. Conversion rate is 0.93% (industry average: 2-3%). The business is leaving 2-3x its current revenue on the table.

### Root cause

**Trust and confidence gap.** Visitors find products through search but don't know Adheseal outside SEQ. The site doesn't communicate 30 years of authority, technical expertise, or physical presence in the first 3 seconds. They bounce to a supplier they recognise.

### Evidence (28 days to May 16, 2026)

- Homepage: 1,412 sessions, 25.9% bounce (healthy)
- Sikaflex Pro product pages: 649 combined exits, 44-61% bounce (including paid ads)
- Dowsil 795: 53.3% bounce
- Dow Corning 888: 49.3% bounce
- Conversion rate: 0.93% (122 purchases / 13,070 sessions)
- Session key event rate: 2.04%

### Why product pages dominate

Product pages receive disproportionate traffic because significant SEO investment has gone into ranking them. Collection pages and other surfaces would receive similar traffic volumes with comparable investment. The strategy is not "only fix product pages" — it's **build a theme where every surface that ranks also converts.**

---

## Strategic mission

Make Adheseal the fastest, most reliable place for Australian tradespeople to get exactly what they need for the job — and keep coming back.

### Three pillars

1. **Find fast, buy fast.** Tradespeople are on the clock. Speed of transaction is the competitive advantage. Search is the front door.
2. **Never let them forget something.** If someone buys a waterproofing membrane, they also need primer, backing rod, angles, and sealant. Surface related products as useful instruction, not upsell.
3. **Make reordering trivial.** Best customers buy the same things repeatedly. Repeat purchase is where the money lives.

### Decision filter

Every feature, every design choice, every build decision passes through:

> Does this help tradespeople find fast, buy complete, or come back?

If it doesn't serve one of those three, it's v2+.

---

## Trust architecture

Every surface needs trust signals at the point of decision — not buried in a footer. The signals:

| Signal | What it communicates |
|--------|---------------------|
| **Technical authority** | 30 years in the industry. Application expertise. Product guides. Specs that answer "so what?" |
| **Real business** | Physical stores, real inventory, phone number visible, Australian-owned |
| **Social proof** | Reviews, testimonials, project photos, "used by tradespeople across Australia" |
| **Human access** | Easy contact, sales rep access, returns policy visible at point of purchase |
| **Right product confidence** | Clear product info, specs, application guides, "commonly bought together" |

These appear at specific moments: hero (first impression), product card (browse), product page (decision), cart (commitment).

---

## Brand voice — Malcolm

Malcolm is locked. Full definition in `docs/design/brand_voice.md`.

40-year trade veteran. No bullshit, anti-wank. Warmth through competence, not fake camaraderie. Sells by being correct. If the product is wrong for the job, he says so. Australian English throughout.

Key principles:
- Persuasion IS correctness
- Specificity over vagueness — numbers, not adjectives
- Open with the situation, not the product
- Close the case — draw conclusions with confidence
- Cross-sell through instruction only ("Prime with Supaprime" not "Consider also buying Supaprime")

---

## Design system

Exists in `docs/design/` but needs realignment. Brand voice is locked; visual system is not.

### Current state

- **Typography:** Pivoted from Montserrat Black Italic / Poppins to **Geist Bold (headings) + System UI (body)**. Clean, utility-first, lets Malcolm's words carry the authority. Docs not yet updated. Font override snippet pending.
- **Color system:** 5 schemes defined (Default Light, Brand Light, Dark, Brand Dark, Brand Red Pop). Revised and applied to `config/settings_data.json`.
- **Design tokens:** Border radius, spacing, button styles, animation — documented. Needs review.
- **Brand guidelines:** Comprehensive but reflects pre-typography-pivot state.

### What still needs to happen

1. Update typography docs to Geist Bold + System UI, build font override snippet
2. Update brand guidelines doc to reflect current color + typography state
3. Validate design tokens still work with cleaner, less decorative type
4. Ensure the visual system matches Malcolm's voice — confident utility, not flash

---

## B2B features

### Current (v1 carry-forward)

- Bulk order / quote request form — submit a quote for larger orders

### Aspirational (v2+, requires Shopify Plus or apps)

- Custom pricing tiers per customer
- Company accounts with multiple buyers
- Net payment terms (invoice instead of credit card)
- Reordering from past orders
- Sales rep assignment
- Quotation / RFQ workflow beyond the basic form

---

## Competitive landscape

Adheseal competes with:
- **Direct trade suppliers** (Bunnings Trade, Tradelink, Reece) — known brands, physical presence
- **Online-only competitors** — may be cheaper but lack authority
- **Brand-direct stores** (Sika, Ardex selling direct) — manufacturer authority

Differentiator: 30-year trade expertise + multi-brand catalog + technical authority. Not the cheapest — the most trustworthy.

---

## Operating model

- **Builder:** Solo (CMO), full decision authority
- **Budget:** Available for apps, tools, services as needed
- **Analytics:** Full access to Google Analytics, Shopify reports
- **Content:** Product descriptions and marketing copy written in-house (Malcolm voice)

---

## v1 scope definition

### What v1 is

A fresh build on Horizon — not a migration. Core shopping experience with trust architecture baked into every surface. Features earn their way in.

### What v1 is not

A feature-complete replica of the legacy theme. No compare, no wish lists, no quick view, no brand spotlights in v1. Those are v2+.

### v1 surfaces (in priority order)

1. **Product page** — highest traffic, highest drop-off. Trust signals, authority, clear variant selection, Malcolm-voiced content, "you'll also need" cross-sell.
2. **Collection page** — product discovery, filtering, sorting. Will receive more traffic with SEO investment.
3. **Header / navigation** — done (solstice-mega-nav). Find-fast pillar.
4. **Search** — predictive search, "what's popular" shortcuts. Find-fast pillar.
5. **Homepage** — first impression for branded traffic. Trust signals, hero, featured products, brand authority.
6. **Cart** — cart drawer. Commitment moment. Shipping clarity, trust reinforcement.
7. **Footer** — store locations, contact, trust signals (30 years, Australian-owned).

### v1 B2B

- Bulk order / quote request form

### v2+ backlog

- Compare, wish lists, quick view
- Brand spotlight sections
- Job-based product kits ("complete bathroom waterproofing kit")
- Reorder / saved orders / order templates
- Advanced cross-sell engine
- Store locator with inventory
- Content hub (application guides, project galleries)
- Customer reviews / social proof system

---

## File references

| Document | Location |
|----------|----------|
| Brand voice (Malcolm) | `docs/design/brand_voice.md` |
| Brand guidelines | `docs/design/brand-guidelines.md` |
| Typography | `docs/design/typography.md` |
| Color system (updated) | `docs/design/color-system.md` |
| Theme context | `CONTEXT.md` |
| Agent skills config | `CLAUDE.md` → Agent skills |
