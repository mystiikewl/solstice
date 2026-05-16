# Adheseal Shopify Theme Development Context

> **Purpose:** This document provides persistent context for all theme development. When developing new features, reference this file to understand brand alignment, conversion strategy, and technical patterns.

---

## 1. Brand Foundation

### Brand Identity
- **Company:** Adheseal — market-leading adhesives and sealants
- **Heritage:** 40+ years family-owned business
- **Positioning:** Bold, confident, technically authoritative
- **Values:** Authority | Confidence | Heritage | Modernity

### Visual Identity

| Role | Font | Usage |
|------|------|-------|
| Heading | Montserrat Black Italic | H1-H3, hero headlines |
| Subheading | Montserrat Medium | H4-H6, labels |
| Body | Poppins Regular | Paragraphs, content |
| Accent | Archivo Regular | Technical text, badges |

| Category | Color | Usage |
|----------|-------|-------|
| Brand | `#ea1f27` | Primary accent, CTAs |
| Dark | `#231f20` | Text, dark buttons |
| Light | `#f4f4f2` | Light backgrounds |
| Pop | `#fedd00` | Highlights, energy |

### Design Tokens
- **Primary/Secondary Buttons:** 100px border-radius (pill)
- **Input Fields:** 4px border-radius
- **Cards:** 4px border-radius
- **Icon Stroke:** 1.5px default

---

## 2. Marketing Psychology & Conversion Strategy

### Core Principle
Every feature should reduce **buyer friction** and increase **purchase confidence**. Customers aren't buying adhesives—they're buying confidence their project will succeed.

### Conversion-Optimized Behaviors (Non-Negotiable)

| Feature | Purpose | Psychology |
|---------|---------|------------|
| Sealant Calculator | Help customers find right product | Jobs-to-be-done, IKEA Effect |
| Product Customization | Personalized purchase | IKEA Effect, Commitment |
| Bulk Discount CTAs | Encourage larger orders | Goal-Gradient, Loss Aversion |
| Product Documents (SDS/TDS) | Technical confidence | Authority, Reciprocity |
| Quick Add-to-Cart | Reduce friction | Activation Energy reduction |

### Mental Models to Apply

| Model | Application |
|-------|-------------|
| **Authority** | Display "40+ years" near CTAs, certifications on PDP |
| **Social Proof** | Customer counts, testimonials, "trending" indicators |
| **Loss Aversion** | "Only X left" stock badges, bulk framing as protection |
| **Goal-Gradient** | Progress bars for bulk discount thresholds |
| **IKEA Effect** | Show calculator selections in cart, personalized results |
| **Default Effect** | Pre-select popular variants |
| **Scarcity** | Low stock warnings, shipping deadlines |
| **Reciprocity** | Prominent SDS/TDS downloads above fold |
| **Hick's Law** | Limit variant options, simplify forms |

### Quick Wins Priority List

1. Add "40+ years" tagline near CTAs (Authority)
2. Pre-select popular variants (Default Effect)
3. "Only X left" stock badges (Scarcity)
4. Bulk threshold progress bar (Goal-Gradient)
5. Loss-framed bulk messaging ("Order enough to avoid second delivery")
6. Prominent technical document downloads (Reciprocity)

---

## 3. Technical Framework

### Architecture Rules

| Rule | Limit |
|------|-------|
| Max settings per block | 10 |
| Section variations | 1 section with settings |
| Upstream file edits | None unless absolutely necessary |

### Content Modeling Decision Tree

```
┌─ Reusable across entities?
│  ├─ YES → Structured fields? → METAOBJECT
│  │        └─ Simple list? → METAFIELD list
│  └─ NO → Per-entity data? → METAFIELD
│           └─ Global config? → THEME SETTING
```

### Horizon Patterns (DO FOLLOW)

**Block Template:**
```liquid
{%- liquid
  assign block_settings = block.settings
  assign product_id = closest.product.id
  assign element_id = 'ComponentName-product_id-block_id' | replace: 'product_id', product_id | replace: 'block_id', block.id
-%}

<div {{ block.shopify_attributes }}>
  <!-- Component content -->
</div>

{% stylesheet %}
  component-name {
    display: block;
  }
{% endstylesheet %}

<script src="{{ 'component-name.js' | asset_url }}" type="module" fetchpriority="low"></script>

{% schema %}
{
  "name": "Component Name",
  "tag": "component-name",
  "settings": [
    // Max 10 settings
  ],
  "presets": [{ "name": "Component Name" }]
}
{% endschema %}
```

**Key Patterns:**
- Use custom elements (`<component-name>`)
- Inline CSS via `{% stylesheet %}`
- ES modules for JavaScript
- `closest.product` or `closest.collection` for context
- Max 10 settings per block
- Scoped styles using CSS custom properties

---

## 4. Key Templates & Revenue Drivers

| Template | Primary Section | Customization |
|----------|-----------------|---------------|
| `product.json` | `product-information` | Add blocks via theme editor |
| `collection.json` | `main-collection` | Add blocks via theme editor |
| `cart.json` | `main-cart` | Add blocks via theme editor |
| `search.json` | `search-results` | Minimal customization |

### Revenue Drivers (Priority Order)
1. **Product pages (PDP)** — Primary conversion point
2. **Collection pages (PLP)** — Product discovery
3. **Search results** — Intent-driven traffic

---

## 5. Existing Customizations

### Implemented Blocks
| Block | Type | Purpose |
|-------|------|---------|
| `product-documents.liquid` | Block | Display SDS/TDS from metaobject |
| `product-custom-property.liquid` | Block | Custom buyer inputs |
| `sealant-calculator.liquid` | Block | Product finder (planned) |

### Implemented Sections
| Section | Purpose |
|---------|---------|
| `sub-collections.liquid` | Collection groupings |
| `google-map.liquid` | Store locator |
| `custom-header*.liquid` | Custom headers |

### Metaobjects
| Metaobject | Purpose |
|------------|---------|
| `product_documents` | SDS, TDS, other technical documents |

---

## 6. Development Checklist

### Before Starting
- [ ] Check `docs/customizations/` for existing patterns
- [ ] Check `.cursor/rules/` for technical guidance
- [ ] Verify upstream hasn't added similar functionality
- [ ] Determine: Block, Section, or Snippet?
- [ ] Determine: Metafield, Metaobject, or Setting?
- [ ] Apply marketing psychology: How does this reduce friction or increase confidence?

### During Development
- [ ] Create new file (don't edit upstream files)
- [ ] Follow Horizon patterns (custom elements, inline CSS, ES modules)
- [ ] Max 10 settings per block
- [ ] Add localization strings to locale files
- [ ] Use `closest.product` or `closest.collection` for context

### Before Committing
- [ ] Run `shopify theme check --path .`
- [ ] Test in theme editor dev preview
- [ ] Verify no upstream file edits (unless documented exception)
- [ ] Run `npm run build:schemas` if schema changes

---

## 7. Validation Commands

```bash
# Lint
shopify theme check --path .

# Schema validation
npm run build:schemas

# Local dev
shopify theme dev
```

---

## 8. Related Documentation

| Document | Purpose |
|----------|---------|
| `docs/design/brand-guidelines.md` | Visual identity details |
| `docs/design/color-system.md` | Color system documentation |
| `docs/design/typography.md` | Typography system |
| `docs/planning/2026-02-21-theme-customization-framework.md` | Technical architecture |
| `.cursor/rules/*.mdc` | Technical implementation rules |

---

*Last Updated: 2026-02-22*
