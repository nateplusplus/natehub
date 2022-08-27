import Hammer from 'hammerjs';

class NatehubModal extends HTMLElement {
  connectedCallback() {
    this.container = document.createElement('div');
    this.container.classList.add('modal__content');

    this.children.heading = document.createElement('h2');
    this.children.heading.innerHTML = this.heading ?? '';

    this.children.copy = document.createElement('p');
    this.children.copy.innerHTML = this.copy ?? '';

    this.children.cta = document.createElement('a');
    this.children.cta.setAttribute('target', '_blank');
    this.children.cta.href = '#';
    this.children.cta.innerHTML = 'Read more';

    this.children.close = document.createElement('button');
    this.children.close.classList.add('modal__close');
    this.children.close.setAttribute('title', 'Close dialog');
    this.children.close.innerHTML = '&times;';

    this.container.appendChild(this.children.close);
    this.container.appendChild(this.children.heading);
    this.container.appendChild(this.children.copy);
    this.container.appendChild(this.children.cta);

    this.appendChild(this.container);

    this.hammertime = new Hammer(this.children.close);
    this.hammertime.on('tap', this.handleClose.bind(this));
  }

  static get observedAttributes() {
    return ['heading', 'copy', 'cta-text', 'cta-href'];
  }

  get heading() {
    return this.getAttribute('heading');
  }

  set heading(value) {
    this.setAttribute('heading', value);
  }

  get copy() {
    return this.getAttribute('copy');
  }

  set copy(value) {
    this.setAttribute('copy', value);
  }

  get ctaText() {
    return this.getAttribute('cta-text');
  }

  set ctaText(value) {
    this.setAttribute('cta-text', value);
  }

  get ctaHref() {
    return this.getAttribute('cta-href');
  }

  set ctaHref(value) {
    this.setAttribute('cta-href', value);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue || !this.isConnected) {
      return;
    }

    if (name === 'heading') {
      this.children.heading.innerHTML = newValue;
    }

    if (name === 'copy') {
      this.children.copy.innerHTML = newValue;
    }

    if (name === 'cta-text') {
      this.children.cta.innerHTML = newValue;
    }

    if (name === 'cta-href') {
      this.children.cta.href = newValue;
    }
  }

  close() {
    this.remove();
  }

  handleClose() {
    this.remove();
  }
}

export default NatehubModal;
