# Color System

> **Last Updated:** 2026-02-21

---

## Overview

This document defines the Adheseal color system, including all color schemes available in the Horizon theme. Color schemes are configured in `config/settings_data.json` and rendered as CSS custom properties via `snippets/color-schemes.liquid`.

---

## Color Palette

### Primary Brand Colors

| Color | Hex | CSS Variable | Usage |
|-------|-----|--------------|-------|
| Adheseal Red | `#ea1f27` | `--color-primary` (scheme-2) | Primary brand accent |
| Charcoal | `#231f20` | `--color-foreground` | Dark text, headers |
| Warm White | `#f4f4f2` | `--color-background` (scheme-2) | Light backgrounds |

### Accent Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Blue | `#3b82f6` | Professional, trust (scheme-6) |
| Navy | `#1f3a4d` | Secondary accent (scheme-3) |
| Light Blue | `#60a5fa` | Links on dark backgrounds |
| Red Hover | `#ff3344` | Brand red hover state |
| Red Dark | `#c41920` | Brand red pressed state |
| Rhodamine Red | `#e1004c` | Sale/promo accent (scheme-8) |
| Bright Yellow | `#fedd00` | Highlights, energy (scheme-9) |

### Utility Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Pure Black | `#0a0a0a` | Dark backgrounds |
| Pure White | `#ffffff` | Light backgrounds, buttons |
| Dark Navy | `#0f172a` | Blue-tinted dark backgrounds |
| Slate | `#1e293b` | Input backgrounds on dark |
| Border Light | `#ffffff1a` | Subtle borders on dark |
| Border Medium | `#ffffff33` | Visible borders on dark |

---

## Color Schemes

### Light Schemes

#### Scheme 1: Default Light
Clean white background with black typography.

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Foreground | `#000000cf` |
| Primary | `#000000cf` |
| Primary Button | Black `#000000` |

**Use for:** Default pages, neutral sections

---

#### Scheme 2: Brand Light
Warm white with Adheseal brand red accents.

| Property | Value |
|----------|-------|
| Background | `#f4f4f2` |
| Foreground | `#231f20cc` |
| Primary | `#ea1f27` |
| Primary Button | Charcoal `#231f20` |

**Use for:** Brand-focused sections, hero areas, featured content

---

#### Scheme 3: Blue Tint Light
Soft blue-gray background with navy accents.

| Property | Value |
|----------|-------|
| Background | `#eef2f4` |
| Foreground | `#1f3a4dcc` |
| Primary | `#1f3a4d` |
| Primary Button | Navy `#1f3a4d` |

**Use for:** Professional sections, informational areas

---

### Dark Schemes

#### Scheme 4: Dark (Inverted 1)
Pure black background with white typography. Inverted version of Scheme 1.

| Property | Value |
|----------|-------|
| Background | `#0a0a0a` |
| Foreground | `#ffffffcc` |
| Primary | `#ffffff` |
| Primary Button | White `#ffffff` |

**Use for:** Dark sections, overlays, contrast breaks, hero sections with dark imagery

---

#### Scheme 5: Brand Dark
Black background with Adheseal brand red accents. Dark version of Scheme 2.

| Property | Value |
|----------|-------|
| Background | `#0a0a0a` |
| Foreground | `#ffffffcc` |
| Primary | `#ea1f27` |
| Primary Button | Brand Red `#ea1f27` |

**Use for:** Bold brand sections, call-to-action areas, promotional banners

---

#### Scheme 6: Blue Dark
Dark navy background with blue accents. Dark version of Scheme 3.

| Property | Value |
|----------|-------|
| Background | `#0f172a` |
| Foreground | `#ffffffcc` |
| Primary | `#60a5fa` |
| Primary Button | Blue `#3b82f6` |

**Use for:** Professional dark sections, tech-forward areas, contrast with warm schemes

---

### Color Pop Schemes

High-impact, attention-grabbing schemes for CTAs, promotions, and accent sections. Use sparingly for maximum effect.

#### Scheme 7: Brand Red Pop
Saturated brand red background with white typography. Bold, confident, brand-forward.

| Property | Value |
|----------|-------|
| Background | `#ea1f27` |
| Foreground | `#ffffff` |
| Primary | `#ffffff` |
| Primary Button | White bg, red text |

**Use for:** Hero CTAs, brand moments, high-impact sections

**Design Notes:**
- White primary button with red text creates strong contrast
- Inputs use darker red `#c41920` for depth
- Secondary buttons are transparent with white border

---

#### Scheme 8: Rhodamine Pop (Sale/Promo)
Hot pink-red background with yellow hover accents. Urgency, excitement, limited-time offers.

| Property | Value |
|----------|-------|
| Background | `#e1004c` |
| Foreground | `#ffffff` |
| Primary | `#ffffff` |
| Primary Button | White bg, rhodamine text |
| Button Hover | Yellow `#fedd00` |

**Use for:** Sale banners, promo sections, urgency CTAs, limited-time offers

**Design Notes:**
- Buttons change to bright yellow on hover for attention
- Yellow `#fedd00` accent creates energy and urgency
- Hot pink-red is more vibrant than brand red for promotional impact

---

#### Scheme 9: Yellow Pop
Bright yellow background with black typography. Optimism, energy, attention-grabbing.

| Property | Value |
|----------|-------|
| Background | `#fedd00` |
| Foreground | `#0a0a0a` |
| Primary | `#0a0a0a` |
| Primary Button | Black bg, yellow text |
| Button Hover | Brand Red `#ea1f27` |

**Use for:** Highlights, featured sections, attention-grabbing CTAs, seasonal promotions

**Design Notes:**
- Black text on yellow ensures readability (15:1 contrast)
- Primary button is black with yellow text
- Hover states shift to brand red for secondary action
- Inputs use lighter yellow `#fff5b8` for depth

---

## Scheme Pairing Guide

Light and dark schemes are designed to complement each other:

| Light Scheme | Dark Counterpart | Relationship |
|--------------|------------------|--------------|
| Scheme 1 | Scheme 4 | Inverted values (white↔black) |
| Scheme 2 | Scheme 5 | Same brand red accent, dark bg |
| Scheme 3 | Scheme 6 | Blue accent family, dark bg |

### Recommended Section Pairings

- **Hero + Content**: Use Scheme 5 (Brand Dark) for hero, Scheme 2 (Brand Light) for content below
- **Feature + CTA**: Use Scheme 1 (Default) for features, Scheme 5 (Brand Dark) for CTA
- **Alternating sections**: Scheme 2 → Scheme 4 → Scheme 2 creates visual rhythm

### Color Pop Usage

Color Pop schemes (7, 8, 9) are high-impact and should be used sparingly:

| Scheme | Use Case | Frequency |
|--------|----------|-----------|
| Scheme 7 (Red Pop) | Hero CTAs, brand moments | 1-2 per page max |
| Scheme 8 (Rhodamine) | Sale banners, urgency | Only during promos |
| Scheme 9 (Yellow Pop) | Featured sections, highlights | 1 per page max |

**Pairing tip:** Use a color pop section as a single accent between neutral schemes to create visual punctuation.

---

## CSS Variables Reference

All colors are exposed as CSS custom properties within each color scheme class:

```css
.color-scheme-1 {
  --color-background: rgb(255, 255, 255);
  --color-foreground: rgb(0, 0, 0);
  --color-foreground-rgb: 0, 0, 0;
  --color-primary: rgb(0, 0, 0);
  --color-primary-button-background: rgb(0, 0, 0);
  --color-primary-button-text: rgb(255, 255, 255);
  --color-border: rgb(0, 0, 0);
  /* ... etc */
}
```

### Using in Components

```liquid
{% stylesheet %}
  .my-component {
    background: var(--color-background);
    color: var(--color-foreground);
    border: 1px solid var(--color-border);
  }
  
  .my-button {
    background: var(--color-primary-button-background);
    color: var(--color-primary-button-text);
  }
  
  .my-accent {
    color: var(--color-primary);
  }
{% endstylesheet %}
```

---

## Accessibility Notes

### Contrast Ratios

| Scheme | Background | Text | Ratio | WCAG |
|--------|------------|------|-------|------|
| Scheme 1 | `#ffffff` | `#000000cf` | 16:1 | AAA |
| Scheme 2 | `#f4f4f2` | `#231f20cc` | 12:1 | AAA |
| Scheme 3 | `#eef2f4` | `#1f3a4dcc` | 10:1 | AAA |
| Scheme 4 | `#0a0a0a` | `#ffffffcc` | 15:1 | AAA |
| Scheme 5 | `#0a0a0a` | `#ffffffcc` | 15:1 | AAA |
| Scheme 6 | `#0f172a` | `#ffffffcc` | 14:1 | AAA |
| Scheme 7 | `#ea1f27` | `#ffffff` | 4.5:1 | AA |
| Scheme 8 | `#e1004c` | `#ffffff` | 4.2:1 | AA |
| Scheme 9 | `#fedd00` | `#0a0a0a` | 15:1 | AAA |

### Accent Color Visibility

- Brand red `#ea1f27` on white: 4.5:1 (AA)
- Brand red `#ea1f27` on black: 5.2:1 (AA)
- Blue `#3b82f6` on white: 3.8:1 (AA Large)
- Blue `#60a5fa` on dark navy: 5.1:1 (AA)
- Rhodamine `#e1004c` on white: 4.2:1 (AA)
- Yellow `#fedd00` with black text: 15:1 (AAA)

---

## Modifying Schemes

### Via Theme Editor

1. Go to **Online Store → Themes → Customize**
2. Navigate to **Theme Settings → Colors**
3. Select a scheme to modify
4. Adjust colors as needed
5. Save

Changes save to `config/settings_data.json`.

### Via JSON

Edit `config/settings_data.json` directly:

```json
{
  "current": {
    "color_schemes": {
      "scheme-1": {
        "settings": {
          "background": "#ffffff",
          "foreground": "#000000cf",
          // ... all 35 color properties
        }
      }
    }
  }
}
```

---

## Future Enhancements

Deferred to future sessions:

- [ ] Warm accent scheme (Orange `#ff5800`)
- [ ] Success state scheme (Green `#16a34a`)
- [ ] Additional color palette expansion
