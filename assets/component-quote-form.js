import { Component } from '@theme/component';
import { formatMoney } from '@theme/money-formatting';

/**
 * @extends {Component<{}>}
 */
class QuoteForm extends Component {
  #quoteVariantChangeHandler = null;
  #pdpVariantChangeHandler = null;

  connectedCallback() {
    super.connectedCallback();

    this.#syncVariantTitle();
    this.#updatePricingProof();

    if (this.refs.quoteVariantSelect) {
      this.#quoteVariantChangeHandler = () => {
        this.#syncFromQuoteSelect();
        this.#updatePricingProof();
      };
      this.refs.quoteVariantSelect.addEventListener('change', this.#quoteVariantChangeHandler);
    }

    const variantPicker = document.querySelector('variant-picker-component');
    if (variantPicker) {
      this.#pdpVariantChangeHandler = () => {
        this.#syncFromPdpSelection();
        this.#updatePricingProof();
      };
      variantPicker.addEventListener('change', this.#pdpVariantChangeHandler);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    if (this.refs.quoteVariantSelect && this.#quoteVariantChangeHandler) {
      this.refs.quoteVariantSelect.removeEventListener('change', this.#quoteVariantChangeHandler);
    }

    const variantPicker = document.querySelector('variant-picker-component');
    if (variantPicker && this.#pdpVariantChangeHandler) {
      variantPicker.removeEventListener('change', this.#pdpVariantChangeHandler);
    }
  }

  #syncVariantTitle() {
    if (!this.refs.variantTitleField || !this.refs.variantIdField) return;

    this.#syncFromPdpSelection();
    this.#syncFromQuoteSelect();
  }

  #syncFromPdpSelection() {
    if (!this.refs.quoteVariantSelect) return;

    const variantPicker = document.querySelector('variant-picker-component');
    const selectedId = variantPicker?.querySelector('input[name="id"]:checked')?.value;

    if (!selectedId) return;

    const option = this.refs.quoteVariantSelect.querySelector(`option[value="${selectedId}"]`);
    if (!option) return;

    this.refs.quoteVariantSelect.value = selectedId;
    this.refs.variantTitleField.value = option.dataset.variantTitle || option.textContent?.trim() || '';
    this.refs.variantIdField.value = selectedId;
  }

  #syncFromQuoteSelect() {
    if (!this.refs.quoteVariantSelect || !this.refs.variantTitleField || !this.refs.variantIdField) return;

    const selected = this.refs.quoteVariantSelect.selectedOptions?.[0];

    if (selected?.textContent?.trim()) {
      this.refs.variantTitleField.value = selected.dataset.variantTitle || selected.textContent.trim();
      this.refs.variantIdField.value = this.refs.quoteVariantSelect.value;
      return;
    }

    const fallback = document.querySelector('input[name="id"]');
    if (fallback?.value) {
      this.refs.variantIdField.value = fallback.value;
    }
  }

  #updatePricingProof() {
    if (!this.refs.bulkProof || !this.refs.quoteVariantSelect) return;

    const selected = this.refs.quoteVariantSelect.selectedOptions?.[0];
    const priceCents = parseInt(selected?.dataset?.price || '0', 10);
    const moneyFormat = window.Shopify?.money_format || '${{amount}}';
    const currency = window.Shopify?.currency?.active || 'USD';

    if (priceCents > 0) {
      const bulkPrice = Math.round(priceCents * 0.9);
      const savings = priceCents - bulkPrice;

      if (this.refs.singleUnitPrice) {
        this.refs.singleUnitPrice.textContent = formatMoney(priceCents, moneyFormat, currency);
      }
      if (this.refs.bulkBuyPrice) {
        this.refs.bulkBuyPrice.textContent = formatMoney(bulkPrice, moneyFormat, currency);
      }
      if (this.refs.savingsAmount) {
        this.refs.savingsAmount.textContent = formatMoney(savings, moneyFormat, currency);
      }
    }
  }
}

if (!customElements.get('solstice-quote-form')) {
  customElements.define('solstice-quote-form', QuoteForm);
}
