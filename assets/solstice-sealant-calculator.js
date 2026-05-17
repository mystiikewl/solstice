import { Component } from '@theme/component';
import { trapFocus, removeTrapFocus } from '@theme/focus';
import { ThemeEvents } from '@theme/events';

/**
 * Preset job definitions with recommended width/depth values.
 */
const PRESETS = {
  bath_tub: { width: 6, depth: 3, description: 'Typical bathtub edge sealing — narrow gap between tub and tile.' },
  kitchen_sink: { width: 5, depth: 4, description: 'Kitchen sink perimeter — tight seal against splashback.' },
  window_frame: { width: 10, depth: 5, description: 'Window frame to wall sealing — moderate movement joint.' },
  expansion_joint: { width: 20, depth: 12, description: 'Concrete expansion joint — high movement, deep pour.' },
  concrete_slab: { width: 15, depth: 10, description: 'Concrete slab control joint — structural movement.' },
  metal_cladding: { width: 12, depth: 6, description: 'Metal cladding seam sealing — weatherproofing.' },
  roof_flashing: { width: 6, depth: 4, description: 'Roof flashing detail — fine weatherproofing bead.' },
  floor_joint: { width: 8, depth: 8, description: 'Floor joint filling — square profile for traffic areas.' },
  pipe_penetration: { width: 10, depth: 6, description: 'Pipe penetration sealing — around services through walls.' },
  general_gap: { width: 5, depth: 5, description: 'General gap filling — small gaps and cracks.' },
};

/**
 * @typedef {Object} CalcResult
 * @property {number} volumeMl - Total sealant volume in ml
 * @property {number} unitsRequired - Number of units needed
 * @property {string} volumeFormatted - Human-readable volume string
 */

/**
 * @typedef {Object} SealantCalculatorRefs
 * @property {HTMLButtonElement} triggerButton - Trigger card button
 * @property {HTMLElement} overlay - Overlay backdrop
 * @property {HTMLElement} sidebar - Sidebar dialog
 * @property {HTMLButtonElement} closeButton - Close button
 * @property {HTMLSelectElement} presetSelect - Preset job selector
 * @property {HTMLElement} presetDescription - Preset description text
 * @property {HTMLInputElement} jointLength - Length input
 * @property {HTMLInputElement} jointWidth - Width input
 * @property {HTMLInputElement} jointDepth - Depth input
 * @property {HTMLInputElement[]} unitSize - Unit size radio buttons
 * @property {HTMLElement} customSizeContainer - Custom size container
 * @property {HTMLInputElement} customUnitSize - Custom size input
 * @property {HTMLInputElement} wastageToggle - Wastage toggle checkbox
 * @property {HTMLElement} summaryContainer - Summary container
 * @property {HTMLElement} summaryPlaceholder - Summary placeholder
 * @property {HTMLElement} summaryContent - Summary content
 * @property {HTMLElement} summaryVolume - Volume display
 * @property {HTMLElement} summaryUnits - Units display
 * @property {HTMLElement} errorContainer - Error container
 * @property {HTMLElement} errorText - Error text
 * @property {HTMLElement} resultsContainer - Results container
 * @property {HTMLElement} totalSealant - Total sealant text
 * @property {HTMLElement} totalUnits - Total units text
 * @property {HTMLElement} variantSelectContainer - Variant select container
 * @property {HTMLSelectElement} calculatorVariantSelect - Variant selector
 * @property {HTMLButtonElement} addToCartBtn - ATC button
 * @property {HTMLElement} atcButtonText - ATC button text
 * @property {HTMLElement} atcFeedback - ATC feedback
 */

/**
 * @extends {Component<SealantCalculatorRefs>}
 */
class SealantCalculator extends Component {
  /** @type {number} */
  #defaultVolume = 310;

  /** @type {CalcResult | null} */
  #lastResult = null;

  /**
   * Pure calculation function.
   * @param {number} lengthM - Joint length in meters
   * @param {number} widthMm - Joint width in mm
   * @param {number} depthMm - Joint depth in mm
   * @param {number} unitSizeMl - Unit size in ml
   * @param {boolean} includeWastage - Whether to add 10% wastage
   * @returns {CalcResult}
   */
  static calculate(lengthM, widthMm, depthMm, unitSizeMl, includeWastage) {
    const lengthMm = lengthM * 1000;
    let volumeMl = lengthMm * widthMm * depthMm * 0.001;

    if (includeWastage) {
      volumeMl = volumeMl * 1.1;
    }

    const unitsRequired = Math.ceil(volumeMl / unitSizeMl);

    let volumeFormatted;
    if (volumeMl < 1000) {
      volumeFormatted = `${Math.round(volumeMl)} ml`;
    } else {
      volumeFormatted = `${(volumeMl / 1000).toFixed(2)} litres`;
    }

    return { volumeMl, unitsRequired, volumeFormatted };
  }

  connectedCallback() {
    super.connectedCallback();

    this.#defaultVolume = Number(this.dataset.defaultVolume) || 310;

    this.#setupCustomSizeToggle();
    this.#setupKeyboardClose();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('keydown', this.#handleEscape);
  }

  /**
   * Sidebar open handler.
   */
  handleOpenSidebar() {
    this.refs.sidebar.setAttribute('aria-hidden', 'false');
    this.refs.sidebar.classList.add('is-open');
    this.refs.overlay.classList.add('is-visible');
    this.refs.overlay.setAttribute('aria-hidden', 'false');
    this.refs.triggerButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('calculator-sidebar-show');

    trapFocus(this.refs.sidebar);
    this.refs.closeButton?.focus();
  }

  /**
   * Sidebar close handler.
   */
  handleCloseSidebar() {
    this.refs.sidebar.setAttribute('aria-hidden', 'true');
    this.refs.sidebar.classList.remove('is-open');
    this.refs.overlay.classList.remove('is-visible');
    this.refs.overlay.setAttribute('aria-hidden', 'true');
    this.refs.triggerButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('calculator-sidebar-show');

    removeTrapFocus();
    this.#resetForm();
    this.refs.triggerButton?.focus();
  }

  /**
   * Preview handler — runs on every input change.
   */
  handlePreview() {
    this.#clearError();

    const lengthM = parseFloat(this.refs.jointLength?.value);
    const widthMm = parseFloat(this.refs.jointWidth?.value);
    const depthMm = parseFloat(this.refs.jointDepth?.value);
    const unitSizeMl = this.#getUnitSizeMl();
    const includeWastage = this.refs.wastageToggle?.checked || false;

    const hasAllInputs = lengthM > 0 && widthMm > 0 && depthMm > 0;

    if (!hasAllInputs) {
      this.refs.summaryPlaceholder?.removeAttribute('hidden');
      this.refs.summaryContent?.setAttribute('hidden', '');
      this.refs.resultsContainer?.setAttribute('hidden', '');
      this.#lastResult = null;
      return;
    }

    const result = SealantCalculator.calculate(lengthM, widthMm, depthMm, unitSizeMl, includeWastage);
    this.#lastResult = result;

    this.refs.summaryPlaceholder?.setAttribute('hidden', '');
    this.refs.summaryContent?.removeAttribute('hidden');

    this.refs.summaryVolume.textContent = result.volumeFormatted;
    this.refs.summaryUnits.textContent = `${result.unitsRequired} unit${result.unitsRequired > 1 ? 's' : ''}`;

    this.refs.resultsContainer?.removeAttribute('hidden');
    this.refs.totalSealant.textContent = `Total sealant required: ${result.volumeFormatted}`;
    this.refs.totalUnits.textContent = `You need ${result.unitsRequired} x ${unitSizeMl}ml unit${result.unitsRequired > 1 ? 's' : ''}`;

    this.#updateAtcButtonText(result.unitsRequired);

    const hasMultipleVariants = this.product?.variants?.length > 1;
    if (hasMultipleVariants) {
      this.refs.variantSelectContainer?.removeAttribute('hidden');
    }
  }

  /**
   * Add to cart handler.
   */
  async handleAddToCart() {
    if (!this.#lastResult) return;

    const variantId = this.#getSelectedVariantId();
    if (!variantId) {
      this.#showError('Please select a variant.');
      return;
    }

    const button = this.refs.addToCartBtn;
    const feedback = this.refs.atcFeedback;

    button.disabled = true;
    button.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: variantId,
          quantity: this.#lastResult.unitsRequired,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.description || 'Failed to add to cart.');
      }

      feedback.textContent = 'Added to cart!';
      feedback.removeAttribute('hidden');

      document.dispatchEvent(new Event(ThemeEvents.cartUpdate, { bubbles: true }));

      setTimeout(() => {
        feedback.setAttribute('hidden', '');
        this.handleCloseSidebar();
      }, 1500);
    } catch (error) {
      this.#showError(error.message);
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  }

  /**
   * Preset select change handler.
   */
  handlePresetChange(event) {
    const presetKey = event.target.value;
    if (!presetKey || !PRESETS[presetKey]) {
      this.refs.presetDescription?.setAttribute('hidden', '');
      return;
    }

    const preset = PRESETS[presetKey];
    this.refs.jointWidth.value = String(preset.width);
    this.refs.jointDepth.value = String(preset.depth);
    this.refs.presetDescription.textContent = preset.description;
    this.refs.presetDescription.removeAttribute('hidden');

    if (!this.refs.jointLength.value) {
      this.refs.jointLength.focus();
    }

    this.handlePreview();
  }

  /**
   * Custom size input change handler.
   */
  handleCustomSizeChange() {
    this.handlePreview();
  }

  #setupCustomSizeToggle() {
    const radios = this.refs.unitSize;
    if (!radios) return;

    for (const radio of radios) {
      radio.addEventListener('change', () => {
        const isCustom = radio.value === 'custom' && radio.checked;
        if (this.refs.customUnitSize) {
          this.refs.customUnitSize.disabled = !isCustom;
          if (isCustom) {
            this.refs.customUnitSize.focus();
          }
        }
      });
    }

    const presetSelect = this.refs.presetSelect;
    if (presetSelect) {
      presetSelect.addEventListener('change', (e) => this.handlePresetChange(e));
    }

    const customInput = this.refs.customUnitSize;
    if (customInput) {
      customInput.addEventListener('input', () => this.handleCustomSizeChange());
    }
  }

  #setupKeyboardClose() {
    document.addEventListener('keydown', this.#handleEscape);
  }

  #handleEscape = (event) => {
    if (event.key === 'Escape' && this.refs.sidebar?.classList.contains('is-open')) {
      this.handleCloseSidebar();
    }
  };

  #getUnitSizeMl() {
    const radios = this.refs.unitSize;
    if (!radios) return this.#defaultVolume;

    for (const radio of radios) {
      if (radio.checked) {
        if (radio.value === 'custom') {
          const customVal = parseInt(this.refs.customUnitSize?.value);
          return customVal > 0 ? customVal : this.#defaultVolume;
        }
        return parseInt(radio.value);
      }
    }

    return this.#defaultVolume;
  }

  #getSelectedVariantId() {
    const select = this.refs.calculatorVariantSelect;
    if (select?.value) return select.value;

    const product = this.product;
    if (product?.selected_or_first_available_variant?.id) {
      return product.selected_or_first_available_variant.id;
    }

    return null;
  }

  #updateAtcButtonText(units) {
    const variantSelect = this.refs.calculatorVariantSelect;
    let variantTitle = '';

    if (variantSelect) {
      const selected = variantSelect.options[variantSelect.selectedIndex];
      variantTitle = selected?.text || '';
    }

    const text = this.refs.atcButtonText;
    if (text) {
      text.textContent = variantTitle
        ? `Add ${units} x ${variantTitle} to Cart`
        : `Add ${units} unit${units > 1 ? 's' : ''} to Cart`;
    }
  }

  #showError(message) {
    if (this.refs.errorContainer && this.refs.errorText) {
      this.refs.errorText.textContent = message;
      this.refs.errorContainer.removeAttribute('hidden');
    }
  }

  #clearError() {
    this.refs.errorContainer?.setAttribute('hidden', '');
  }

  #resetForm() {
    if (this.refs.jointLength) this.refs.jointLength.value = '';
    if (this.refs.jointWidth) this.refs.jointWidth.value = '';
    if (this.refs.jointDepth) this.refs.jointDepth.value = '';
    if (this.refs.customUnitSize) this.refs.customUnitSize.value = '';
    if (this.refs.wastageToggle) this.refs.wastageToggle.checked = false;
    if (this.refs.presetSelect) this.refs.presetSelect.value = '';
    if (this.refs.presetDescription) this.refs.presetDescription.setAttribute('hidden', '');

    this.refs.summaryPlaceholder?.removeAttribute('hidden');
    this.refs.summaryContent?.setAttribute('hidden', '');
    this.refs.resultsContainer?.setAttribute('hidden', '');
    this.refs.variantSelectContainer?.setAttribute('hidden', '');
    this.refs.errorContainer?.setAttribute('hidden', '');
    this.refs.atcFeedback?.setAttribute('hidden', '');

    this.#lastResult = null;

    const radios = this.refs.unitSize;
    if (radios) {
      for (const radio of radios) {
        radio.checked = radio.value === '300';
      }
    }
    if (this.refs.customUnitSize) {
      this.refs.customUnitSize.disabled = true;
    }
  }

  get product() {
    if (this.#product) return this.#product;

    const productId = this.dataset.productId;
    if (!productId) return null;

    const productForm = document.querySelector(`product-form-component[data-product-id="${productId}"]`);
    if (productForm?.dataset.product) {
      try {
        this.#product = JSON.parse(productForm.dataset.product);
      } catch {
        this.#product = null;
      }
    }

    return this.#product;
  }

  /** @type {Object | null} */
  #product = null;
}

if (!customElements.get('solstice-sealant-calculator')) {
  customElements.define('solstice-sealant-calculator', SealantCalculator);
}
