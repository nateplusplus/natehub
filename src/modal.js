class NatehubModal extends HTMLElement {
  connectedCallback() {
    this.children.container = document.createElement('div');
    this.children.container.classList.add('modal__content');

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

    this.children.close.addEventListener('click', this.close.bind(this));

    this.children.container.appendChild(this.children.heading);
    this.children.container.appendChild(this.children.copy);
    this.children.container.appendChild(this.children.cta);
    this.children.container.appendChild(this.children.close);

    this.appendChild(this.children.container);
  }

  static get observedAttributes() {
    return ['heading', 'copy'];
  }

  static get heading() {
    return this.getAttribute('heading');
  }

  set heading(value) {
    this.setAttribute('heading', value);
  }

  static get copy() {
    return this.getAttribute('copy');
  }

  set copy(value) {
    this.setAttribute('copy', value);
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
  }

  close() {
    this.remove();
  }
}

export default NatehubModal;
