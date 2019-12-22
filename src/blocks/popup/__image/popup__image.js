//popup for image
export default class PopupEnlarge {
    constructor(container) {
      this._container = container;
      this._popupImage = container.querySelector('.popup__image');
      this._popupClose = container.querySelector('.popup__close_image')
      this._popupClose.addEventListener('click', () => this.close());
    }

    open(image) {
      this._container.classList.add('popup_is-opened');
      this._popupImage.setAttribute('src', image);
    }

    close() {
      this._container.classList.remove('popup_is-opened');
    }
  }
