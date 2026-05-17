# Solstice - Shopify Horizon Theme Fork

Custom theme built on top of Shopify's Horizon (v3.4.0).

## Architecture

Horizon is a JSON template theme. Structure:
- `templates/` - JSON template definitions
- `sections/` - Section schemas + Liquid markup
- `snippets/` - Reusable Liquid partials
- `blocks/` - Custom blocks
- `assets/` - CSS, JS, images, fonts
- `config/` - Theme settings (schema + data)
- `locales/` - Translation files
- `layout/` - Layout wrappers (theme.liquid)

## Development Commands

```bash
# Start dev server (requires shopify CLI + store)
shopify theme dev --store YOUR_STORE

# Push theme to production
shopify theme push

# Pull latest from store
shopify theme pull

# Lint Liquid
shopify theme check
```

## Conventions

- **Do not edit** upstream Horizon sections/snippets directly - create overrides in custom files
- Custom sections/snippets should be prefixed to distinguish from upstream
- `config/settings_data.json` is gitignored - use `settings_schema.json` for defaults
- Test all changes with `shopify theme check` before pushing

## Upstream Sync

To pull upstream Horizon updates:
```bash
git remote add upstream https://github.com/Shopify/horizon.git
git fetch upstream
git merge upstream/main
```

Resolve conflicts carefully - prefer upstream changes for shared files.

## Agent skills

### Issue tracker

Issues tracked in GitHub (mystiikewl/solstice). See `docs/agents/issue-tracker.md`.

### Triage labels

Default vocabulary: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — CONTEXT.md + docs/adr/ at repo root. See `docs/agents/domain.md`.
