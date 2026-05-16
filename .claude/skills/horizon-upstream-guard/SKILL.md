---
name: horizon-upstream-guard
description: Enforce upstream-safe customization patterns for Horizon so updates from Shopify remain clean and rebaseable.
---

# Horizon Upstream Guard

Use this skill whenever work might touch upstream-tracked files.

## Use When

- Modifying `sections/*.liquid`, `blocks/*.liquid`, `snippets/*.liquid`, `assets/*.js`, or `assets/*.css`.
- Preparing to sync with `upstream`.
- Reviewing a PR for mergeability risk.

## Workflow

1. Check if target file is custom in `.upstream-baseline.json` (`custom_files`).
2. If not custom, run `/safe-customize` and edit the custom copy.
3. Prefer composition/wiring over direct core replacement.
4. If core edit is unavoidable, keep diff minimal and log before merge:
   - `docs/customizations/upstream-sync-log.md`
   - include feature, rationale, baseline commit, custom commit, diff anchors, reapply, rollback, validation evidence.
5. Ensure customization registry entry exists in relevant `docs/customizations/*` ledger.

## Mandatory Outputs

- Confirmation of custom-vs-core file status.
- Safe customization path chosen (or justified exception).
- Ledger updates proving mergeability discipline.
