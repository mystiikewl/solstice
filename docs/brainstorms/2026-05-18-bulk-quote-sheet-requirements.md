# Bulk Quote Trigger-to-Sheet Refactor Requirements

Date: 2026-05-18
Status: Draft ready for planning
Owner: Storefront theme team

## 1) Problem

The current inline quote experience expands vertically through progressive disclosure, which pushes nearby PDP content down the page and creates perceived friction.

Observed evidence from user feedback:

- Quote form expansion makes PDPs feel too long and harder to scan.
- The interaction feels less stable than a contained side-surface pattern.

## 2) Outcome

Move quote capture from inline expansion to a trigger-first interaction that opens a dedicated sheet surface.

Target user flow:

1. User sees compact quote trigger on PDP.
2. User clicks trigger.
3. Quote sheet opens.
4. User completes and submits form.
5. Page refreshes and success confirmation appears.

## 3) Primary Users and Context

- Trade/bulk-intent shoppers on product detail pages.
- Users evaluating product details while deciding whether to request quote pricing.

## 4) Scope

### In Scope

- Replace inline quote form presentation with trigger -> sheet pattern.
- Support both quote variants based on product context:
  - Bulk-discount quote variant for products tagged `bulk-discount` (10% pricing proof branch).
  - General quote enquiry variant for all other products.
- Flat single-stage form (progressive step UI removed after fields extraction).
- Keep industry field in the form with expanded dropdown value set (23 trade-specific options + Other).
- Keep native contact form submission pattern and current refresh-based success flow.
- Match established interaction expectations used by existing calculator/cart drawer patterns (open, close, focus return, mobile/desktop behavior).

### Out of Scope (for this refactor)

- Re-architecting quote backend routing or form transport.
- Changing analytics event names or attribution model.
- Introducing new quote qualification fields beyond current form contract.
- Multi-surface experimentation (for example, dual inline + sheet entry in the same release).

## 5) UX and Behavior Requirements

### Surface Pattern

- PDP displays exactly one compact quote trigger panel.
- Trigger opens quote sheet:
  - Desktop: right-side sheet.
  - Mobile: bottom sheet.
- Sheet can be dismissed with explicit close control and expected dialog dismissal behaviors.
- On close, focus returns to the trigger.

### Variant Selection Logic

- Product tag controls which quote variant content is shown in the sheet.
- No scenario should render both variants simultaneously.

### Form Behavior

- Progressive two-step behavior remains parity with current behavior:
  - Step 1 validity required before step 2 expansion.
  - Enter behavior on step 1 continues to advance as today.
  - Step 2 expands on server-side errors.
  - Step 2 disabled state while collapsed is preserved.

### Success and Error States

- Success state appears within the quote experience after submit/refresh.
- Error handling remains within quote surface context and does not degrade to unclear global errors.

## 6) Tracking and Data Contract Requirements

Existing tracking and metadata contract must be preserved during this refactor.

Must remain compatible with:

- `assets/contact-form-tracking.js` event contract (`bulk_quote_view`, `bulk_quote_start`, `bulk_quote_submit_attempt`, success restore behavior).
- Existing quote form data attributes and hidden metadata key names documented in `docs/features/horizon-bulk-discount-dev-guide.md`.
- Current variant-context synchronization behavior for submitted quote payload.

## 7) Constraints and Architecture Guardrails

- Follow composition-first Horizon customization approach.
- Prefer new custom files over invasive core rewrites.
- Keep concerns separated (trigger rendering, sheet behavior, form rendering, tracking compatibility).
- Align with OS3 guidance in `docs/horizon-os3-cheat-sheet.md`.

## 8) Success Criteria

Primary success criteria:

1. Maintain quote submission volume after rollout (no regression from current baseline).
2. Reduce perceived friction in quote completion (qualitative UX feedback).

Secondary optimization signal:

3. Increase quote starts (trigger opens/form starts) after baseline parity is confirmed.

## 9) Release and Risk Notes

- Rollout should support safe replacement strategy (for example via existing gating approach) to minimize regression risk.
- Main risk: breaking analytics or metadata parity while changing UI surface.
- Main mitigation: enforce contract-preservation checks from existing guide during implementation and QA.

## 10) References

- `docs/features/horizon-bulk-discount-dev-guide.md`
- `docs/horizon-os3-cheat-sheet.md`
- `blocks/solstice-quote-form.liquid`
- `snippets/sealant-calculator.liquid`
- `snippets/bulk-discount-form-fields.liquid`
- `assets/bulk-discount-progressive.js`
- `assets/contact-form-tracking.js`
