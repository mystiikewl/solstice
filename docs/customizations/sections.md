# Sections Customizations

## `solstice-mega-nav` (custom header + navigation)

- Files: `sections/solstice-mega-nav.liquid`
- Wired by: `sections/header-group.json` (`"type": "solstice-mega-nav"`)
- Purpose: custom Solstice header + navigation UI.
- Mobile pattern: progressive disclosure (each depth is a “panel” that slides in; back button returns to the previous panel).
- Mobile DOM contract (required by `assets/solstice-mega-nav.js`):
- Drawer root is a `<details>` element with `data-mobile-menu`.
- Hamburger is the `<summary>` inside that details.
- Close affordances are any element with `data-mobile-drawer-close` (overlay + close button).
- Each depth view is a `[data-mobile-panel]` element.
- The currently visible mobile panel is marked with `data-active`.
- Forward navigation controls use `data-mobile-nav-forward` + `aria-controls="<panel-id>"`.
- Back navigation controls use `data-mobile-nav-back` + `aria-controls="<panel-id>"`.
- Implementation notes:
- Root panel is `#mega-nav-mobile-root-{{ section.id }}` and starts with `data-active`.
- Each submenu level is rendered as its own panel `id` and referenced only via `aria-controls`.
- “View all …” links appear when a parent item has a URL and are rendered at the top of that child panel.
- Debug checklist:
- Hamburger opens but nothing changes: confirm CSS for `[data-mobile-panel][data-active]` is visible and siblings are hidden/translated.
- Forward/back does nothing: confirm `aria-controls` points at an existing `id` and the button has `data-mobile-nav-forward` or `data-mobile-nav-back`.
- Drawer closes but gets “stuck”: confirm `data-mobile-menu` is a `<details>` and close elements use `data-mobile-drawer-close` (not `data-drawer-close`).
