# Developer Specification: Simplified Mega Navigation UI/UX

## 1. Document purpose

This specification defines the UI/UX behaviour, layout rules, implementation boundaries, and open questions for a simplified mega navigation system inspired by large retail navigation patterns.

The goal is to align design, development, and stakeholder expectations before implementation.

This is not a content strategy document. The content will come from merchant-selected Shopify navigation menus or standard links.

---

## 2. Product goal

Create a flexible header navigation system where merchants can add multiple top-level navigation entries to the header. Each top-level entry can either:

1. navigate directly to a URL; or
2. open a structured mega navigation panel.

The navigation must work across desktop and mobile using different interaction patterns:

* **Desktop:** horizontal L1 nav with full-width mega panel.
* **Mobile:** drawer navigation with nested accordions.

---

## 3. Scope

### 3.1 In scope

* Desktop horizontal L1 navigation.
* Desktop mega panel that opens below the header.
* Mobile menu drawer.
* Mobile nested accordions.
* Three-level navigation model.
* Merchant-configured L1 navigation entries.
* Shopify menu rendering.
* Direct-link L1 items.
* Keyboard support.
* Basic accessibility attributes.
* Responsive breakpoint behaviour.
* Open/close state handling.
* Focus and scroll handling.

### 3.2 Out of scope for version one

* Promo cards.
* Campaign banners.
* Images inside nav panels.
* Product cards.
* Brand modules.
* Dynamic collections or product data.
* Fourth-level links.
* Nested desktop flyouts.
* Per-link icons.
* Custom visual menu builders.
* Analytics-based ordering.
* Personalised navigation.
* Search suggestions inside the nav panel.

---

## 4. Definitions

| Term        | Meaning                                                       |
| ----------- | ------------------------------------------------------------- |
| L1          | Top-level navigation item rendered in the header              |
| L2          | Group heading inside an opened panel or drawer section        |
| L3          | Link rendered under an L2 group                               |
| Mega panel  | Desktop dropdown panel opened by an L1 trigger                |
| Drawer      | Mobile navigation surface opened by the menu button           |
| Trigger     | A button-like item that opens navigation content              |
| Direct link | A navigation item that links directly without opening a panel |

---

## 5. Navigation hierarchy

The system must support a strict maximum of three rendered levels.

```text
L1: Header navigation item
L2: Group heading inside opened navigation surface
L3: Child links inside the group
```

### 5.1 Required rule

Anything deeper than L3 must not render in version one.

### 5.2 Suggested handling of deeper menu data

If Shopify menu data contains L4 or deeper links:

* ignore deeper links; or
* optionally log/document that unsupported levels are not rendered.

The UI must not create nested flyouts or additional accordion levels beyond L3.

---

## 6. Merchant configuration model

### 6.1 L1 navigation entry

Each merchant-configured L1 entry should support:

| Field        | Required | Notes                                                                           |
| ------------ | -------: | ------------------------------------------------------------------------------- |
| Label        |      Yes | Display text for the L1 item                                                    |
| Link / URL   | Optional | Used when the item should navigate directly or provide a “view all” destination |
| Shopify menu | Optional | If present and contains children, L1 behaves as a trigger                       |

### 6.2 Behaviour based on configuration

| Configuration                | Desktop behaviour                                                              | Mobile behaviour                                                    |
| ---------------------------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| L1 has no menu / no children | Render as direct link                                                          | Render as direct link                                               |
| L1 has menu children         | Render as trigger that opens mega panel                                        | Render as accordion row                                             |
| L1 has menu children and URL | Trigger opens panel; URL may be exposed as a child “View all” link if required | Accordion opens; URL may be exposed as first child link if required |

### 6.3 Decision required

Should an L1 with both a URL and children:

1. open the menu only; or
2. navigate on label click and open from a separate icon; or
3. open the menu and expose the URL as a “View all” link?

Recommended default: **option 3**.

---

## 7. Desktop specification

## 7.1 Desktop header layout

Desktop header should render a horizontal list of L1 items.

Example structure:

```text
[Logo] [L1] [L1] [L1] [L1] [L1]                     [Search] [Account] [Cart]
```

The exact placement of search, account, and cart depends on the existing theme header, but L1 nav should remain visually grouped and scannable.

### Requirements

* L1 items must render in a single horizontal row where space allows.
* L1 items with child navigation must visually indicate they can open.
* L1 direct links must look visually consistent with trigger items.
* L1 overflow handling must be defined for narrow desktop/tablet widths.

### Open questions

1. What breakpoint should switch from desktop nav to mobile drawer?
2. How many L1 items do we expect merchants to use before layout breaks?
3. Should L1 nav wrap, scroll horizontally, collapse into “More”, or switch earlier to mobile drawer?

---

## 7.2 Desktop L1 trigger interaction

When a user activates an L1 trigger:

* the matching mega panel opens below the header;
* the active L1 receives an open/selected state;
* any currently open panel closes;
* focus and ARIA state are updated;
* only one panel may be open at a time.

### Recommended default interaction

Use **click to open** as the baseline.

Hover may be considered later, but the system should not depend on hover for access.

### Trigger events

| Event                       | Behaviour                           |
| --------------------------- | ----------------------------------- |
| Click closed L1 trigger     | Open matching panel                 |
| Click active L1 trigger     | Close panel                         |
| Click different L1 trigger  | Close current panel, open new panel |
| Click L1 direct link        | Navigate                            |
| Escape key                  | Close active panel                  |
| Click outside nav           | Close active panel                  |
| Select panel link           | Navigate and close naturally        |
| Resize to mobile breakpoint | Close active panel                  |

### Open questions

1. Should hover open be supported on desktop?
2. If hover is supported, what delay should be used before closing?
3. Should clicking the active L1 close the panel or keep it open?

---

## 7.3 Desktop mega panel position

The mega panel should open directly below the header and feel physically attached to it.

Preferred structure:

```text
┌─────────────────────────────────────────────────────────────┐
│ Header                                                      │
├─────────────────────────────────────────────────────────────┤
│ Mega panel                                                  │
│                                                             │
│ [Group]       [Group]       [Group]       [Group]            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Requirements

* Panel must appear below the header.
* Panel should align to either the page container or viewport, depending on theme layout.
* Panel should use a solid background.
* Panel should visually separate from page content using border, shadow, or elevation.
* Panel should not behave like a modal.
* Panel should not cover the entire page height unless content requires scroll.

### Open questions

1. Should the panel be full viewport width or constrained to the theme container?
2. Should the panel align with the header content or with the viewport edge?
3. Should page content underneath remain visible?
4. Should an overlay be used behind the desktop panel?

Recommended default: **contained full-width panel aligned with header/container, no overlay**.

---

## 7.4 Desktop mega panel layout

The panel renders L2 groups and L3 links in a grid.

Example:

```text
L1 active item

┌─────────────────────────────────────────────────────────────┐
│ L2 heading       L2 heading       L2 heading       L2 heading│
│ L3 link          L3 link          L3 link          L3 link   │
│ L3 link          L3 link          L3 link          L3 link   │
│ L3 link          L3 link          L3 link          L3 link   │
└─────────────────────────────────────────────────────────────┘
```

### Requirements

* Each L2 item renders as a group heading.
* Each L3 item renders as a standard link below its L2 heading.
* Groups should flow in a responsive grid.
* The panel should support different menu sizes without requiring custom configuration per menu.
* No promotional or image content should render in version one.

### Suggested grid rules

| Number of L2 groups | Suggested layout                                         |
| ------------------: | -------------------------------------------------------- |
|                   1 | Single-column compact panel                              |
|                   2 | Two-column panel                                         |
|                 3–4 | Three or four-column grid                                |
|                 5–8 | Four-column grid with wrapping                           |
|                  9+ | Four-column grid with additional rows or scroll strategy |

### Open questions

1. What is the maximum number of L2 groups we should design for?
2. Should the panel height be content-based or capped?
3. If the panel is capped, should the panel scroll internally?
4. Should very long L3 lists be truncated?
5. Do we need a “View all” link per L2 group?

Recommended default: **content-based height with sensible max-height and internal scroll only if necessary**.

---

## 7.5 Desktop visual hierarchy

Visual priority should be simple and link-first.

Priority order:

1. Active L1 item.
2. L2 group heading.
3. L3 links.

### Requirements

* Active L1 state must be persistent while its panel is open.
* L2 headings must be visually distinct from L3 links.
* L3 links must remain easy to scan.
* Hover and focus states must be visible.
* The nav should feel integrated with the theme, not visually copied from another retailer.

### Suggested states

| Element | State       | Visual treatment                                   |
| ------- | ----------- | -------------------------------------------------- |
| L1      | Default     | Standard header nav style                          |
| L1      | Hover       | Text underline, background, or subtle colour shift |
| L1      | Focus       | Strong visible outline                             |
| L1      | Active/open | Persistent selected state                          |
| L2      | Default     | Semibold or bold text                              |
| L3      | Default     | Standard link text                                 |
| L3      | Hover/focus | Underline or subtle background                     |

---

## 8. Mobile specification

## 8.1 Mobile header layout

Mobile header should replace the horizontal L1 navigation with a menu button.

Example:

```text
[Menu] [Logo]                              [Search] [Cart]
```

### Requirements

* Horizontal L1 nav must be hidden on mobile.
* Menu button must be visible.
* Menu button must open the mobile drawer.
* Existing header actions should remain available unless intentionally moved into the drawer.

### Open questions

1. Which breakpoint should activate mobile nav?
2. Should search stay in the header or move into the drawer?
3. Should account links appear in the drawer?

---

## 8.2 Mobile drawer layout

The mobile drawer is the primary navigation surface on small screens.

Preferred structure:

```text
┌──────────────────────────┐
│ Close                    │
│ Search, if included       │
├──────────────────────────┤
│ L1 item              +   │
│ L1 item              +   │
│ L1 direct link           │
│ L1 item              +   │
└──────────────────────────┘
```

### Requirements

* Drawer opens from the left or covers the screen.
* Drawer must have a close control.
* Drawer content must scroll independently if needed.
* Background page scroll must be locked while drawer is open.
* Focus should move into the drawer when opened.
* Focus should return to the menu button when closed.

### Open questions

1. Should the drawer slide from the left or open full-screen?
2. Should the drawer width be fixed, percentage-based, or full width?
3. Should an overlay appear behind the drawer?

Recommended default: **left-side drawer with overlay, full height, width around 85–90% on mobile**.

---

## 8.3 Mobile accordion model

Mobile navigation should use progressive disclosure.

```text
L1 item +
  L2 group +
    L3 link
    L3 link
    L3 link
  L2 group +
    L3 link
    L3 link
```

### Requirements

* L1 items with children render as accordion triggers.
* L1 items without children render as direct links.
* L2 items with children render as nested accordion triggers.
* L3 items render as direct links.
* No additional nested levels render.
* Accordion state must be reflected with `aria-expanded`.

### Accordion behaviour

| Event              | Behaviour                           |
| ------------------ | ----------------------------------- |
| Tap collapsed L1   | Expand L1 section                   |
| Tap expanded L1    | Collapse L1 section                 |
| Tap collapsed L2   | Expand L2 section                   |
| Tap expanded L2    | Collapse L2 section                 |
| Tap L3 link        | Navigate                            |
| Tap direct L1 link | Navigate                            |
| Escape             | Close drawer                        |
| Resize to desktop  | Close drawer and reset mobile state |

### Open questions

1. Should multiple L1 accordions be open at once?
2. Should multiple L2 accordions be open at once?
3. Should opening one L1 collapse the others?
4. Should accordion state persist if the drawer is closed and reopened?

Recommended default: **allow only one L1 open at a time; allow multiple L2 groups open inside the active L1**.

---

## 9. Responsive behaviour

### 9.1 Breakpoint recommendation

Initial recommendation:

|   Viewport width | Navigation pattern                  |
| ---------------: | ----------------------------------- |
| 1024px and above | Desktop horizontal nav + mega panel |
|     Below 1024px | Mobile drawer + accordions          |

This may need adjustment based on actual header density and merchant L1 count.

### 9.2 Desktop to mobile transition

When viewport changes from desktop to mobile:

* close any open desktop panel;
* clear active L1 desktop state;
* hide horizontal nav;
* show mobile menu button;
* ensure no panel remains focusable.

### 9.3 Mobile to desktop transition

When viewport changes from mobile to desktop:

* close mobile drawer;
* unlock page scroll;
* remove drawer overlay;
* clear or reset accordion state;
* show horizontal nav.

---

## 10. Accessibility requirements

## 10.1 Desktop

Desktop L1 triggers should use:

* `button` element when opening a panel;
* `a` element when navigating directly;
* `aria-expanded` on panel triggers;
* `aria-controls` linking the trigger to the panel;
* hidden/inert handling when panels are closed;
* Escape key support;
* visible focus indicators.

### Requirement

Do not use `role="menu"` unless implementing the full ARIA menu pattern. This navigation is site navigation, not an application menu.

## 10.2 Mobile

Mobile drawer and accordions should support:

* focus moved into drawer on open;
* focus returned to menu button on close;
* focus trap while drawer is open;
* close button first or near-first in focus order;
* `aria-expanded` on accordion triggers;
* `aria-controls` for controlled regions;
* Escape key support;
* background scroll lock.

## 10.3 Reduced motion

All transitions must respect `prefers-reduced-motion`.

---

## 11. Animation requirements

Animations should be subtle and functional.

### Desktop

Recommended:

* fade in panel;
* small vertical offset, 4–8px maximum;
* 120–180ms duration.

Avoid:

* large slides;
* delayed hover reveal;
* staggered column animations.

### Mobile

Recommended:

* drawer slide-in;
* accordion height transition or instant expand;
* 180–240ms duration.

Avoid:

* complex nested animations;
* slow drawer transitions;
* motion that delays navigation.

---

## 12. State management

### 12.1 Desktop state

Required state:

```text
activeDesktopNavId
isDesktopPanelOpen
```

Rules:

* only one desktop panel may be active;
* opening a panel closes the previous panel;
* direct links do not affect panel state except by navigating;
* clicking outside clears active state;
* Escape clears active state.

### 12.2 Mobile state

Required state:

```text
isDrawerOpen
activeMobileL1Id
activeMobileL2Ids
```

Recommended rules:

* one L1 section open at a time;
* multiple L2 sections may be open inside the active L1;
* closing the drawer may reset all accordion state.

### 12.3 State reset events

State should reset on:

* route/navigation change;
* viewport mode change;
* drawer close, if agreed;
* Escape key;
* clicking outside desktop panel.

---

## 13. Rendering logic

## 13.1 Desktop rendering

```text
For each configured L1 entry:
  If entry has child menu:
    Render L1 button trigger
    Render associated hidden mega panel
      For each L2 menu item:
        Render L2 heading
        Render L3 links
  Else:
    Render L1 direct link
```

## 13.2 Mobile rendering

```text
Render drawer
  For each configured L1 entry:
    If entry has child menu:
      Render L1 accordion trigger
      Render L1 accordion content
        For each L2 menu item:
          If L2 has child links:
            Render L2 accordion trigger
            Render L3 links
          Else:
            Render L2 as direct link
    Else:
      Render L1 direct link
```

## 13.3 Empty states

| Scenario                    | Expected behaviour                                                   |
| --------------------------- | -------------------------------------------------------------------- |
| L1 has no label             | Do not render, or fallback to menu title if available                |
| L1 has no menu but has URL  | Render direct link                                                   |
| L1 has menu but no children | Render direct link if URL exists; otherwise do not render as trigger |
| L2 has no L3 links          | Render L2 as direct link if URL exists                               |
| Menu includes L4 links      | Do not render L4                                                     |

---

## 14. CSS/layout requirements

### 14.1 Desktop

* Panel layout should use CSS Grid.
* Grid should support wrapping rows.
* L2 groups should not require fixed heights.
* Panel should be positioned predictably relative to the header.
* Panel should have a defined z-index layer above page content.

### 14.2 Mobile

* Drawer should use fixed positioning.
* Drawer should use full viewport height.
* Drawer content area should scroll independently.
* Overlay should sit below drawer and above page content.
* Body scroll lock should avoid layout shift where possible.

### 14.3 CSS custom properties

Recommended variables:

```css
--mega-nav-bg;
--mega-nav-text;
--mega-nav-border;
--mega-nav-shadow;
--mega-nav-link-hover-bg;
--mega-nav-active-bg;
--mega-nav-active-text;
--mobile-drawer-bg;
--mobile-drawer-width;
--mobile-drawer-overlay;
```

---

## 15. JavaScript requirements

JavaScript should control interaction state only.

### Required responsibilities

* Open/close desktop panels.
* Toggle active L1 states.
* Close panel on outside click.
* Close panel on Escape.
* Open/close mobile drawer.
* Toggle mobile accordions.
* Manage `aria-expanded`.
* Manage focus movement for drawer.
* Lock/unlock body scroll.
* Reset state on breakpoint change.

### Not responsible for

* Building menu content from scratch.
* Fetching navigation data dynamically.
* Rendering product data.
* Personalisation.
* Promo logic.

---

## 16. QA checklist

### Desktop QA

* L1 direct links navigate correctly.
* L1 triggers open the correct panel.
* Only one panel opens at a time.
* Active L1 state is visible.
* Panel closes on outside click.
* Panel closes on Escape.
* Panel closes when another L1 opens.
* Panel does not remain open after switching to mobile.
* Panel supports menus with few groups.
* Panel supports menus with many groups.
* Keyboard tab order is logical.
* Focus states are visible.

### Mobile QA

* Menu button opens drawer.
* Drawer close button works.
* Overlay click closes drawer, if overlay is used.
* Background page does not scroll while drawer is open.
* Drawer content scrolls when long.
* L1 accordions open and close correctly.
* L2 accordions open and close correctly.
* L3 links navigate correctly.
* Drawer closes or resets correctly after navigation.
* Escape closes drawer.
* Focus returns to menu button after close.
* Drawer closes when viewport changes to desktop.

### Accessibility QA

* L1 triggers expose correct expanded/collapsed state.
* Accordion triggers expose correct expanded/collapsed state.
* Closed panels are not focusable.
* Drawer traps focus while open.
* Keyboard-only use is possible.
* Reduced motion is respected.
* Screen reader labels are meaningful.

### Content edge-case QA

* Empty L1 does not render broken UI.
* L1 with no children behaves as direct link.
* L2 with no children behaves appropriately.
* L4 links do not render.
* Long labels wrap or truncate safely.
* Many L1 items do not break the header.

---

## 17. Key implementation decisions to confirm

These are the main questions for the development/design alignment round.

### Desktop

1. What breakpoint should switch desktop nav to mobile drawer?
2. Should desktop activation be click-only or hover + click?
3. Should the mega panel be full viewport width or container width?
4. Should desktop use an overlay behind the panel?
5. Should panel height be capped?
6. Should very long link groups be truncated?
7. Should L1 items with URLs expose a “View all” link?
8. How should L1 overflow be handled?

### Mobile

1. Should the drawer slide from the left or open full-screen?
2. Should the drawer include search?
3. Should account/utility links appear in the drawer?
4. Should one or multiple L1 accordions be open at once?
5. Should one or multiple L2 accordions be open at once?
6. Should accordion state reset when the drawer closes?
7. Should tapping overlay close the drawer?

### Technical

1. Should this extend the existing Horizon header or use a custom header section?
2. How should unsupported L4 links be handled?
3. Should the section schema prevent unsupported depth, or only ignore it at render time?
4. Do we need theme editor guidance/warnings?
5. Should the component be built as a reusable snippet or tightly inside the header section?

---

## 18. Recommended defaults

Unless the team decides otherwise, build with the following defaults:

| Area                     | Recommendation                                    |
| ------------------------ | ------------------------------------------------- |
| Desktop activation       | Click to open                                     |
| Desktop panel width      | Container-aligned full-width panel                |
| Desktop overlay          | No overlay                                        |
| Mobile pattern           | Left drawer with overlay                          |
| Mobile drawer width      | 85–90% viewport width                             |
| Navigation depth         | L1/L2/L3 only                                     |
| L4 links                 | Do not render                                     |
| L1 with URL and children | Open panel; expose URL as “View all” if needed    |
| L1 accordion behaviour   | One L1 open at a time                             |
| L2 accordion behaviour   | Multiple L2 sections can be open                  |
| Animation                | Short, subtle transitions                         |
| Accessibility model      | Disclosure buttons and links, not ARIA menu roles |

---

## 19. Development-ready acceptance criteria

The feature is considered ready when the following are true.

### Functional

* Merchant can configure multiple L1 navigation entries.
* Each L1 entry can render as either a direct link or a trigger.
* Desktop triggers open the correct panel.
* Desktop panels render L2 groups and L3 links.
* Mobile drawer renders L1/L2 accordions and L3 links.
* Only three levels render.
* Unsupported deeper links do not break the layout.

### UX

* Desktop interaction is predictable using mouse and keyboard.
* Mobile interaction is predictable using touch and keyboard.
* Open and close behaviours are consistent.
* Layout remains usable with short and long menus.
* Navigation does not rely on hover only.

### Accessibility

* Trigger states are announced correctly.
* Closed content is not focusable.
* Drawer focus is managed correctly.
* Escape key works.
* Focus styles are visible.
* Reduced motion is respected.

### Technical

* Menu content is rendered server-side from Shopify menu data.
* JavaScript only manages interactivity.
* CSS is scoped and tokenised.
* Component does not introduce promo/content complexity.
* Implementation remains maintainable within the Horizon theme structure.

---

## 20. Next review agenda

Use this agenda to facilitate the team iteration session.

1. Confirm desktop breakpoint.
2. Confirm click vs hover behaviour.
3. Confirm panel width and alignment.
4. Confirm mobile drawer style.
5. Confirm accordion behaviour.
6. Confirm handling of L1 items with both URL and children.
7. Confirm max expected menu size.
8. Confirm how to handle unsupported deeper links.
9. Confirm whether to extend Horizon header or create a custom header variant.
10. Convert decisions into implementation tickets.

---

## 21. Suggested implementation tickets

### Ticket 1: Header L1 rendering

Render merchant-configured L1 navigation entries in the desktop header and mobile drawer.

### Ticket 2: Desktop mega panel

Render and style the desktop mega panel from menu data.

### Ticket 3: Desktop interaction controller

Implement open, close, outside-click, Escape, and active-state handling.

### Ticket 4: Mobile drawer

Implement drawer open/close, overlay, body scroll lock, and focus handling.

### Ticket 5: Mobile accordion navigation

Render and control L1/L2 accordion behaviour.

### Ticket 6: Accessibility pass

Validate keyboard behaviour, ARIA state, focus management, and reduced motion.

### Ticket 7: Responsive and edge-case QA

Test menu sizes, long labels, missing data, unsupported depth, and breakpoint transitions.

---

## 22. Final implementation principle

Build the navigation as a UI pattern with a strict rendering contract:

```text
Merchant-selected L1 entries
  → optional menu children
    → desktop mega panel or mobile accordion
      → maximum three rendered levels
```

Avoid adding content modules or builder complexity until the core navigation pattern is implemented, tested, and approved.
