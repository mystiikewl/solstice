# Adheseal Brand Guidelines

> **Last Updated:** 2026-02-21

---

## Brand Overview

Adheseal is a market-leading adhesives and sealants company with 40+ years of family-owned history. The brand positions itself as **bold, confident, and technically authoritative** — a leader in waterproofing, tiling, and construction solutions.

### Brand Values

| Value | Expression |
|-------|------------|
| **Authority** | Technical precision, expert knowledge, quality products |
| **Confidence** | Bold typography, strong colors, market leadership |
| **Heritage** | 40+ years family-owned, established, trusted |
| **Modernity** | Contemporary design, digital-first, innovative |

---

## Design System Structure

```
docs/design/
├── brand-guidelines.md    (this document)
├── color-system.md        (comprehensive color documentation)
└── typography.md          (comprehensive typography documentation)
```

---

## Visual Identity at a Glance

### Typography

| Role | Font | Primary Usage |
|------|------|---------------|
| Heading | Montserrat Black Italic | H1-H3, hero headlines |
| Subheading | Montserrat Medium | H4-H6, labels |
| Body | Poppins Regular | Paragraphs, content |
| Accent | Archivo Regular | Technical text, badges |

**See:** [Typography System](./typography.md)

### Color

| Category | Primary | Usage |
|----------|---------|-------|
| Brand | `#ea1f27` (Adheseal Red) | Primary accent, CTAs |
| Dark | `#231f20` (Charcoal) | Text, dark buttons |
| Light | `#f4f4f2` (Warm White) | Light backgrounds |
| Pop | `#fedd00` (Bright Yellow) | Highlights, energy |

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
| Font | Poppins Regular |
| Text Case | Default |
| Background | Color scheme primary button background |
| Text | Color scheme primary button text |

### Secondary Button

| Property | Value |
|----------|-------|
| Border Radius | 100px (pill) |
| Border Width | 1px |
| Font | Poppins Regular |
| Text Case | Default |
| Background | Color scheme secondary button background |
| Text | Color scheme secondary button text |

### Button Color Schemes

Buttons inherit colors from the active color scheme:

| Scheme | Primary Button | Secondary Button |
|--------|----------------|------------------|
| Scheme 1 | Black bg, white text | Transparent, black border |
| Scheme 2 | Charcoal bg, warm white text | Transparent, charcoal border |
| Scheme 5 | Brand red bg, white text | Transparent, white border |
| Scheme 7 | White bg, red text | Transparent, white border |

---

## Badges

### Sale Badge

| Property | Value |
|----------|-------|
| Position | Top-right |
| Border Radius | 100px (pill) |
| Font | Body (Poppins) |
| Text Transform | None |
| Color Scheme | Scheme 1 (default) |

### Sold Out Badge

| Property | Value |
|----------|-------|
| Position | Top-right |
| Border Radius | 100px (pill) |
| Font | Body (Poppins) |
| Text Transform | None |
| Color Scheme | Scheme 3 (muted) |

---

## Form Elements

### Input Fields

| Property | Value |
|----------|-------|
| Border Width | 1px |
| Border Radius | 4px |
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
| Price Font | Subheading (Montserrat Medium) |
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
   - Colors (color schemes)
   - Typography (fonts, sizes, spacing)
   - Buttons (radius, borders)
   - Badges (position, styling)
   - Input Fields (borders, radius)
   - Cart (type, pricing display)
   - And more...

---

## File References

| Component | Configuration | CSS/Template |
|-----------|---------------|--------------|
| Color Schemes | `config/settings_data.json` | `snippets/color-schemes.liquid` |
| Typography | `config/settings_schema.json` | `snippets/theme-styles-variables.liquid` |
| Base Styles | — | `assets/base.css` |
| CSS Variables | Generated | `:root` in theme-styles-variables.liquid |

---

## Future Enhancements

- [ ] Button font weight options
- [ ] Additional badge color schemes
- [ ] Animation speed presets
- [ ] Spacing scale documentation
