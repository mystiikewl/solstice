# Typography System

> **Last Updated:** 2026-05-17

---

## Overview

Solstice uses a utility-first typography system built on three font families. The type does not sell. The words sell. The type's job is to stay out of the way — clean, confident, and readable at every size.

**Design principle:** Confident utility, not flash. Malcolm's authority comes through specificity and correctness. The typography supports that by being sharp and transparent — not decorative.

---

## Font Stack

### Font Roles

| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Heading** | Geist | Bold (700) | H1-H3, hero headlines, primary headings |
| **Subheading** | Geist | Medium (500) | H4-H6, labels, secondary headings, UI chrome |
| **Body** | System UI | Regular (400) | Paragraphs, body text, buttons, general content |
| **Accent** | Geist Mono | Regular (400) | Product codes, SKUs, technical specs, monospace data |

### Font Pairing Rationale

**Geist Bold + System UI + Geist Mono** is a utility stack:

- **Geist Bold:** Sharp, geometric, no-nonsense. Designed for interfaces. Strong at large sizes, clear at small sizes. No decorative qualities — it carries weight through structure, not style. Lets Malcolm's words have authority without the type competing for attention.
- **System UI:** The native operating system font. Zero load time. Familiar to every user on every device. Reads perfectly at body sizes. The "invisible" body font — it's so natural that readers don't notice it, which is the point.
- **Geist Mono:** Monospace accent for technical data. Pairs structurally with Geist. Product codes, specs, SKUs — data that needs to look like data, not prose.

### Why This Direction

The previous stack (Montserrat Black Italic + Poppins + Archivo) was decorative. It had personality. That's the wrong tool for a trade supply store where trust comes from competence, not visual flair.

Geist + System UI is the typographic equivalent of Malcolm's voice: confident because it's correct, not because it's loud. The words carry the authority. The type gets out of the way.

### Fallback Stack

```css
--font-heading--family: "Geist", system-ui, -apple-system, sans-serif;
--font-subheading--family: "Geist", system-ui, -apple-system, sans-serif;
--font-body--family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
--font-accent--family: "Geist Mono", "SF Mono", "Cascadia Mono", ui-monospace, monospace;
```

System UI's fallback is the native OS font — it can't fail. Geist degrades to system-ui if the font doesn't load. Geist Mono degrades to system monospace.

---

## Type Scale

### Heading Sizes

| Preset | Size | Responsive | Usage |
|--------|------|------------|-------|
| **H1** | 56px | Fluid (scales down) | Hero headlines, page titles |
| **H2** | 36px | Fluid (scales down) | Section headings |
| **H3** | 24px | Fluid (scales down) | Subsection headings, card titles |
| **H4** | 20px | Fixed | Minor headings, labels |
| **H5** | 16px | Fixed | Small headings, captions |
| **H6** | 14px | Fixed | Smallest headings, meta labels |

### Body Sizes

| Preset | Size | Usage |
|--------|------|-------|
| **Paragraph** | 16px | Body text, general content |
| **Small** | 14px | Captions, metadata, fine print |
| **XS** | 12px | Badges, labels, tiny text — minimum size |

### Fluid Typography

H1-H3 use fluid scaling to maintain visual hierarchy across viewports:

```css
--font-size--h1: clamp(2rem, 5.6vw, 3.5rem);
--font-size--h2: clamp(1.5rem, 3.6vw, 2.25rem);
--font-size--h3: clamp(1.125rem, 2.4vw, 1.5rem);
```

H4-H6 use fixed pixel values — small enough that fluid scaling adds no value.

### Scale Rationale

The previous scale (64/40/28/22) was sized for Montserrat Black Italic, which needs more room because of its decorative weight and italic slant. Geist Bold is more compact at the same weight, so the scale tightens slightly. The hierarchy still reads clearly — the gap between H1 and body text is still 3.5x.

---

## Line Heights

### Display Scale (Headings)

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | 1.05 | Large display headings (H1) |
| Normal | 1.15 | Default for headings (H2-H6) |
| Loose | 1.25 | Headings that wrap to multiple lines |

### Body Scale (Paragraphs)

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | 1.3 | Dense text, technical specs |
| Normal | 1.5 | Default body text |
| Loose | 1.7 | Long-form reading |

### Default Assignments

| Preset | Line Height | Notes |
|--------|-------------|-------|
| H1 | Tight (1.05) | Display heading — minimal leading |
| H2-H6 | Normal (1.15) | Standard heading leading |
| Paragraph | Normal (1.5) | System UI benefits from slightly more generous leading than the previous 1.4 |

### Line Height Rationale

System UI renders differently across operating systems. A 1.5 body line height provides consistent readability regardless of platform. The previous 1.4 was tuned for Poppins' generous x-height — System UI has a smaller x-height and benefits from more breathing room.

---

## Letter Spacing

### Values

| Setting | Value | Usage |
|---------|-------|-------|
| Tight | -0.02em | Compact feel for large headings |
| Normal | 0em | Default for body and most headings |
| Loose | 0.05em | Spaced labels, uppercase text |

### Default Assignments

| Preset | Letter Spacing | Rationale |
|--------|----------------|-----------|
| H1 | Tight (-0.02em) | Large headings benefit from slight negative tracking |
| H2-H6 | Normal (0em) | Geist reads well at default spacing at these sizes |
| Paragraph | Normal (0em) | System UI at default — no adjustment needed |
| Accent (mono) | Normal (0em) | Monospace is already spaced by design |

### Letter Spacing Rationale

The previous -0.03em was tuned for Montserrat Black Italic, which has wide letterforms and benefits from aggressive tracking. Geist is naturally tighter and more controlled — -0.02em is enough for large display headings, and normal spacing works for everything else.

---

## Text Transform

| Option | Usage |
|--------|-------|
| None (default) | Preserve original casing — always |
| Uppercase | Small labels and badges only. Never on headings. |

Sentence case everywhere. Malcolm doesn't shout. Headings in sentence case — "The numbers that matter" not "The Numbers That Matter."

---

## CSS Variables

All typography values are exposed as CSS custom properties. These are generated dynamically by `snippets/theme-styles-variables.liquid` from theme settings.

### Font Family Variables

```css
:root {
  --font-heading--family: "Geist", system-ui, -apple-system, sans-serif;
  --font-heading--weight: 700;
  --font-heading--style: normal;

  --font-subheading--family: "Geist", system-ui, -apple-system, sans-serif;
  --font-subheading--weight: 500;
  --font-subheading--style: normal;

  --font-body--family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-body--weight: 400;
  --font-body--style: normal;

  --font-accent--family: "Geist Mono", "SF Mono", "Cascadia Mono", ui-monospace, monospace;
  --font-accent--weight: 400;
  --font-accent--style: normal;
}
```

### Heading Preset Variables (H1 Example)

```css
:root {
  --font-h1--family: var(--font-heading--family);
  --font-h1--size: clamp(2rem, 5.6vw, 3.5rem);
  --font-h1--weight: var(--font-heading--weight);
  --font-h1--style: normal;
  --font-h1--line-height: 1.05;
  --font-h1--letter-spacing: -0.02em;
  --font-h1--case: none;
}
```

### Theme Settings Mapping

| CSS Variable | Theme Setting | Schema ID |
|--------------|---------------|-----------|
| `--font-body--family` | Body font picker | `type_body_font` |
| `--font-subheading--family` | Subheading font picker | `type_subheading_font` |
| `--font-heading--family` | Heading font picker | `type_heading_font` |
| `--font-accent--family` | Accent font picker | `type_accent_font` |

Each heading (H1-H6) has a font selector (`type_font_h1` through `type_font_h6`) that maps to either "heading" or "accent" font role. Default: all headings use "heading" role.

---

## Usage Guidelines

### Heading Hierarchy

1. **H1:** One per page. Hero or page title. Geist Bold. Always.
2. **H2:** Section headings. Geist Bold.
3. **H3:** Subsection headings, card titles. Geist Bold.
4. **H4-H6:** Minor headings, labels. Geist Medium — lighter weight for readability at small sizes.

### When to Use Each Font

| Context | Font Role | Weight |
|---------|-----------|--------|
| Hero headline | Heading | Bold (700) |
| Page title | Heading | Bold (700) |
| Section title | Heading | Bold (700) |
| Card title | Heading | Bold (700) |
| Subsection / H3 | Heading | Bold (700) |
| Minor heading / H4-H6 | Subheading | Medium (500) |
| Section subtitle | Subheading | Medium (500) |
| Label / caption | Subheading | Medium (500) |
| Body paragraph | Body | Regular (400) |
| Long-form content | Body | Regular (400) |
| Button text | Body | Regular (400) |
| Navigation | Body | Regular (400) |
| Product code / SKU | Accent | Regular (400) |
| Technical spec value | Accent | Regular (400) |
| Dimensional data | Accent | Regular (400) |

### Don't

- Don't use Geist Bold for body text — it's for headings only
- Don't use the accent font (Geist Mono) for headings or body — it's for technical data only
- Don't apply tight letter-spacing to body text
- Don't use uppercase on headings — sentence case always
- Don't load additional font families. Three families is the system.

---

## Accessibility

### Minimum Sizes

- Body text: 16px minimum (current default)
- Interactive text: 16px minimum for touch targets
- Small text: 12px minimum for non-critical content (badges, labels)
- No text below 12px

### Line Length

Optimal reading width: 60-75 characters

```css
max-width: 32.5em; /* ~65 characters at default size */
```

### Contrast

All text colors defined in color schemes must meet WCAG AA minimum:
- Body text on backgrounds: 4.5:1 minimum
- Large text (headings 24px+): 3:1 minimum

System UI renders at slightly different weights across platforms. Test contrast on Windows (where system UI tends lighter) to ensure the 4.5:1 ratio holds.

---

## Configuration

### Theme Settings

Typography is configured in **Theme Settings → Typography**:

1. **Fonts:** Four font pickers (body, subheading, heading, accent)
2. **Sizes:** Per-heading pixel size selectors
3. **Line Height:** Tight/Normal/Loose presets per heading and body
4. **Letter Spacing:** Tight/Normal/Loose presets per heading
5. **Text Case:** Default or Uppercase per heading

### Schema Location

`config/settings_schema.json` — Typography section

### Rendered CSS

`snippets/theme-styles-variables.liquid` generates all CSS custom properties from theme settings.

### Font Loading

Geist and Geist Mono are loaded via Shopify's font picker (font_face with `font-display: swap`). System UI requires no loading — it's the native OS font.

---

## Migration History

### Current Migration (2026-05-17)

| Role | Previous | Current | Reason |
|------|----------|---------|--------|
| **Heading** | Montserrat Black Italic (900) | Geist Bold (700) | Utility-first. No decorative type. Authority through structure. |
| **Subheading** | Montserrat Medium (500) | Geist Medium (500) | Same family as heading — tighter system, fewer fonts. |
| **Body** | Poppins Regular (400) | System UI Regular (400) | Zero load time. Native readability. The invisible body font. |
| **Accent** | Archivo Regular (400) | Geist Mono Regular (400) | Monospace for technical data. Pairs with Geist. Looks like data. |

### Scale Changes

| Preset | Previous | Current | Reason |
|--------|----------|---------|--------|
| H1 | 64px | 56px | Geist is more compact than Montserrat Black Italic |
| H2 | 40px | 36px | Proportional reduction |
| H3 | 28px | 24px | Proportional reduction |
| H4 | 22px | 20px | Proportional reduction |
| H5 | 18px | 16px | Same as body — distinguish by weight not size |
| H6 | 16px | 14px | Small but readable |
| Paragraph | 16px | 16px | Unchanged |

### Letter Spacing Changes

| Preset | Previous | Current | Reason |
|--------|----------|---------|--------|
| H1-H6 | -0.03em | -0.02em (H1), 0em (H2-H6) | Geist is naturally tighter than Montserrat |
| Paragraph | 0em | 0em | Unchanged |

### Line Height Changes

| Preset | Previous | Current | Reason |
|--------|----------|---------|--------|
| Headings | 1.1 | 1.05 (H1), 1.15 (H2-H6) | Geist benefits from tighter H1 leading |
| Paragraph | 1.4 | 1.5 | System UI has smaller x-height than Poppins |

### Original Migration (2026-02-21)

| Role | Original | 2026-02-21 |
|------|----------|------------|
| Body | Work Sans Regular | Poppins Regular |
| Subheading | Work Sans Medium | Montserrat Medium |
| Heading | Anonymous Pro Regular | Montserrat Black Italic |
| Accent | Anonymous Pro Regular | Archivo Regular |
