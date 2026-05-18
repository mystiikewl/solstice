import { Component } from '@theme/component';

/**
 * @extends {Component<{}>}
 */
class QuoteForm extends Component {
  #nextBound = null;
  #backBound = null;

  connectedCallback() {
    super.connectedCallback();

    this.#nextButton = this.querySelector('[data-next-step]');
    this.#backButton = this.querySelector('[data-prev-step]');
    this.#step1 = this.querySelector('[data-step="1"]');
    this.#step2 = this.querySelector('[data-step="2"]');

    if (this.#nextButton) {
      this.#nextBound = this.#goToStep2.bind(this);
      this.#nextButton.addEventListener('click', this.#nextBound);
    }

    if (this.#backButton) {
      this.#backBound = this.#goToStep1.bind(this);
      this.#backButton.addEventListener('click', this.#backBound);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.#nextButton && this.#nextBound) {
      this.#nextButton.removeEventListener('click', this.#nextBound);
    }
    if (this.#backButton && this.#backBound) {
      this.#backButton.removeEventListener('click', this.#backBound);
    }
  }

  #goToStep2() {
    const step1Inputs = this.#step1?.querySelectorAll('input[required]');
    if (!step1Inputs) return;

    for (const input of step1Inputs) {
      if (!input.checkValidity()) {
        input.reportValidity();
        return;
      }
    }

    if (this.#step1) this.#step1.hidden = true;
    if (this.#step2) this.#step2.hidden = false;

    const firstInput = this.#step2?.querySelector('input');
    if (firstInput) firstInput.focus();
  }

  #goToStep1() {
    if (this.#step2) this.#step2.hidden = true;
    if (this.#step1) this.#step1.hidden = false;
  }

  /** @type {HTMLElement | null} */
  #nextButton = null;
  /** @type {HTMLElement | null} */
  #backButton = null;
  /** @type {HTMLElement | null} */
  #step1 = null;
  /** @type {HTMLElement | null} */
  #step2 = null;
}

customElements.define('solstice-quote-form', QuoteForm);
