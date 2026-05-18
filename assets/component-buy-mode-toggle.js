import { Component } from '@theme/component';

/**
 * @typedef {Object} BuyModeToggleRefs
 * @property {HTMLElement} savingsBadge - Savings badge element
 * @property {HTMLElement} savingsText - Savings text span
 */

/**
 * @extends {Component<BuyModeToggleRefs>}
 */
class BuyModeToggle extends Component {
  connectedCallback() {
    super.connectedCallback();
    this.#optionIndex = Number(this.dataset.optionIndex);
    this.#productId = this.dataset.productId;
    this.#options = this.querySelectorAll('.buy-mode-toggle__option');
    this.#variantPicker = document.querySelector(`variant-picker[data-product-id="${this.#productId}"]`);
    this.#savingsBadge = this.querySelector('[data-savings-badge]');
    this.#savingsText = this.querySelector('[data-savings-text]');

    this.#boundHandlers = new Map();
    this.#options.forEach((option) => {
      const handler = this.#handleToggle.bind(this);
      this.#boundHandlers.set(option, handler);
      option.addEventListener('click', handler);
    });

    this.#listenForVariantChanges();
    this.#calculateSavings();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.#options.forEach((option) => {
      const handler = this.#boundHandlers?.get(option);
      if (handler) option.removeEventListener('click', handler);
    });
    this.#observer?.disconnect();
  }

  /**
   * @param {MouseEvent} event
   */
  #handleToggle(event) {
    const button = event.currentTarget;
    if (!button || button.hasAttribute('data-active')) return;

    const value = button.dataset.value;
    if (!value) return;

    this.#setActive(button);
    this.#selectVariantOption(value);
    this.#updateSavingsDisplay();
  }

  /**
   * @param {HTMLElement} activeButton
   */
  #setActive(activeButton) {
    this.#options.forEach((option) => {
      option.removeAttribute('data-active');
      option.setAttribute('aria-checked', 'false');
    });

    activeButton.setAttribute('data-active', '');
    activeButton.setAttribute('aria-checked', 'true');
  }

  /**
   * @param {string} value
   */
  #selectVariantOption(value) {
    if (!this.#variantPicker) return;

    const fieldset = this.#variantPicker.querySelectorAll('fieldset')[this.#optionIndex];
    if (!fieldset) return;

    const input = fieldset.querySelector(`input[value="${CSS.escape(value)}"]`);
    if (!input) return;

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  }

  #listenForVariantChanges() {
    if (!this.#variantPicker) return;

    this.#observer = new MutationObserver(() => {
      this.#syncWithPicker();
      this.#updateSavingsDisplay();
    });

    observer.observe(this.#variantPicker, {
      subtree: true,
      attributes: true,
      attributeFilter: ['checked'],
    });

    this.#syncWithPicker();
  }

  #syncWithPicker() {
    if (!this.#variantPicker) return;

    const fieldset = this.#variantPicker.querySelectorAll('fieldset')[this.#optionIndex];
    if (!fieldset) return;

    const checkedInput = fieldset.querySelector('input:checked');
    if (!checkedInput) return;

    const currentValue = checkedInput.value.toLowerCase();
    this.#options.forEach((option) => {
      const optionValue = option.dataset.value?.toLowerCase();
      if (optionValue === currentValue) {
        option.setAttribute('data-active', '');
        option.setAttribute('aria-checked', 'true');
      } else {
        option.removeAttribute('data-active');
        option.setAttribute('aria-checked', 'false');
      }
    });
  }

  #calculateSavings() {
    let singlePriceCents = 0;
    let boxPriceCents = 0;
    let boxUnits = 1;

    this.#options.forEach((option) => {
      const mode = option.dataset.mode;
      const priceCents = Number(option.dataset.priceCents) || 0;

      if (mode === 'single') {
        singlePriceCents = priceCents;
      } else if (mode === 'box') {
        boxPriceCents = priceCents;
        const boxMatch = option.dataset.value?.match(/(\d+)/);
        if (boxMatch) {
          boxUnits = Number(boxMatch[1]);
        }
      }
    });

    if (singlePriceCents > 0 && boxPriceCents > 0 && boxUnits > 1) {
      const pricePerUnitInBox = boxPriceCents / boxUnits;
      const savingsPerUnit = singlePriceCents - pricePerUnitInBox;

      if (savingsPerUnit > 0) {
        this.#savingsPerUnit = savingsPerUnit;
        this.#savingsPercent = Math.round((savingsPerUnit / singlePriceCents) * 100);
      }
    }
  }

  #updateSavingsDisplay() {
    if (!this.#savingsBadge || !this.#savingsText) return;

    const activeOption = this.querySelector('[data-active]');
    const activeMode = activeOption?.dataset.mode;

    if (activeMode === 'box' && this.#savingsPerUnit > 0) {
      const savingsFormatted = (this.#savingsPerUnit / 100).toFixed(2);
      this.#savingsText.textContent = `Save $${savingsFormatted} per unit (${this.#savingsPercent}% off)`;
      this.#savingsBadge.hidden = false;
    } else {
      this.#savingsBadge.hidden = true;
    }
  }

  /** @type {number} */
  #optionIndex = 0;
  /** @type {string} */
  #productId = '';
  /** @type {NodeListOf<HTMLElement>} */
  #options;
  /** @type {HTMLElement | null} */
  #variantPicker = null;
  /** @type {HTMLElement | null} */
  #savingsBadge = null;
  /** @type {HTMLElement | null} */
  #savingsText = null;
  /** @type {number} */
  #savingsPerUnit = 0;
  /** @type {number} */
  #savingsPercent = 0;
  /** @type {Map<HTMLElement, Function>} */
  #boundHandlers = null;
  /** @type {MutationObserver | null} */
  #observer = null;
}

customElements.define('solstice-buy-mode-toggle', BuyModeToggle);
