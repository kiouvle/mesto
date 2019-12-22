//form popup
export default class Popup {
    constructor(container) {
      this._container = container;
      //hiding the form
      this._popupClose = container.querySelector('.popup__close');
      this._popupClose.addEventListener('click', () => this.close());

    }

    open() {
      this._container.classList.add('popup_is-opened');
    }

    close() {
      this._container.classList.remove('popup_is-opened');
    }
  }