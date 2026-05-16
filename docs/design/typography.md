# Typography System

> **Last Updated:** 2026-02-21

---

## Overview

This document defines the Adheseal typography system. The type system is built on four font roles with a refined scale, tight tracking for headings, and modern readability standards.

---

## Font Stack

### Primary Fonts

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Body** | Poppins | Regular (400) | Paragraphs, body text, general content |
| **Subheading** | Montserrat | Medium (500) | H4-H6, labels, badges, secondary headings |
| **Heading** | Montserrat | Black Italic (900) | H1-H3, hero headlines, primary headings |
| **Accent** | Archivo | Regular (400) | Technical accents, badges, product codes |

### Font Pairing Rationale

**Montserrat Black Italic + Poppins** creates a distinctive contrast:

- **Montserrat Black Italic:** Bold, energetic, distinctive. Matches product label typography. Used on hero headlines for maximum brand impact.
- **Poppins:** Rounded, friendly, excellent readability at all sizes. Neutral enough for long-form content.
- **Montserrat Medium:** Cohesive with headings but lighter weight for smaller headings where Black Italic would feel overwhelming.
- **Archivo:** Industrial, architectural heritage. Used in technical documentation. Provides technical authority for accent elements.

### Fallback Stack

```css
--font-body--family: "Poppins", system-ui, sans-serif;
--font-subheading--family: "Montserrat", system-ui, sans-serif;
--font-heading--family: "Montserrat", system-ui, sans-serif;
--font-accent--family: "Archivo", system-ui, sans-serif;
```

---

## Type Scale

### Heading Sizes

| Preset | Size | Responsive | Usage |
|--------|------|------------|-------|
| **H1** | 64px | Fluid (scales down) | Hero headlines, page titles |
| **H2** | 40px | Fluid (scales down) | Section headings, major headings |
| **H3** | 28px | Fluid (scales down) | Subsection headings, card titles |
| **H4** | 22px | Fixed | Minor headings, labels |
| **H5** | 18px | Fixed | Small headings, captions |
| **H6** | 16px | Fixed | Smallest headings, meta |

### Body Sizes

| Preset | Size | Usage |
|--------|------|-------|
| **Paragraph** | 16px | Body text, general content |
| **Small** | 14px | Captions, metadata, fine print |
| **XS** | 13px | Badges, labels, tiny text |

### Fluid Typography

Heading sizes 48px and above use fluid scaling:

```css
--font-size--h1: clamp(2.5rem, 6.4vw, 4rem);
--font-size--h2: clamp(1.75rem, 4vw, 2.5rem);
--font-size--h3: clamp(1.25rem, 2.8vw, 1.75rem);
```

---

## Line Heights

### Display Scale (Headings)

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | 1.0 | Large display headings |
| Normal | 1.1 | Default for headings |
| Loose | 1.2 | Headings with more breathing room |

### Body Scale (Paragraphs)

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | 1.2 | Dense text, technical content |
| Normal | 1.4 | Default body text |
| Loose | 1.6 | Long-form reading, relaxed feel |

### Default Assignments

| Preset | Line Height | Notes |
|--------|-------------|-------|
| H1-H6 | Normal (1.1) | Headings use display scale |
| Paragraph | Normal (1.4) | Body uses body scale |

---

## Letter Spacing

### Values

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | -0.03em | Compact, controlled feel |
| Normal | 0em | Default, let font breathe |
| Loose | 0.03em | Spaced out, airy feel |

### Default Assignments

| Preset | Letter Spacing | Rationale |
|--------|----------------|-----------|
| H1-H6 | Tight (-0.03em) | Montserrat Black Italic benefits from tight tracking |
| Paragraph | Normal (0em) | Poppins reads well at default spacing |

---

## Text Transform

| Option | Usage |
|--------|-------|
| None (default) | Preserve original casing |
| Uppercase | Labels, badges, promotional text |

**Recommendation:** Use uppercase sparingly for labels and badges. Avoid on headings to maintain brand typography.

---

## CSS Variables

All typography values are exposed as CSS custom properties:

```css
:root {
  /* Font families */
  --font-body--family: "Poppins", system-ui, sans-serif;
  --font-subheading--family: "Montserrat", system-ui, sans-serif;
  --font-heading--family: "Montserrat", system-ui, sans-serif;
  --font-accent--family: "Archivo", system-ui, sans-serif;

  /* Preset variables (example for H1) */
  --font-h1--family: var(--font-heading--family);
  --font-h1--size: var(--font-size--h1);
  --font-h1--weight: var(--font-heading--weight);
  --font-h1--style: italic;
  --font-h1--line-height: var(--line-height--display-normal);
  --font-h1--letter-spacing: var(--letter-spacing--heading-tight);
  --font-h1--case: none;
}
```

---

## Usage Guidelines

### Heading Hierarchy

1. **H1:** One per page. Hero or page title. Always Montserrat Black Italic.
2. **H2:** Section headings. Montserrat Black Italic for impact.
3. **H3:** Subsection headings. Montserrat Black Italic or Medium depending on context.
4. **H4-H6:** Minor headings, labels. Montserrat Medium for readability.

### When to Use Each Font

| Context | Font | Weight |
|---------|------|--------|
| Hero headline | Montserrat | Black Italic |
| Section title | Montserrat | Black Italic |
| Card title | Montserrat | Black Italic or Medium |
| Product name | Montserrat | Black Italic |
| Section subtitle | Montserrat | Medium |
| Label/caption | Montserrat | Medium |
| Body paragraph | Poppins | Regular |
| Long-form content | Poppins | Regular |
| Product code/SKU | Archivo | Regular |
| Technical spec | Archivo | Regular |
| Badge (accent) | Archivo | Regular |
| Button text | Poppins | Regular |

### Don't

- Don't use Montserrat Black Italic for body text (unreadable at small sizes)
- Don't mix Archivo with Montserrat in the same heading
- Don't use Poppins for primary headings (lacks brand distinction)
- Don't apply tight letter-spacing to Poppins body text

---

## Accessibility

### Minimum Sizes

- Body text: 16px minimum (current default)
- Interactive text: 16px minimum for touch targets
- Small text: 13px minimum for non-critical content

### Line Length

Optimal reading width: 60-75 characters

```css
max-width: 32.5em; /* ~65 characters at default size */
```

### Contrast

All text colors defined in color schemes meet WCAG AA minimum:
- Body text on backgrounds: 4.5:1 minimum
- Large text (headings): 3:1 minimum

---

## Configuration

### Theme Settings

Typography is configured in **Theme Settings → Typography**:

1. **Fonts:** Select from Google Fonts library via font pickers
2. **Sizes:** Choose from predefined pixel values
3. **Line Height:** Tight/Normal/Loose presets
4. **Letter Spacing:** Tight/Normal/Loose presets
5. **Text Case:** Default or Uppercase

### Schema Location

`config/settings_schema.json` - Typography section

### Rendered CSS

`snippets/theme-styles-variables.liquid` generates CSS custom properties from settings.

---

## Migration Notes

### Previous Font Stack

| Role | Previous | New |
|------|----------|-----|
| Body | Work Sans Regular | Poppins Regular |
| Subheading | Work Sans Medium | Montserrat Medium |
| Heading | Anonymous Pro Regular | Montserrat Black Italic |
| Accent | Anonymous Pro Regular | Archivo Regular |

### Size Changes

| Preset | Previous | New |
|--------|----------|-----|
| H1 | 72px | 64px |
| H2 | 48px | 40px |
| H3 | 32px | 28px |
| H4 | 24px | 22px |
| Paragraph | 14px | 16px |

### Letter Spacing Changes

All headings now default to **tight** tracking (-0.03em) instead of normal.
