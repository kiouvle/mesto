import "./style.css";
(function () {

  const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5';
  //class for cards
  class Card {
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

  //cards list costructor
  class CardList {
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

  //popup for image
  class PopupEnlarge {
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

  //form popup
  class Popup {
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

  class Api {
    constructor(options) {
      this.baseUrl = options.baseUrl;
      this.headers = options.headers;
    }

    getInitialCards() {
      return fetch(`${this.baseUrl}/cards`, {
        headers: this.headers
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    getUserData() {
      return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers
      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
        })
    }

    setUserData(name, job) {
      return fetch(`${this.baseUrl}/users/me`, {
        headers: this.headers,
        method: 'PATCH',
        body: JSON.stringify({
          name: name,
          about: job
        })

      })
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          return Promise.reject(`Ошибка: ${res.status}`);
        })
    }
  }

  const api = new Api({
    baseUrl: serverUrl,
    headers: {
      authorization: '81152569-9da1-4171-86f0-2be6511ac5c5',
      'Content-Type': 'application/json'
    }
  });

  api.getUserData()
    .then((result) => {
      editData(result.name, result.about, result.avatar);
    })
    .catch((err) => console.log(err));

  const popupEnlarge = new PopupEnlarge(document.querySelector('.popup__enlarge'));
  let cardsList;

  //get cards from server
  api.getInitialCards()
    .then((result) => {
      cardsList = new CardList(document.querySelector('.places-list'), result, popupEnlarge);
      cardsList.render();
    })
    .catch((err) => console.log(err));



  //input check for button
  function inputCheck(first, second, buttonClass) {
    const popupButton = document.querySelector(buttonClass);

    if ((first.length <= 1 || first.length > 30) || (second.length <= 1 || second.length > 30)) {
      popupButton.setAttribute('disabled', true);
      popupButton.removeAttribute('style');
      popupButton.setAttribute('style', 'margin-top: 33px');
    } else {
      popupButton.removeAttribute('disabled');
      popupButton.setAttribute('style', 'background-color: black; color: white');
    }
  };

  //input check for error text in user data
  function errorText() {
    const errName = document.querySelector('.error-text__name');
    const errJob = document.querySelector('.error-text__job');
    const inputJob = document.querySelector('.popup__input_type_job');

    if (formData.elements.name.value.length === 0) {     //check name line
      errName.setAttribute('style', 'display: block');
      errName.textContent = 'Это обязательное поле';
      inputJob.setAttribute('style', 'margin-top: 9px');
    } else if (formData.elements.name.value.length === 1 || formData.elements.name.value.length > 30) {
      errName.setAttribute('style', 'display: block');
      errName.textContent = 'Должно быть от 2 до 30 символов';
      inputJob.setAttribute('style', 'margin-top: 7px');
    } else {
      errName.setAttribute('style', 'display: none');
      inputJob.removeAttribute('style');
    }

    if (formData.elements.job.value.length === 0) {  //check description line
      errJob.setAttribute('style', 'display: block');
      errJob.textContent = 'Это обязательное поле';
    } else if (formData.elements.job.value.length === 1 || formData.elements.job.value.length > 30) {
      errJob.setAttribute('style', 'display: block');
      errJob.textContent = 'Должно быть от 2 до 30 символов';
    } else {
      errJob.setAttribute('style', 'display: none');
    }

  };

  //editing user shit
  function editData(name, job, avatar) {
    const userName = document.querySelector('.user-info__name');
    userName.textContent = name;

    const userJob = document.querySelector('.user-info__job');
    userJob.textContent = job;

    if (avatar) {
      const userAvatar = document.querySelector('.user-info__photo');
      userAvatar.setAttribute('style', 'background-image: url(' + avatar + ')');
    }
  }

  //showing the form
  const popupCard = new Popup(document.querySelector('.popup__card'));
  const addButton = document.querySelector('.user-info__button');
  addButton.addEventListener('click', function (event) {
    popupCard.open();
    inputCheck(form.elements.link.value, form.elements.name.value, '.popup__button_add');
  });

  const editButton = document.querySelector('.user-info__data-edit');
  const popupData = new Popup(document.querySelector('.popup__data'));
  editButton.addEventListener('click', function (event) {
    popupData.open();
    formData.elements.name.value = document.querySelector('.user-info__name').textContent;
    formData.elements.job.value = document.querySelector('.user-info__job').textContent;
    inputCheck(formData.elements.name.value, formData.elements.job.value, '.popup__button_data');
  });

  //user cards addition
  const form = document.forms.new;

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    const form = event.currentTarget;
    cardsList.addCard(form.elements.link.value, form.elements.name.value); //add user cards
    popupCard.close();     //popup close after adding
  });

  //button check for card form
  form.addEventListener('keyup', function () { inputCheck(form.elements.link.value, form.elements.name.value, '.popup__button_add') }); //check user input

  //click the button and get ur shit
  const formData = document.forms.data;
  formData.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = event.currentTarget;
    //post info to server

    api.setUserData(formData.elements.name.value, formData.elements.job.value)
      .then((result) => {
        popupData.close();
        editData(result.name, result.about, result.avatar);
      })
      .catch((err) => console.log(err));
  });

  //button check for user info
  formData.addEventListener('keyup', function () { inputCheck(formData.elements.name.value, formData.elements.job.value, '.popup__button_data') });

  //error text check for user info
  formData.addEventListener('keyup', errorText);
})();