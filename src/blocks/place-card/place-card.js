//class for cards
export default class Card {
  constructor(image, name) {
    this._image = image;
    this._name = name;
  }

  like() {
    this.likeIcon.classList.toggle('place-card__like-icon_liked');
  }

  remove() {
    this._card.parentElement.removeChild(this._card);
  }

  onImageClick(func) {
    this.cardImage.addEventListener('click', () => func(this._image))
  }

  create() {
    this._card = document.createElement('div'); //add card
    this._card.classList.add('place-card');


    this.cardImage = document.createElement('div'); //add image
    this.cardImage.classList.add('place-card__image');
    this._card.appendChild(this.cardImage);
    this.cardImage.setAttribute('style', 'background-image: url(' + this._image + ')'); //pics from array


    this.deleteIcon = document.createElement('button'); //add trash
    this.deleteIcon.classList.add('place-card__delete-icon');
    this.cardImage.appendChild(this.deleteIcon);
    this.deleteIcon.addEventListener('click', (event) => { event.stopPropagation(); this.remove(); });

    const description = document.createElement('div');
    description.classList.add('place-card__description');
    this._card.appendChild(description);

    const cardName = document.createElement('h3'); //add name
    cardName.classList.add('place-card__name');
    description.appendChild(cardName);
    cardName.textContent = this._name; //names from array

    this.likeIcon = document.createElement('button'); //add like
    this.likeIcon.classList.add('place-card__like-icon');
    description.appendChild(this.likeIcon);
    this.likeIcon.addEventListener('click', () => this.like());

    return this._card;
  }
}