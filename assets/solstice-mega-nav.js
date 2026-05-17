const BC = 'mega-nav';
const MOBILE_BP = 750;

class MegaNavHeader extends HTMLElement {
  #abort;
  #triggers;
  #panels;
  #panelsContainer;
  #activeTrigger;
  #activePanel;
  #drawer;
  #drawerTrigger;

  constructor() {
    super();
    this.#abort = new AbortController();
    this.#triggers = [];
    this.#panels = [];
    this.#activeTrigger = null;
    this.#activePanel = null;
    this.#drawer = null;
    this.#drawerTrigger = null;
  }

  connectedCallback() {
    this.#abort?.abort();
    this.#abort = new AbortController();

    this.#panelsContainer = this.querySelector(`[data-mega-panels]`);
    this.#triggers = [...this.querySelectorAll(`[data-mega-trigger]`)];
    this.#panels = [...this.querySelectorAll(`[data-mega-panel]`)];
    this.#drawer = this.querySelector(`[data-drawer]`);
    this.#drawerTrigger = this.querySelector(`[data-drawer-trigger]`);

    window.requestAnimationFrame(() => {
      this.#panelsContainer?.removeAttribute('hidden');
      this.#panels.forEach((p) => p.setAttribute('inert', ''));
    });

    this.#triggers.forEach((trigger) => {
      trigger.addEventListener('click', this.#onTriggerClick.bind(this), {
        signal: this.#abort.signal,
      });
    });

    this.addEventListener(
      'keydown',
      (e) => {
        if (e.key !== 'Escape') return;

        const mobileMenu = this.querySelector(`[data-mobile-menu]`);
        if (mobileMenu?.hasAttribute('open')) {
          this.#closeMobileMenu(mobileMenu);
        } else if (this.#drawer?.hasAttribute('open')) {
          this.#closeDrawer();
        } else {
          this.#closePanel();
        }
      },
      { signal: this.#abort.signal },
    );

    document.addEventListener(
      'click',
      (e) => {
        if (!this.contains(e.target)) {
          this.#closePanel();
        }
      },
      { signal: this.#abort.signal },
    );

    this.#drawerTrigger?.addEventListener(
      'click',
      () => this.#openDrawer(),
      { signal: this.#abort.signal },
    );

    const drawerCloseEls = [
      ...this.querySelectorAll(`[data-drawer-close]`),
      ...this.querySelectorAll(`[data-drawer-overlay]`),
    ];

    drawerCloseEls.forEach((el) => {
      el.addEventListener(
        'click',
        () => this.#closeDrawer(),
        { signal: this.#abort.signal },
      );
    });

    const mobileMenu = this.querySelector(`[data-mobile-menu]`);
    this.querySelectorAll(`[data-mobile-drawer-close]`).forEach((el) => {
      el.addEventListener(
        'click',
        () => this.#closeMobileMenu(mobileMenu),
        { signal: this.#abort.signal },
      );
    });

    mobileMenu?.addEventListener(
      'toggle',
      () => {
        if (!mobileMenu.hasAttribute('open')) {
          this.#resetMobileMenu(mobileMenu);
        }
      },
      { signal: this.#abort.signal },
    );

    this.querySelectorAll(`[data-mobile-nav-forward], [data-mobile-nav-back]`).forEach((el) => {
      el.addEventListener(
        'click',
        (e) => this.#showMobilePanel(e),
        { signal: this.#abort.signal },
      );
    });

    this.#initAccordions();
    this.#initL2Triggers();
    this.#initL3Triggers();

    window.matchMedia(`(max-width: ${MOBILE_BP - 1}px)`)
      .addEventListener(
        'change',
        () => {
          this.#closePanel();
          this.#closeDrawer();
        },
        { signal: this.#abort.signal },
      );

    this.addEventListener('keydown', (e) => this.#trapFocus(e), {
      signal: this.#abort.signal,
    });
  }

  disconnectedCallback() {
    this.#abort.abort();
  }

  #initAccordions() {
    const l1Triggers = [
      ...this.querySelectorAll(
        `.mega-nav__drawer-list > .mega-nav__drawer-item > [data-accordion-trigger]`,
      ),
    ];

    l1Triggers.forEach((trigger) => {
      trigger.addEventListener(
        'click',
        (e) => {
          const btn = e.currentTarget;
          const panel = btn.nextElementSibling;

          if (!panel || panel.getAttribute('data-accordion-panel') === null)
            return;

          const isOpen = btn.getAttribute('aria-expanded') === 'true';

          if (isOpen) {
            btn.setAttribute('aria-expanded', 'false');
            panel.setAttribute('hidden', '');
            this.#resetDrawerDescendants(panel);
            return;
          }

          l1Triggers.forEach((t) => {
            const p = t.nextElementSibling;
            if (p && p.getAttribute('data-accordion-panel') !== null) {
              t.setAttribute('aria-expanded', 'false');
              p.setAttribute('hidden', '');
              this.#resetDrawerDescendants(p);
            }
          });

          btn.setAttribute('aria-expanded', 'true');
          panel.removeAttribute('hidden');
        },
        { signal: this.#abort.signal },
      );
    });

    const nestedTriggers = [
      ...this.querySelectorAll(
        `.mega-nav__drawer-sublist > li > [data-accordion-trigger]`,
      ),
    ];

    nestedTriggers.forEach((trigger) => {
      trigger.addEventListener(
        'click',
        (e) => {
          const btn = e.currentTarget;
          const panel = btn.nextElementSibling;

          if (!panel || panel.getAttribute('data-accordion-panel') === null)
            return;

          const isOpen = btn.getAttribute('aria-expanded') === 'true';

          if (isOpen) {
            btn.setAttribute('aria-expanded', 'false');
            panel.setAttribute('hidden', '');
            this.#resetDrawerDescendants(panel);
          } else {
            btn.setAttribute('aria-expanded', 'true');
            panel.removeAttribute('hidden');
          }
        },
        { signal: this.#abort.signal },
      );
    });
  }

  #resetDrawerDescendants(rootPanel) {
    if (!rootPanel) return;

    const descendants = [
      ...rootPanel.querySelectorAll(`[data-accordion-trigger]`),
    ];

    descendants.forEach((trigger) => {
      trigger.setAttribute('aria-expanded', 'false');
      const panel = trigger.nextElementSibling;
      if (panel && panel.getAttribute('data-accordion-panel') !== null) {
        panel.setAttribute('hidden', '');
      }
    });
  }

  #showMobilePanel(e) {
    const control = e.currentTarget;
    const panelId = control.getAttribute('aria-controls');
    if (!panelId) return;

    const menu = control.closest(`[data-mobile-menu]`);
    const targetPanel = this.querySelector(`#${CSS.escape(panelId)}`);
    if (!menu || !targetPanel) return;

    menu.querySelectorAll(`[data-mobile-panel]`).forEach((panel) => {
      panel.removeAttribute('data-active');
    });

    targetPanel.setAttribute('data-active', '');
  }

  #closeMobileMenu(menu) {
    if (!menu) return;

    menu.removeAttribute('open');
    this.#resetMobileMenu(menu);
  }

  #resetMobileMenu(menu) {
    if (!menu) return;

    const panels = [...menu.querySelectorAll(`[data-mobile-panel]`)];
    panels.forEach((panel, index) => {
      if (index === 0) {
        panel.setAttribute('data-active', '');
      } else {
        panel.removeAttribute('data-active');
      }
    });
  }

  #initL2Triggers() {
    const triggers = [...this.querySelectorAll(`[data-l2-trigger]`)];
    triggers.forEach((t) => {
      t.addEventListener('click', (e) => this.#onL2Click(e), {
        signal: this.#abort.signal,
      });
    });
  }

  #initL3Triggers() {
    const triggers = [...this.querySelectorAll(`[data-l3-trigger]`)];
    triggers.forEach((t) => {
      t.addEventListener('click', (e) => this.#onL3Click(e), {
        signal: this.#abort.signal,
      });
    });
  }

  #onL2Click(e) {
    const btn = e.currentTarget;
    const l3Id = btn.getAttribute('aria-controls');
    if (!l3Id) return;

    const panelList = btn.closest(`[data-panel-list]`);
    const l3Area = panelList?.querySelector(`[data-panel-l3-area]`);
    if (!l3Area) return;

    const l3Group = document.getElementById(l3Id);
    if (!l3Group) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    this.#resetL4(panelList);

    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      l3Group.removeAttribute('data-active');
      l3Area.removeAttribute('data-active');
      return;
    }

    l3Area.querySelectorAll(`[data-l3-group]`).forEach((g) => {
      g.removeAttribute('data-active');
    });

    panelList.querySelectorAll(`[data-l2-trigger]`).forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
    });

    btn.setAttribute('aria-expanded', 'true');
    l3Group.setAttribute('data-active', '');
    l3Area.setAttribute('data-active', '');
  }

  #onL3Click(e) {
    const btn = e.currentTarget;
    const l4Id = btn.getAttribute('aria-controls');
    if (!l4Id) return;

    const panelList = btn.closest(`[data-panel-list]`);
    const l4Area = panelList?.querySelector(`[data-panel-l4-area]`);
    if (!l4Area) return;

    const l4Group = document.getElementById(l4Id);
    if (!l4Group) return;

    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    if (isOpen) {
      btn.setAttribute('aria-expanded', 'false');
      l4Group.removeAttribute('data-active');
      l4Area.removeAttribute('data-active');
      return;
    }

    l4Area.querySelectorAll(`[data-l4-group]`).forEach((g) => {
      g.removeAttribute('data-active');
    });

    panelList.querySelectorAll(`[data-l3-trigger]`).forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
    });

    btn.setAttribute('aria-expanded', 'true');
    l4Group.setAttribute('data-active', '');
    l4Area.setAttribute('data-active', '');
  }

  #resetL4(panelList = null) {
    const panelLists = panelList
      ? [panelList]
      : [...this.querySelectorAll(`[data-panel-list]`)];

    panelLists.forEach((list) => {
      const l4Area = list.querySelector(`[data-panel-l4-area]`);
      if (l4Area) {
        l4Area.removeAttribute('data-active');
        l4Area.querySelectorAll(`[data-l4-group]`).forEach((g) => {
          g.removeAttribute('data-active');
        });
      }

      list.querySelectorAll(`[data-l3-trigger]`).forEach((t) => {
        t.setAttribute('aria-expanded', 'false');
      });
    });
  }

  #resetL3() {
    const l3Areas = [...this.querySelectorAll(`[data-panel-l3-area]`)];
    l3Areas.forEach((area) => {
      area.removeAttribute('data-active');
      area.querySelectorAll(`[data-l3-group]`).forEach((g) => {
        g.removeAttribute('data-active');
      });
    });

    this.#resetL4();

    const triggers = [...this.querySelectorAll(`[data-l2-trigger]`)];
    triggers.forEach((t) => {
      t.setAttribute('aria-expanded', 'false');
    });
  }

  #onTriggerClick(e) {
    const trigger = e.currentTarget;
    const panelId = trigger.getAttribute('aria-controls');

    if (!panelId) return;

    if (this.#activeTrigger === trigger) {
      this.#closePanel();
      return;
    }

    this.#openPanel(trigger, panelId);
  }

  #openPanel(trigger, panelId) {
    this.#closePanel();

    const panel = document.getElementById(panelId);
    if (!panel) return;

    trigger.setAttribute('aria-expanded', 'true');
    panel.setAttribute('data-active', '');
    panel.removeAttribute('inert');
    this.#activeTrigger = trigger;
    this.#activePanel = panel;

    this.dispatchEvent(
      new CustomEvent(`${BC}:panel:open`, {
        detail: { trigger, panel },
        bubbles: true,
      }),
    );
  }

  #closePanel() {
    if (!this.#activeTrigger && !this.#activePanel) return;

    this.#resetL3();

    if (this.#activeTrigger) {
      this.#activeTrigger.setAttribute('aria-expanded', 'false');
    }

    if (this.#activePanel) {
      this.#activePanel.removeAttribute('data-active');
      this.#activePanel.setAttribute('inert', '');
    }

    this.#activeTrigger = null;
    this.#activePanel = null;

    this.dispatchEvent(
      new CustomEvent(`${BC}:panel:close`, {
        bubbles: true,
      }),
    );
  }

  #openDrawer() {
    if (!this.#drawer) return;

    this.#drawer.setAttribute('open', '');
    this.#drawer.setAttribute('aria-hidden', 'false');
    this.#drawerTrigger?.setAttribute('aria-expanded', 'true');

    const closeBtn = this.#drawer.querySelector(`.mega-nav__drawer-close`);
    closeBtn?.focus({ preventScroll: true });

    document.body.style.overflow = 'hidden';

    this.dispatchEvent(
      new CustomEvent(`${BC}:drawer:open`, {
        bubbles: true,
      }),
    );
  }

  #trapFocus(e) {
    if (e.key !== 'Tab') return;
    if (!this.#drawer?.hasAttribute('open')) return;

    const focusable = [
      ...this.#drawer.querySelectorAll(
        `button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])`,
      ),
    ];

    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  #closeDrawer() {
    if (!this.#drawer) return;

    this.#drawer.removeAttribute('open');
    this.#drawer.setAttribute('aria-hidden', 'true');
    this.#drawerTrigger?.setAttribute('aria-expanded', 'false');

    document.body.style.overflow = '';

    const accordions = [
      ...this.#drawer.querySelectorAll(`[data-accordion-trigger]`),
    ];

    accordions.forEach((t) => {
      const p = t.nextElementSibling;
      if (p && p.getAttribute('data-accordion-panel') !== null) {
        t.setAttribute('aria-expanded', 'false');
        p.setAttribute('hidden', '');
      }
    });

    this.#drawerTrigger?.focus({ preventScroll: true });

    this.dispatchEvent(
      new CustomEvent(`${BC}:drawer:close`, {
        bubbles: true,
      }),
    );
  }
}

if (!customElements.get('mega-nav-header')) {
  customElements.define('mega-nav-header', MegaNavHeader);
}
