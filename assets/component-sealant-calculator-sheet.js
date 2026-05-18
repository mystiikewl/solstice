import { Component } from '@theme/component';
import { isClickedOutside, onAnimationEnd } from '@theme/utilities';

class SealantCalculatorSheet extends Component {
  #dialogClickHandler = null;
  #dialogCancelHandler = null;
  #triggerClickHandler = null;
  #closeClickHandler = null;
  #closing = false;

  connectedCallback() {
    super.connectedCallback();

    const { sheet, triggerButton, closeButton } = this.refs;
    if (!sheet) {
      console.warn('[sealant-calculator-sheet] no "sheet" ref found');
      return;
    }

    this.#triggerClickHandler = () => this.handleOpenSheet();
    this.#closeClickHandler = () => this.handleCloseSheet();

    this.#dialogClickHandler = (event) => {
      if (isClickedOutside(event, sheet)) this.handleCloseSheet();
    };

    this.#dialogCancelHandler = (event) => {
      event.preventDefault();
      this.handleCloseSheet();
    };

    sheet.addEventListener('click', this.#dialogClickHandler);
    sheet.addEventListener('cancel', this.#dialogCancelHandler);
    triggerButton?.addEventListener('click', this.#triggerClickHandler);
    closeButton?.addEventListener('click', this.#closeClickHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    const { sheet, triggerButton, closeButton } = this.refs;
    if (!sheet) return;

    if (this.#dialogClickHandler) sheet.removeEventListener('click', this.#dialogClickHandler);
    if (this.#dialogCancelHandler) sheet.removeEventListener('cancel', this.#dialogCancelHandler);
    if (this.#triggerClickHandler) triggerButton?.removeEventListener('click', this.#triggerClickHandler);
    if (this.#closeClickHandler) closeButton?.removeEventListener('click', this.#closeClickHandler);
  }

  handleOpenSheet() {
    const { sheet, triggerButton } = this.refs;
    if (!sheet || sheet.open || this.#closing) return;

    sheet.showModal();
    triggerButton?.setAttribute('aria-expanded', 'true');
    this.refs.closeButton?.focus();
  }

  async handleCloseSheet() {
    const { sheet, triggerButton } = this.refs;
    if (!sheet?.open || this.#closing) return;

    this.#closing = true;
    sheet.classList.add('sealant-calculator-sheet--closing');

    const animPromise = onAnimationEnd(sheet, undefined, { subtree: false });
    const timeout = new Promise((resolve) => setTimeout(resolve, 400));
    await Promise.race([animPromise, timeout]);

    this.#closing = false;
    if (!this.isConnected) return;

    sheet.classList.remove('sealant-calculator-sheet--closing');
    sheet.close();
    triggerButton?.setAttribute('aria-expanded', 'false');
    triggerButton?.focus();
  }
}

if (!customElements.get('solstice-sealant-calculator-sheet')) {
  customElements.define('solstice-sealant-calculator-sheet', SealantCalculatorSheet);
}
