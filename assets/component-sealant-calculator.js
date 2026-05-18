import { Component } from '@theme/component';
import { ThemeEvents } from '@theme/events';
import { isClickedOutside, onAnimationEnd } from '@theme/utilities';
import { PRESETS } from '@theme/sealant-calculator-presets';

class SealantCalculator extends Component {
  #defaultVolume = 310;
  #lastResult = null;
  #product = null;
  #modalClickHandler = null;
  #modalCancelHandler = null;
  #atcTimerId = null;

  static calculate(lengthM, widthMm, depthMm, unitSizeMl, includeWastage) {
    let volumeMl = lengthM * 1000 * widthMm * depthMm * 0.001;
    if (includeWastage) volumeMl *= 1.1;
    const unitsRequired = Math.ceil(volumeMl / unitSizeMl);
    const volumeFormatted = volumeMl < 1000
      ? `${Math.round(volumeMl)} ml`
      : `${(volumeMl / 1000).toFixed(2)} litres`;
    return { volumeMl, unitsRequired, volumeFormatted };
  }

  connectedCallback() {
    super.connectedCallback();
    this.#defaultVolume = Number(this.dataset.defaultVolume) || 310;
    this.#setupListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    const { modal, presetSelect, customUnitSize } = this.refs;
    presetSelect?.removeEventListener('change', this.#handlePresetChangeBound);
    customUnitSize?.removeEventListener('input', this.#handlePreviewBound);
    if (modal) {
      modal.removeEventListener('click', this.#modalClickHandler);
      modal.removeEventListener('cancel', this.#modalCancelHandler);
    }
    for (const radio of this.refs.unitSize ?? []) {
      radio.removeEventListener('change', this.#handleRadioChangeBound);
    }
    if (this.#atcTimerId) {
      clearTimeout(this.#atcTimerId);
      this.#atcTimerId = null;
    }
  }

  #setupListeners() {
    const { presetSelect, customUnitSize, unitSize, modal } = this.refs;

    this.#handlePresetChangeBound = (e) => this.handlePresetChange(e);
    this.#handlePreviewBound = () => this.handlePreview();
    this.#handleRadioChangeBound = (e) => this.#handleRadioChange(e);

    presetSelect?.addEventListener('change', this.#handlePresetChangeBound);
    customUnitSize?.addEventListener('input', this.#handlePreviewBound);

    for (const radio of unitSize ?? []) {
      radio.addEventListener('change', this.#handleRadioChangeBound);
    }

    this.#modalClickHandler = (e) => {
      if (isClickedOutside(e, modal)) this.handleCloseModal();
    };
    this.#modalCancelHandler = (e) => {
      e.preventDefault();
      this.handleCloseModal();
    };

    modal?.addEventListener('click', this.#modalClickHandler);
    modal?.addEventListener('cancel', this.#modalCancelHandler);
  }

  #handleRadioChange(event) {
    const radio = event.currentTarget;
    const isCustom = radio.value === 'custom' && radio.checked;
    if (this.refs.customUnitSize) {
      this.refs.customUnitSize.disabled = !isCustom;
      if (isCustom) this.refs.customUnitSize.focus();
    }
  }

  handleOpenModal() {
    const { modal, triggerButton } = this.refs;
    if (!modal || modal.open) return;
    modal.showModal();
    triggerButton?.setAttribute('aria-expanded', 'true');
    this.refs.closeButton?.focus();
  }

  async handleCloseModal() {
    const { modal, triggerButton } = this.refs;
    if (!modal?.open) return;

    modal.style.animation = 'none';
    void modal.offsetWidth;
    modal.classList.add('calc-closing');
    modal.style.animation = '';

    await onAnimationEnd(modal, undefined, { subtree: false });

    if (!this.isConnected) return;

    modal.classList.remove('calc-closing');
    modal.close();
    triggerButton?.setAttribute('aria-expanded', 'false');
    this.#resetForm();
    triggerButton?.focus();
  }

  handlePreview() {
    this.#clearError();

    const lengthM = parseFloat(this.refs.jointLength?.value);
    const widthMm = parseFloat(this.refs.jointWidth?.value);
    const depthMm = parseFloat(this.refs.jointDepth?.value);
    const unitSizeMl = this.#getUnitSizeMl();
    const includeWastage = this.refs.wastageToggle?.checked || false;

    if (!(lengthM > 0 && widthMm > 0 && depthMm > 0)) {
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
    this.refs.summaryUnits.textContent = `${result.unitsRequired} ${this.#unitWord(result.unitsRequired)}`;

    this.refs.resultsContainer?.removeAttribute('hidden');
    this.refs.totalSealant.textContent = this.#t('result_sealant', { volume: result.volumeFormatted });
    const plural = result.unitsRequired === 1 ? '' : 's';
    this.refs.totalUnits.textContent = this.#t('result_units', {
      units: result.unitsRequired,
      size: unitSizeMl,
      plural,
    });

    this.#updateAtcButtonText(result.unitsRequired);

    if (this.product?.variants?.length > 1) {
      this.refs.variantSelectContainer?.removeAttribute('hidden');
    }
  }

  async handleAddToCart() {
    if (!this.#lastResult) return;

    const variantId = this.#getSelectedVariantId();
    if (!variantId) {
      this.#showError(this.#getI18n('error_variant'));
      return;
    }

    const { addToCartBtn: btn, atcFeedback: feedback } = this.refs;
    btn.disabled = true;
    btn.setAttribute('aria-busy', 'true');

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: this.#lastResult.unitsRequired }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.description || this.#getI18n('atc_error'));
      }

      feedback.textContent = this.#getI18n('atc_success');
      feedback.removeAttribute('hidden');
      document.dispatchEvent(new Event(ThemeEvents.cartUpdate, { bubbles: true }));

      this.#atcTimerId = setTimeout(() => {
        if (!this.isConnected) return;
        feedback.setAttribute('hidden', '');
        this.handleCloseModal();
      }, 1500);
    } catch (err) {
      this.#showError(err.message);
      btn.disabled = false;
      btn.removeAttribute('aria-busy');
    }
  }

  handlePresetChange(event) {
    const key = event.target.value;
    if (!key || !PRESETS[key]) {
      this.refs.presetDescription?.setAttribute('hidden', '');
      return;
    }

    this.refs.jointWidth.value = String(PRESETS[key].width);
    this.refs.jointDepth.value = String(PRESETS[key].depth);

    const descEl = this.querySelector(`[data-preset-desc="${key}"]`);
    this.refs.presetDescription.textContent = descEl?.textContent || '';
    this.refs.presetDescription.removeAttribute('hidden');

    if (!this.refs.jointLength.value) this.refs.jointLength.focus();
    this.handlePreview();
  }

  #getUnitSizeMl() {
    for (const radio of this.refs.unitSize ?? []) {
      if (!radio.checked) continue;
      if (radio.value === 'custom') {
        const v = parseInt(this.refs.customUnitSize?.value);
        return v > 0 ? v : this.#defaultVolume;
      }
      return parseInt(radio.value);
    }
    return this.#defaultVolume;
  }

  #getSelectedVariantId() {
    const select = this.refs.calculatorVariantSelect;
    if (select?.value) return select.value;
    return this.product?.selected_or_first_available_variant?.id ?? null;
  }

  #updateAtcButtonText(units) {
    const select = this.refs.calculatorVariantSelect;
    const title = select ? select.options[select.selectedIndex]?.text : '';
    const text = this.refs.atcButtonText;
    if (!text) return;
    text.textContent = title
      ? this.#t('atc_with_variant', { units, variant: title })
      : `${this.#getI18n('atc_default')} ${units} ${this.#unitWord(units)}`;
  }

  #getI18n(key) {
    const attr = 'i18n' + key.split('_').map((s) => s[0].toUpperCase() + s.slice(1)).join('');
    return this.dataset[attr] || '';
  }

  #t(key, vars = {}) {
    let tpl = this.#getI18n(key);
    for (const [k, v] of Object.entries(vars)) {
      tpl = tpl.replaceAll(`{{ ${k} }}`, String(v));
    }
    return tpl;
  }

  #unitWord(n) {
    return n === 1 ? this.#getI18n('unit_singular') : this.#getI18n('unit_plural');
  }

  #showError(msg) {
    if (this.refs.errorText) this.refs.errorText.textContent = msg;
    this.refs.errorContainer?.removeAttribute('hidden');
  }

  #clearError() {
    this.refs.errorContainer?.setAttribute('hidden', '');
  }

  #resetForm() {
    const { jointLength, jointWidth, jointDepth, customUnitSize, wastageToggle,
            presetSelect, presetDescription, summaryPlaceholder, summaryContent,
            resultsContainer, variantSelectContainer, errorContainer, atcFeedback,
            unitSize } = this.refs;

    if (jointLength) jointLength.value = '';
    if (jointWidth) jointWidth.value = '';
    if (jointDepth) jointDepth.value = '';
    if (customUnitSize) { customUnitSize.value = ''; customUnitSize.disabled = true; }
    if (wastageToggle) wastageToggle.checked = false;
    if (presetSelect) presetSelect.value = '';
    presetDescription?.setAttribute('hidden', '');
    summaryPlaceholder?.removeAttribute('hidden');
    summaryContent?.setAttribute('hidden', '');
    resultsContainer?.setAttribute('hidden', '');
    variantSelectContainer?.setAttribute('hidden', '');
    errorContainer?.setAttribute('hidden', '');
    atcFeedback?.setAttribute('hidden', '');
    this.#lastResult = null;

    for (const radio of unitSize ?? []) {
      radio.checked = radio.value === '300';
    }
  }

  get product() {
    if (this.#product) return this.#product;
    const id = this.dataset.productId;
    if (!id) return null;
    const form = document.querySelector(`product-form-component[data-product-id="${id}"]`);
    if (form?.dataset.product) {
      try { this.#product = JSON.parse(form.dataset.product); } catch { this.#product = null; }
    }
    return this.#product;
  }

  /** @type {Function} */
  #handlePresetChangeBound = null;
  /** @type {Function} */
  #handlePreviewBound = null;
  /** @type {Function} */
  #handleRadioChangeBound = null;
}

if (!customElements.get('solstice-sealant-calculator')) {
  customElements.define('solstice-sealant-calculator', SealantCalculator);
}
