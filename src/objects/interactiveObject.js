import data from '../data.json';

class InteractiveObject {
  constructor(parent, name) {
    this.parent = parent;
    this.name = name;
    this.data = data.find((item) => item.name === this.name);
  }

  handleClicked() {
    const modal = document.createElement('natehub-modal');
    document.body.appendChild(modal);
    modal.heading = this.data.heading ?? '';
    modal.copy = this.data.copy ?? '';
  }
}

export default InteractiveObject;
