```yaml
id: 2026-05-18-002
type: refactor
title: Bulk quote trigger-to-sheet refactor with contract parity
status: active
created: 2026-05-18
origin: docs/brainstorms/2026-05-18-bulk-quote-sheet-requirements.md
```

# Bulk Quote Trigger-to-Sheet Refactor with Contract Parity

## Summary

Replace the inline PDP quote form with a trigger-to-sheet interaction while preserving current quote behavior contracts. The refactor must support both quote variants by product context, keep progressive two-step behavior, and preserve tracking/metadata parity to avoid submission and analytics regressions (see origin: `docs/brainstorms/2026-05-18-bulk-quote-sheet-requirements.md`).

---

## Problem Frame

- Current inline progressive expansion creates page-length and layout-shift friction on PDPs.
- Users report lower scanability and unstable-feeling interaction as fields expand vertically.
- Product goal is to maintain submission performance while reducing friction and improving quote starts.

---

## Scope Boundaries

### In Scope

- Trigger -> sheet quote UX on PDP (desktop right sheet, mobile bottom sheet).
- Variant-aware quote rendering:
  - `bulk-discount` products show bulk-discount quote variant.
  - Other products show general quote enquiry variant.
- Flat single-stage form (no progressive step; fields extracted to shared snippet).
- Expanded industry dropdown value set (23 trade-specific options + Other).
- Preserve native contact form submission and refresh-based success state.
- Preserve tracking/data contract and variant-context sync behavior.

### Deferred to Follow-Up Work

- Post-rollout optimization experiments for quote-start growth (copy tests, trigger placement tests, multi-entry experiments).
- Additional quote enrichment fields or attachment workflows.

### Out of Scope

- Backend routing/form transport redesign.
- Analytics taxonomy redesign (event renames or attribution model change).

---

## Research Highlights

- Reusable dialog/drawer patterns already exist in:
  - `assets/dialog.js`
  - `assets/cart-drawer.js`
  - `snippets/header-actions.liquid`
  - `snippets/sealant-calculator.liquid`
- Current quote implementation baseline is in:
  - `blocks/solstice-quote-form.liquid`
  - `snippets/quote-form.liquid`
  - `assets/component-quote-form.js`
- OS3 conventions require composition-first customization and small, focused component boundaries (`docs/horizon-os3-cheat-sheet.md`).
- Institutional learnings emphasize JS lifecycle safety and stable DOM/selector contracts during interactive refactors (`docs/solutions/runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md`).

---

## Key Technical Decisions

1. **Adopt drawer/sheet behavior patterns, not cart state coupling.**
   - Mirror interaction semantics from existing cart/calculator patterns.
   - Keep quote state isolated in a dedicated quote component.

2. **Refactor via composition split.**
   - Keep block thin and delegate rendering to focused snippets (trigger, sheet container, form fields).
   - Keep a single interactive concern in quote sheet controller JS.

3. **Contract parity is a release gate.**
   - No rollout unless metadata keys, progressive behavior, and analytics signals are verified equivalent.

4. **Two-variant rendering remains product-tag-driven.**
   - Exactly one variant should render per PDP, with no dual-render edge case.

5. **Roll out behind reversible gating.**
   - Use feature gating path (theme setting and/or product tag strategy) to reduce regression blast radius.

---

## Implementation Units

### U1. Establish quote sheet composition surfaces

**Goal:** Introduce trigger + sheet render surfaces and move quote block to a composition-first structure without changing form contract yet.

**Requirements:**
- Trigger and sheet surface pattern (origin Sections 4, 5).
- OS3 composition-first architecture guardrails (origin Section 7).

**Dependencies:** None.

**Files:**
- `blocks/solstice-quote-form.liquid` - modify
- `snippets/quote-form-trigger.liquid` - create
- `snippets/quote-form-sheet.liquid` - create
- `snippets/quote-form.liquid` - modify (delegate orchestration)

**Approach:**
- Convert the block to a thin pass-through that renders quote orchestration snippet(s).
- Add a compact trigger snippet with accessible control relationships (`aria-controls`, expanded state signaling).
- Add a sheet container snippet with dialog semantics and dedicated close control hooks.

**Patterns to follow:**
- `snippets/sealant-calculator.liquid`
- `snippets/popup-link.liquid`
- `snippets/header-actions.liquid`

**Test scenarios:**
1. Trigger renders once on PDP and is visible in both quote modes.
2. Trigger opens quote sheet on click and sheet closes via close button.
3. Sheet uses dialog semantics (`role`, `aria-modal`, labelled title) and does not render both variants simultaneously.

**Verification:**
- Merchant preview shows one trigger and one sheet surface per PDP.
- No Liquid/schema rendering errors in Theme Check.

---

### U2. Implement quote sheet interaction controller with accessibility parity

**Goal:** Add a dedicated quote sheet controller that handles open/close behavior, Escape/click-outside dismissal, and focus return safely.

**Requirements:**
- Desktop right sheet + mobile bottom sheet behavior (origin Section 5).
- Close/focus behavior parity with established interaction patterns (origin Sections 4, 5).

**Dependencies:** U1.

**Files:**
- `assets/component-quote-sheet.js` - create
- `snippets/quote-form-sheet.liquid` - modify
- `snippets/quote-form-trigger.liquid` - modify

**Approach:**
- Build quote sheet controller on top of established dialog conventions.
- Keep listener lifecycle explicit (`connectedCallback`/`disconnectedCallback` parity and bound-handler cleanup).
- Ensure close paths normalize to one route so focus restoration and state cleanup are consistent.

**Execution note:** Prioritize characterization-first checks against existing dialog behavior patterns before adding any custom dismissal logic.

**Patterns to follow:**
- `assets/dialog.js`
- `assets/cart-drawer.js`
- `docs/solutions/runtime-errors/six-js-component-lifecycle-bugs-2026-05-18.md`

**Test scenarios:**
1. Open via trigger sets expanded state correctly and locks background scroll as expected.
2. Escape closes sheet and restores focus to trigger.
3. Clicking outside closes sheet without leaving stale open state.
4. Repeated open/close cycles do not create duplicate listeners or broken focus behavior.
5. Mobile viewport renders bottom-sheet behavior; desktop viewport renders right-sheet behavior.

**Verification:**
- Keyboard-only walkthrough passes (open, tab navigation, close, focus return).
- No console/runtime errors during repeated lifecycle transitions.

---

### U3. Preserve and adapt progressive quote form behavior inside sheet

**Goal:** Move the existing progressive quote form flow into the sheet context while preserving behavior parity and form field contract.

**Requirements:**
- Flat single-stage form (progressive step removed; fields extracted to shared snippet).
- Updated industry dropdown with expanded 23-option value set (origin Section 4 updated).
- Preserve success/error handling within quote surface context (origin Section 5).

**Dependencies:** U1, U2.

**Files:**
- `snippets/quote-form.liquid` - modify
- `assets/component-quote-form.js` - modify

**Approach:**
- Keep existing contact form shape and field names intact.
- Scope step logic to the quote sheet form root to avoid selector collisions.
- Preserve step transition rules: required validation, Enter advance behavior, error re-open behavior, and collapsed-step disable behavior.

**Patterns to follow:**
- `snippets/quote-form.liquid`
- `assets/component-quote-form.js`
- `docs/features/horizon-bulk-discount-dev-guide.md`

**Test scenarios:**
1. Step 1 required fields block advance until valid.
2. Enter key on Step 1 advances only when validation passes.
3. Back action returns to Step 1 with stable state.
4. Step 2 remains hidden/disabled until advanced.
5. Server-side validation error reload reopens Step 2 so user can correct and resubmit.
6. Success message appears after contact post refresh in the quote experience.

**Verification:**
- Progressive flow behaves equivalently to legacy from user perspective.
- No regressions in field presence/order and required behavior.

---

### U4. Enforce variant branching and metadata contract parity

**Goal:** Ensure both quote modes remain product-context-driven and preserve metadata/hidden field compatibility.

**Requirements:**
- Exactly one variant rendered per PDP based on product tag (origin Sections 4, 5).
- Preserve hidden metadata contract keys and values (origin Section 6).
- Preserve variant context sync behavior in submission payload (origin Section 6).

**Dependencies:** U3.

**Files:**
- `snippets/quote-form.liquid` - modify
- `snippets/quote-form-sheet.liquid` - modify
- `snippets/bulk-discount-form-fields.liquid` - modify (if reused directly)

**Approach:**
- Implement explicit branching for bulk-discount vs general inquiry variant content.
- Keep hidden field key names and value semantics contract-compatible.
- Ensure selected variant context is synchronized before submit when applicable.

**Patterns to follow:**
- `docs/features/horizon-bulk-discount-dev-guide.md`
- `snippets/bulk-discount.liquid`
- `snippets/bulk-discount-cta.liquid`

**Test scenarios:**
1. Product with `bulk-discount` tag shows bulk-discount variant only.
2. Product without tag shows general enquiry variant only.
3. Hidden metadata keys are present and populated as expected in both variants.
4. Selected variant context is reflected correctly in submission metadata.

**Verification:**
- Contract-parity checklist passes for both variant paths.

---

### U5. Preserve quote analytics/tracking contract and rollout safety

**Goal:** Maintain existing quote analytics semantics during the UX refactor and ship with reversible rollout controls.

**Requirements:**
- Preserve quote tracking event contract (origin Section 6).
- Support safe replacement strategy for rollout (origin Section 9).

**Dependencies:** U4.

**Files:**
- `assets/contact-form-tracking.js` - modify (if present/active in current branch)
- `assets/component-quote-sheet.js` - modify
- `snippets/quote-form-sheet.liquid` - modify
- `config/settings_schema.json` - modify (if theme setting gate is chosen)
- `docs/features/horizon-bulk-discount-dev-guide.md` - modify (contract refresh)

**Approach:**
- Validate actual live tracking surface in current repo and align quote sheet hooks to the same event contract.
- Add rollout gate aligned with existing deployment habits (theme setting and/or product-tag gate).
- Document the final parity checks so rollout approval has explicit criteria.

**Patterns to follow:**
- `docs/features/horizon-bulk-discount-dev-guide.md`
- `docs/horizon-os3-cheat-sheet.md`

**Test scenarios:**
1. Quote view/start/submit-attempt signals fire with unchanged event names.
2. Success signal still restores correctly after refresh flow.
3. With feature gate off, legacy/previous quote path remains available.
4. With feature gate on, trigger->sheet flow is active and stable across both variants.

**Verification:**
- Analytics parity checklist signed off.
- Rollback path verified before enabling by default.

---

### U6. Validation and documentation alignment

**Goal:** Complete quality gates and update customization documentation so the refactor is maintainable.

**Requirements:**
- Run required Theme Check and smoke validation before merge (origin Section 7 constraints).
- Keep repo docs aligned with implemented architecture.

**Dependencies:** U1, U2, U3, U4, U5.

**Files:**
- `docs/customizations/assets.md` - modify
- `docs/customizations/sections.md` - modify
- `docs/customizations/upstream-sync-log.md` - modify (only if any upstream core file override is required)

**Approach:**
- Perform PDP smoke coverage for keyboard/mouse, mobile/desktop, variant branches, submit success/error.
- Update docs to reflect quote sheet architecture and active assets/snippets.

**Test scenarios:**
1. Theme Check passes with no new errors.
2. PDP smoke for quote sheet passes on desktop and mobile breakpoints.
3. Submission success and server-error paths behave correctly for both variants.

**Verification:**
- Validation gates pass and docs reflect current architecture boundaries.

---

## System-Wide Impact

- **Merchants:** Cleaner PDP quote entry with reduced visual clutter.
- **Shoppers:** Lower-friction quote interaction while preserving existing form expectations.
- **Engineering/maintenance:** Better separation of concerns and safer future iteration via composition-first split.
- **Analytics stakeholders:** Contract parity reduces reporting discontinuity risk.

---

## Risks and Mitigations

1. **Contract drift risk (highest):** tracking/hidden field mismatches after UI move.
   - Mitigation: treat parity checklist as release gate; verify both variant paths.
2. **Lifecycle regressions in sheet controller:** duplicate listeners or broken close/focus behavior.
   - Mitigation: follow lifecycle learnings doc and dialog pattern reuse.
3. **Branching regressions:** accidental dual-render or wrong variant shown.
   - Mitigation: explicit tag-branch checks and dedicated variant test scenarios.
4. **Doc drift risk:** guide and customization docs diverge from implementation.
   - Mitigation: doc update unit included in same delivery scope.

---

## Dependencies and Sequencing

- Sequential dependencies are intentional:
  - U1 -> U2 -> U3 -> U4 -> U5 -> U6
- Critical path rationale:
  - Surface scaffolding before behavior logic.
  - Form parity before tracking parity.
  - Validation/docs only after contract and rollout decisions are complete.

---

## Assumptions

- Existing quote tracking surface remains available or can be matched without event taxonomy change.
- Current contact form refresh flow remains acceptable for this refactor release.
- Feature gating can be implemented without requiring platform-level changes outside this repo.
