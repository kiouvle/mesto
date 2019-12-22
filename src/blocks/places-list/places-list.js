import Card from '../place-card/place-card.js';

//cards list costructor
export default class CardList {
  constructor(container, cardsArray, popupEnlarge) {
    this._container = container;
    this._cardsArray = cardsArray;
    this._popupEnlarge = popupEnlarge;
  }

  render() {
    for (let i = 0; i < this._cardsArray.length; i++) {
      this.addCard(this._cardsArray[i].link, this._cardsArray[i].name); //add default cards  
    }
  }

  addCard(image, name) {
    const card = new Card(image, name);
    this._container.appendChild(card.create());
    card.onImageClick((image) => this._popupEnlarge.open(image));
  }
}