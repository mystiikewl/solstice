# Solstice Brand Guidelines

> **Last Updated:** 2026-05-17

---

## Brand Overview

Adheseal is a 30-year family-owned adhesives and sealants distributor. The visual system exists to support Malcolm's voice — confident utility, not flash. Authority comes from being correct, not from decorative design.

### Brand Values

| Value | Expression |
|-------|------------|
| **Authority** | Technical precision, expert knowledge, clean design |
| **Confidence** | Restrained typography, strong hierarchy, no decoration |
| **Heritage** | 30 years family-owned, established, trusted |
| **Utility** | Fast, functional, purposeful. Every element earns its place. |

---

## Design System Structure

```
docs/design/
├── brand-guidelines.md    (this document)
├── brand_voice.md         (Malcolm — locked)
├── color-system.md        (5 color schemes)
└── typography.md          (Geist + System UI + Geist Mono)
```

---

## Visual Identity at a Glance

### Typography

| Role | Font | Primary Usage |
|------|------|---------------|
| Heading | Geist Bold (700) | H1-H3, hero headlines |
| Subheading | Geist Medium (500) | H4-H6, labels |
| Body | System UI (400) | Paragraphs, content, buttons |
| Accent | Geist Mono (400) | Product codes, SKUs, specs |

**See:** [Typography System](./typography.md)

### Color

| Color | Hex | Usage |
|-------|-----|-------|
| Adheseal Red | `#ea1f27` | Brand accent, CTAs |
| Charcoal | `#231f20` | Text, dark buttons |
| Warm White | `#f4f4f2` | Light backgrounds |

5 schemes: Default Light, Brand Light, Dark, Brand Dark, Brand Red Pop.

**See:** [Color System](./color-system.md)

---

## Design Tokens

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| Primary Button | 100px | Pill-shaped primary buttons |
| Secondary Button | 100px | Pill-shaped secondary buttons |
| Input Fields | 4px | Subtle rounded corners |
| Badges | 100px | Pill-shaped badges |
| Cards | 4px | Subtle card rounding |
| Variant Buttons | 14px | Rounded variant selectors |
| Popovers | 14px | Floating UI elements |
| Pills | 40px | Tag-style elements |

### Border Width

| Element | Width |
|---------|-------|
| Primary Button | 0px (no border) |
| Secondary Button | 1px |
| Input Fields | 1px |
| Variant Buttons | 1px |
| Variant Swatches | 1px |

### Icon Stroke

| Setting | Value | Usage |
|---------|-------|-------|
| Default | 1.5px | Standard icons |

---

## Buttons

### Primary Button

| Property | Value |
|----------|-------|
| Border Radius | 100px (pill) |
| Border Width | 0px |
| Font | Body (System UI) |
| Text Case | Default |
| Background | Color scheme primary button background |
| Text | Color scheme primary button text |

### Secondary Button

| Property | Value |
|----------|-------|
| Border Radius | 100px (pill) |
| Border Width | 1px |
| Font | Body (System UI) |
| Text Case | Default |
| Background | Color scheme secondary button background |
| Text | Color scheme secondary button text |

### Button Colors by Scheme

Buttons inherit colors from the active color scheme:

| Scheme | Primary Button | Secondary Button |
|--------|----------------|------------------|
| Scheme 1 (Default Light) | Black bg, white text | Transparent, black border |
| Scheme 2 (Brand Light) | Charcoal bg, warm white text | Transparent, charcoal border |
| Scheme 3 (Dark) | White bg, black text | Transparent, white border |
| Scheme 4 (Brand Dark) | Brand red bg, white text | Transparent, white border |
| Scheme 5 (Red Pop) | White bg, red text | Transparent, white border |

---

## Badges

### Sale Badge

| Property | Value |
|----------|-------|
| Position | Top-right |
| Border Radius | 100px (pill) |
| Font | Body (System UI) |
| Text Transform | None |
| Color Scheme | Scheme 1 (default) |

### Sold Out Badge

| Property | Value |
|----------|-------|
| Position | Top-right |
| Border Radius | 100px (pill) |
| Font | Body (System UI) |
| Text Transform | None |
| Color Scheme | Scheme 3 (dark) |

---

## Form Elements

### Input Fields

| Property | Value |
|----------|-------|
| Border Width | 1px |
| Border Radius | 4px |
| Font | Body (System UI) |
| Background | Color scheme input background |
| Text Color | Color scheme input text color |
| Border Color | Color scheme input border color |

### Variant Pickers

#### Buttons

| Property | Value |
|----------|-------|
| Border Width | 1px |
| Border Radius | 14px |
| Width | Equal-width (fill) |

#### Swatches

| Property | Value |
|----------|-------|
| Width | 34px |
| Height | 34px |
| Border Radius | 32px (circular) |
| Border Style | Solid |
| Border Width | 1px |
| Border Opacity | 10% |

---

## Layout

### Page Width

| Setting | Value |
|---------|-------|
| Default | Narrow |

### Content Widths

| Setting | Width |
|---------|-------|
| Narrow | 90rem (1440px) |
| Normal | 120rem (1920px) |
| Wide | 150rem (2400px) |

---

## Animation

### Settings

| Property | Value |
|----------|-------|
| Page Transitions | Disabled |
| Transition to Main Product | Disabled |
| Add to Cart Animation | Enabled |
| Card Hover Effect | None |

### Timing

| Speed | Duration |
|-------|----------|
| Fast | 62.5ms |
| Default | 125ms |
| Slow | 200ms |

---

## Cart

### Settings

| Property | Value |
|----------|-------|
| Type | Drawer |
| Price Font | Subheading (Geist Medium) |
| Show Discount Code | Yes |
| Show Cart Note | No |
| Thumbnail Border | None |
| Thumbnail Radius | 0px |

---

## Search

### Product Cards

| Property | Value |
|----------|-------|
| Corner Radius | 0px |
| Card Corner Radius | 4px |
| Title Case | Default |

---

## Theme Editor Configuration

All design tokens are configurable in Shopify's Theme Editor:

1. **Online Store → Themes → Customize**
2. **Theme Settings** (gear icon)
3. Sections:
   - Colors (5 color schemes)
   - Typography (Geist + System UI + Geist Mono)
   - Buttons (radius, borders)
   - Badges (position, styling)
   - Input Fields (borders, radius)
   - Cart (type, pricing display)

---

## File References

| Component | Configuration | CSS/Template |
|-----------|---------------|--------------|
| Color Schemes | `config/settings_data.json` | `snippets/color-schemes.liquid` |
| Typography | `config/settings_schema.json` | `snippets/theme-styles-variables.liquid` |
| Base Styles | — | `assets/base.css` |
| Brand Voice | `docs/design/brand_voice.md` | — |

---

## Design System Validation (2026-05-17)

### Status: Coherent

The design system tells one story across all documents. No contradictions between visual system and brand voice.

### Audit Summary

| Dimension | Status | Notes |
|-----------|--------|-------|
| Typography ↔ Malcolm's voice | Pass | Utility-first type supports "confident utility, not flash." Geist carries weight through structure. |
| Color ↔ Trust architecture | Pass | 5 schemes serve specific purposes. Brand red for authority moments. Neutral schemes for content. |
| Color ↔ Typography | Pass | Restrained palette doesn't compete with Geist Bold. Red accents land on clean backgrounds. |
| Tokens ↔ Direction | Pass | Pill buttons (100px) retained — modern, works with Geist. 4px cards, no hover, restrained animation. |
| Animation ↔ Malcolm | Pass | No page transitions, no card hover, add-to-cart only. Motion is functional, never decorative. |
| Accessibility | Pass | All 5 schemes meet WCAG AA minimum. Brand red passes AA on all backgrounds. System UI cross-platform note flagged. |

### Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| Geist Bold (not Montserrat Black Italic) | Utility-first. Authority through structure, not decoration. |
| System UI (not Poppins) | Zero load time. Familiar. The invisible body font. |
| Geist Mono (not Archivo) | Monospace for technical data. Pairs with Geist. Looks like data, not prose. |
| 5 schemes (not 9) | Dropped blue (no brand connection), rhodamine (anti-Malcolm urgency), yellow (anti-Malcolm energy). |
| Pill buttons retained | Modern, works with Geist. B2B e-commerce convention. |
| Type scale tightened (56/36/24) | Geist is more compact than Montserrat Black Italic. Old scale was oversized. |

### Remaining Gaps

None. The design system is ready to build against.
