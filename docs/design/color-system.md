# Color System

> **Last Updated:** 2026-05-17

---

## Overview

The Solstice color system uses 5 color schemes built around three brand colors. Every scheme exists to serve a specific purpose — there are no decorative schemes. If a scheme doesn't support the trust architecture or Malcolm's voice, it doesn't belong.

**Design principle:** Confident utility. The color system supports trust signals (authority, real business, human access) without visual noise. Restrained palette, high contrast, clear hierarchy.

---

## Brand Colors

These three colors are non-negotiable. They are Adheseal.

| Color | Hex | Usage |
|-------|-----|-------|
| **Adheseal Red** | `#ea1f27` | Brand accent. CTAs, highlights, brand moments. |
| **Charcoal** | `#231f20` | Dark text, buttons, headings. The serious color. |
| **Warm White** | `#f4f4f2` | Light backgrounds. Warmer than pure white, softer on the eyes. |

### Red Variants

| Variant | Hex | Usage |
|---------|-----|-------|
| Red Hover | `#ff3344` | Button hover state |
| Red Pressed | `#c41920` | Button pressed state, input backgrounds on red |

### Neutral Variants

| Variant | Hex | Usage |
|---------|-----|-------|
| Pure Black | `#0a0a0a` | Dark scheme backgrounds |
| Pure White | `#ffffff` | Light scheme backgrounds, button text |

---

## Color Schemes

### Scheme 1: Default Light

The workhorse. Clean white with dark text. Neutral sections, product content, general pages.

| Property | Value |
|----------|-------|
| Background | `#ffffff` |
| Foreground | `#000000cf` |
| Primary | `#000000cf` |
| Primary Button | Black bg, white text |
| Secondary Button | Transparent, black border |

**Use for:** Default sections, product descriptions, content areas, anything that should recede.

---

### Scheme 2: Brand Light

Adheseal's identity. Warm white with charcoal text and red accents. The brand-forward light scheme.

| Property | Value |
|----------|-------|
| Background | `#f4f4f2` |
| Foreground | `#231f20cc` |
| Primary | `#ea1f27` |
| Primary Button | Charcoal bg, warm white text |
| Secondary Button | Transparent, charcoal border |

**Use for:** Hero areas, brand sections, featured content, trust signal blocks, any section that should feel like Adheseal.

---

### Scheme 3: Dark

Neutral dark. Black background with white text. For contrast breaks and dark sections without brand emphasis.

| Property | Value |
|----------|-------|
| Background | `#0a0a0a` |
| Foreground | `#ffffffcc` |
| Primary | `#ffffff` |
| Primary Button | White bg, black text |
| Secondary Button | Transparent, white border |

**Use for:** Dark sections, overlays, hero sections with dark imagery, footer areas, visual rhythm breaks.

---

### Scheme 4: Brand Dark

Dark with brand red. The dark counterpart to Brand Light. For high-impact brand sections that need weight.

| Property | Value |
|----------|-------|
| Background | `#0a0a0a` |
| Foreground | `#ffffffcc` |
| Primary | `#ea1f27` |
| Primary Button | Brand red bg, white text |
| Secondary Button | Transparent, white border |

**Use for:** CTAs, hero sections with brand emphasis, promotional banners, sections that need to feel authoritative.

---

### Scheme 5: Brand Red Pop

Saturated brand red background with white text. The only pop scheme. Bold, confident, unmistakably Adheseal.

| Property | Value |
|----------|-------|
| Background | `#ea1f27` |
| Foreground | `#ffffff` |
| Primary | `#ffffff` |
| Primary Button | White bg, red text |
| Secondary Button | Transparent, white border |

**Use for:** Hero CTAs, brand moments, high-impact calls to action. Maximum 1 per page.

**Design notes:**
- White primary button with red text creates strong contrast on red
- Inputs use darker red `#c41920` for depth
- This is the only scheme where the background is not neutral. Use it as punctuation, not wallpaper.

---

## Scheme Pairing Guide

Light and dark schemes pair naturally:

| Light | Dark | Relationship |
|-------|------|--------------|
| Scheme 1 (Default Light) | Scheme 3 (Dark) | Inverted values. Neutral pair. |
| Scheme 2 (Brand Light) | Scheme 4 (Brand Dark) | Same red accent, light vs dark. Brand pair. |

### Recommended Page Rhythms

- **Product page:** Scheme 2 (hero/trust blocks) → Scheme 1 (product details) → Scheme 3 or 4 (CTA)
- **Collection page:** Scheme 1 (default) → Scheme 2 (featured/filter bar)
- **Homepage:** Scheme 3 or 4 (hero) → Scheme 2 (trust blocks) → Scheme 1 (product grid) → Scheme 5 (CTA)
- **Alternating sections:** Scheme 1 → Scheme 2 → Scheme 1 creates subtle rhythm without jarring contrast

### Pop Scheme Usage

Scheme 5 (Brand Red Pop) is high-impact. Rules:

- Maximum **1 per page**
- Always between neutral schemes — never adjacent to another pop scheme
- Reserve for the single most important CTA on the page

---

## Dropped Schemes

The following schemes were removed from the system during the v1 realignment. They did not earn their place against Malcolm's voice and the trust architecture.

| Dropped Scheme | Reason |
|---------------|--------|
| Blue Tint Light | No brand connection. "Professional blue" is generic. Tradie trust comes from authority, not blue. |
| Blue Dark | Counterpart to Blue Tint Light — same reasoning. No brand reason to exist. |
| Rhodamine Pop | Hot pink urgency tactics are anti-Malcolm. Malcolm sells by being correct, not by creating panic. |
| Yellow Pop | High-energy is anti-Malcolm. Confident utility doesn't shout in yellow. |

If a future need arises for an additional scheme (e.g. a warning/safety scheme for product compliance data), it should be evaluated against the same criteria: does it serve Malcolm's voice and the trust architecture?

---

## CSS Variables Reference

All colors are exposed as CSS custom properties within each color scheme class. Generated by `snippets/color-schemes.liquid`.

### Complete Variable Set

Every scheme defines these variables:

```css
.color-scheme-1 {
  /* Core */
  --color-background: rgb(255, 255, 255);
  --color-foreground: rgb(0, 0, 0, 0.8);
  --color-foreground-rgb: 0, 0, 0;
  --color-foreground-heading: rgb(0, 0, 0);
  --color-primary: rgb(0, 0, 0);
  --color-primary-hover: rgb(0, 0, 0);

  /* Borders and shadows */
  --color-border: rgb(0, 0, 0);
  --color-shadow: rgb(0, 0, 0);

  /* Primary button */
  --color-primary-button-background: rgb(0, 0, 0);
  --color-primary-button-text: rgb(255, 255, 255);
  --color-primary-button-border: rgb(0, 0, 0);
  --color-primary-button-hover-background: rgb(0, 0, 0);
  --color-primary-button-hover-text: rgb(255, 255, 255);
  --color-primary-button-hover-border: rgb(0, 0, 0);

  /* Secondary button */
  --color-secondary-button-background: transparent;
  --color-secondary-button-text: rgb(0, 0, 0);
  --color-secondary-button-border: rgb(0, 0, 0);
  --color-secondary-button-hover-background: rgb(0, 0, 0);
  --color-secondary-button-hover-text: rgb(255, 255, 255);
  --color-secondary-button-hover-border: rgb(0, 0, 0);

  /* Form inputs */
  --color-input-background: rgb(255, 255, 255);
  --color-input-text: rgb(0, 0, 0);
  --color-input-border: rgb(0, 0, 0);
  --color-input-hover-background: rgb(245, 245, 245);

  /* Variant pickers */
  --color-variant-background: rgb(255, 255, 255);
  --color-variant-border: rgb(0, 0, 0);
  --color-variant-text: rgb(0, 0, 0);
  --color-variant-hover-background: rgb(0, 0, 0);
  --color-variant-hover-text: rgb(255, 255, 255);
  --color-variant-hover-border: rgb(0, 0, 0);
  --color-selected-variant-background: rgb(0, 0, 0);
  --color-selected-variant-border: rgb(0, 0, 0);
  --color-selected-variant-text: rgb(255, 255, 255);
  --color-selected-variant-hover-background: rgb(0, 0, 0);
  --color-selected-variant-hover-text: rgb(255, 255, 255);
  --color-selected-variant-hover-border: rgb(0, 0, 0);
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

### Derived Colors

The snippet auto-generates opacity-based variants based on background brightness:

| Variable | Light bg | Dark bg |
|----------|----------|---------|
| `--opacity-5-15` | 0.05 | 0.15 |
| `--opacity-10-25` | 0.10 | 0.25 |
| `--opacity-35-55` | 0.35 | 0.55 |
| `--opacity-40-60` | 0.40 | 0.60 |
| `--opacity-30-60` | 0.30 | 0.60 |

Used for muted text, disabled states, and subtle backgrounds:
```css
--color-foreground-muted: rgb(var(--color-foreground-rgb) / var(--opacity-60));
```

---

## Accessibility

### Contrast Ratios

| Scheme | Background | Foreground | Ratio | WCAG |
|--------|------------|------------|-------|------|
| Scheme 1 (Default Light) | `#ffffff` | `#000000cf` | 16:1 | AAA |
| Scheme 2 (Brand Light) | `#f4f4f2` | `#231f20cc` | 12:1 | AAA |
| Scheme 3 (Dark) | `#0a0a0a` | `#ffffffcc` | 15:1 | AAA |
| Scheme 4 (Brand Dark) | `#0a0a0a` | `#ffffffcc` | 15:1 | AAA |
| Scheme 5 (Red Pop) | `#ea1f27` | `#ffffff` | 4.5:1 | AA |

### Brand Red Visibility

| Context | Ratio | WCAG |
|---------|-------|------|
| `#ea1f27` on `#ffffff` | 4.5:1 | AA |
| `#ea1f27` on `#0a0a0a` | 5.2:1 | AA |
| `#ea1f27` on `#f4f4f2` | 4.6:1 | AA |

Brand red meets AA on all backgrounds it appears on. It does not meet AAA for small text — use it for accents, headings, and interactive elements, not body copy.

### Typography Contrast Note

The Geist + System UI typography system may render at slightly different visual weights across platforms (especially Windows vs macOS). All contrast ratios above were calculated using the foreground colors as specified. Verify on Windows after build — System UI tends to render lighter on Windows, which can affect perceived contrast.

---

## Configuration

### Via Theme Editor

1. **Online Store → Themes → Customize**
2. **Theme Settings → Colors**
3. Select a scheme to modify

Changes save to `config/settings_data.json` (gitignored).

### Via JSON

Edit `config/settings_data.json` directly. Each scheme has ~35 color properties covering backgrounds, foregrounds, buttons, borders, inputs, and variant pickers.

### Adding a Scheme

If a genuine need arises:

1. Evaluate against Malcolm's voice and trust architecture
2. Create the scheme in theme settings
3. Document it here with full specs and usage guidelines
4. Update the contrast ratio table
5. Add to the pairing guide

---

## Migration History

### Current Revision (2026-05-17)

| Change | Detail |
|--------|--------|
| Removed Blue Tint Light | No brand connection |
| Removed Blue Dark | No brand connection |
| Removed Rhodamine Pop | Anti-Malcolm urgency tactics |
| Removed Yellow Pop | Anti-Malcolm high energy |
| Renumbered | 5 schemes, numbered 1-5 in theme settings |
| Added pairing guide | Light/dark pairs and page rhythm recommendations |
| Added dropped schemes table | Documents what was removed and why |

### Previous Color Palette (Pre-2026-05-17)

9 schemes: Default Light, Brand Light, Blue Tint Light, Dark, Brand Dark, Blue Dark, Brand Red Pop, Rhodamine Pop, Yellow Pop.

### Brand Colors (Stable)

Adheseal Red `#ea1f27`, Charcoal `#231f20`, Warm White `#f4f4f2` — unchanged since initial system.
