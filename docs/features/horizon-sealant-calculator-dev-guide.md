# Horizon Sealant Calculator: Developer Guide

## Scope

This guide documents how `snippets/sealant-calculator.liquid` works in the Horizon theme, and the minimum primitives needed to build a similar calculator pattern.

Primary implementation files:

- `snippets/sealant-calculator.liquid` (trigger surface)
- `snippets/calculator-sidebar.liquid` (interactive calculator UI)
- `assets/component-calculator-sealant.js` (behavior, logic, ATC)
- `assets/component-calculator-sealant.css` (presentation)
- `templates/product*.json` (insertion point via custom liquid block)

## System Overview (Zoomed Out)

The calculator is a two-part UI with a shared JavaScript controller:

1. Trigger snippet renders a clickable PDP card/button.
2. Sidebar snippet renders form controls, summary, result area, and ATC controls.
3. JavaScript binds trigger + sidebar + form logic through stable IDs/data attributes.
4. Result drives quantity for add-to-cart against selected variant.

The product template gates the feature to tagged products:

```liquid
{% if product.tags contains 'sealant-calculator' %}
  {{ 'component-calculator-sealant.css' | asset_url | stylesheet_tag }}
  {% render 'sealant-calculator' %}
  {{ 'component-calculator-sealant.js' | asset_url | script_tag }}
{% endif %}
```

## Primitive Building Blocks

Use these primitives when building similar tools in Horizon.

### 1) Trigger Primitive

Purpose: open calculator surface from PDP context.

Required contract:

- Any open control must include `data-open-calculator-sidebar`.
- Sidebar target uses `aria-controls="calculator-sidebar"`.
- Keyboard-open support when using non-button trigger (`role="button"`, `tabindex="0"`).

Current implementation includes two trigger forms:

- Visual card trigger (`.calculator-trigger`)
- Fallback hidden button (`#openCalculatorLink`)

### 2) Sidebar Shell Primitive

Purpose: contains entire interaction and a11y dialog semantics.

Required contract:

- Root ID: `id="calculator-sidebar"`
- Hook: `data-calculator-sidebar`
- Dialog semantics: `role="dialog"`, `aria-modal="true"`, `aria-hidden`
- Close hook: `[data-close-calculator-sidebar]`
- Shared text tokens through `data-summary-placeholder`, `data-summary-hint`

Behavior managed by JS:

- body class toggle: `calculator-sidebar-show`
- focus trap while open
- Escape and overlay close
- reset on close

### 3) Input/Form Primitive

Purpose: capture dimensional inputs and options.

Required IDs:

- `#sealantForm`
- `#jointLength`, `#jointWidth`, `#jointDepth`
- `input[name="unitSize"]` with values `300`, `600`, `custom`
- `#customUnitSize` (custom ml)
- `#wastageToggle`
- `#presetSelect`

Validation model:

- length/width/depth must be numeric and `> 0`
- custom unit must be numeric and `> 0` when `unitSize=custom`
- invalid numeric fields receive `invalid` class during typing

### 4) Preset Jobs Primitive

Purpose: speed up user input by pre-filling common width/depth values.

Preset map lives in `assets/component-calculator-sealant.js`:

- `bath_tub` -> width 6, depth 3
- `kitchen_sink` -> width 5, depth 4
- `window_frame` -> width 10, depth 5
- `expansion_joint` -> width 20, depth 12
- `concrete_slab` -> width 15, depth 10
- `metal_cladding` -> width 12, depth 6
- `roof_flashing` -> width 6, depth 4
- `floor_joint` -> width 8, depth 8
- `pipe_penetration` -> width 10, depth 6
- `general_gap` -> width 5, depth 5

Preset interaction contract:

- `#presetSelect` change updates `#jointWidth` + `#jointDepth`
- `#presetDescription` block becomes visible
- if length is empty, focus moves to `#jointLength`

### 5) Calculation Engine Primitive

Purpose: deterministic requirement output from inputs.

Formula:

```text
length_mm = length_m * 1000
volume_ml = length_mm * width_mm * depth_mm * 0.001

if wastage_toggle:
  volume_ml = volume_ml * 1.10

units_required = ceil(volume_ml / unit_size_ml)
```

Formatting rules:

- `< 1000ml` => rounded ml string (for example `850 ml`)
- `>= 1000ml` => litres with 2 decimals (for example `2.35 litres`)

Execution modes:

- Preview mode (`calculateSealantPreview`) updates summary as user types
- Submit mode (`calculateSealant`) validates and shows canonical result

### 6) Unit Size Primitive

Purpose: define packaging denominator for quantity recommendation.

Supported options:

- 300ml cartridge
- 600ml sausage
- custom ml

Behavior:

- custom input disabled unless custom radio selected
- radio changes trigger summary recomputation
- selected unit size controls both result text and ATC quantity math

### 7) Wastage Primitive

Purpose: add practical installation buffer.

Behavior:

- single toggle (`#wastageToggle`) applies 10% multiplier (`1.10`)
- affects preview and final calculation paths
- affects derived cart quantity

### 8) Variant + ATC Primitive

Purpose: turn recommendation into a transaction.

Required contracts:

- Variant selector: `#calculatorVariantSelect` populated from `product.variants`
- ATC button: `#addToCartBtn` + child `.add-to-cart-btn-text`
- Result state cache: `lastResult`

ATC flow:

1. User calculates.
2. JS reveals ATC button with quantity-aware label:
   - `Add {unitsRequired} x {variantTitle} to Cart`
3. Click sends POST to `cart/add.js` with:
   - `id = selected variant id`
   - `quantity = unitsRequired`
4. Feedback shown in `#addToCartFeedback`.
5. Theme cart UI updates via existing Halo cart hooks.

### 9) Summary/Feedback Primitive

Purpose: immediate confidence before submit and after submit.

Required IDs:

- `#summaryVolume`
- `#summaryUnits`
- `#results`, `#totalSealant`, `#totalUnits`
- `#calculatorError`, `#calculatorErrorText`

Summary behavior:

- shows placeholder/hint until enough valid inputs exist
- updates in near real-time on dimension/unit/variant changes

## Data + Translation Contracts

Key locale namespace: `calculator.sealant.*` in `locales/en.default.json`.

Use translations for:

- trigger labels
- section titles
- unit labels
- helper/placeholder text
- CTA copy

Do not hardcode user-facing text in liquid/js for production behavior.

## Accessibility Contracts

Minimum requirements already implemented:

- dialog semantics with `role="dialog"` and `aria-modal="true"`
- keyboard trigger support (`Enter`, `Space`) for non-button trigger
- Escape-to-close
- focus trap in open state
- `aria-live` regions for summary/feedback and errors

If you replicate this pattern, keep these contracts intact before styling changes.

## Build-Your-Own Similar Calculator (Horizon Blueprint)

For another calculator (for example grout, paint, membrane), reuse these primitives:

1. Trigger block with `data-open-*` attribute.
2. Sidebar/dialog shell with stable root ID and close hook.
3. Input block with strict numeric validation.
4. Option block (units, toggles, presets).
5. Calculation engine function (pure and deterministic).
6. Preview summary function.
7. Result block and ATC bridge.
8. Translation namespace for all copy.

Recommended implementation order:

1. Markup contracts (IDs/data attributes)
2. Pure calculation function + tests
3. Validation + summary preview
4. ATC integration
5. Focus/a11y hardening
6. Styling and responsive polish

## Reference Pointers

- Trigger markup: `snippets/sealant-calculator.liquid`
- Full interactive UI: `snippets/calculator-sidebar.liquid`
- Logic controller: `assets/component-calculator-sealant.js`
- Feature gating on PDP: `templates/product.json` (and related product templates)
