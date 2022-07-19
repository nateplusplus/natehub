class NatehubModal extends HTMLElement {
  connectedCallback() {
    /*
      <div class="dialog">
        <div class="dialog__content">
          <h2></h2>
          <p></p>
          <a href="#" target="_blank">Read more</a>
          <button class="dialog__close" title="Close dialog">&times;</button>
        </div>
      </div>
      */
    const container = document.createElement('div');
    container.classList.add('modal__content');

    const heading = document.createElement('h2');
    const copy = document.createElement('p');

    container.appendChild(heading);
    container.appendChild(copy);

    this.appendChild(container);
  }
}

export default NatehubModal;
