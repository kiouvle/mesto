import "./style.css";

import Api from './blocks/api/api.js';
import Popup from './blocks/popup/__form/popup__form.js';
import PopupEnlarge from './blocks/popup/__image/popup__image.js';
import CardList from './blocks/places-list/places-list.js';

(function () {

  const serverUrl = NODE_ENV === 'development' ? 'http://praktikum.tk/cohort5' : 'https://praktikum.tk/cohort5';

  let cardsList = null;
  const popupEnlarge = new PopupEnlarge(document.querySelector('.popup__enlarge'));

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

    if ((first.length <= 1 || first.length > 300) || (second.length <= 1 || second.length > 30)) {
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

    if (nameField.value.length === 0) {     //check name line
      errName.setAttribute('style', 'display: block');
      errName.textContent = 'Это обязательное поле';
      inputJob.setAttribute('style', 'margin-top: 9px');
    } else if (nameField.value.length === 1 || nameField.value.length > 30) {
      errName.setAttribute('style', 'display: block');
      errName.textContent = 'Должно быть от 2 до 30 символов';
      inputJob.setAttribute('style', 'margin-top: 7px');
    } else {
      errName.setAttribute('style', 'display: none');
      inputJob.removeAttribute('style');
    }

    if (jobField.length === 0) {  //check description line
      errJob.setAttribute('style', 'display: block');
      errJob.textContent = 'Это обязательное поле';
    } else if (jobField.value.length === 1 || jobField.value.length > 30) {
      errJob.setAttribute('style', 'display: block');
      errJob.textContent = 'Должно быть от 2 до 30 символов';
    } else {
      errJob.setAttribute('style', 'display: none');
    }

  };

  const userName = document.querySelector('.user-info__name');
  const userJob = document.querySelector('.user-info__job');
  const userAvatar = document.querySelector('.user-info__photo');

  //editing user shit
  function editData(name, job, avatar) {
    userName.textContent = name;
    userJob.textContent = job;

    if (avatar) {
      userAvatar.setAttribute('style', 'background-image: url(' + avatar + ')');
    }
  }

  //showing the form
  const popupCard = new Popup(document.querySelector('.popup__card'));
  const addButton = document.querySelector('.user-info__button');

  //user cards addition
  const addCardForm = document.forms.new;
  const placeNameField = addCardForm.elements.name;
  const placePucUrlField = addCardForm.elements.link;

  addButton.addEventListener('click', () => {
    popupCard.open();
    inputCheck(placePucUrlField.value, placeNameField.value, '.popup__button_add');
  });

  addCardForm.addEventListener('submit', () => {
    event.preventDefault();
    cardsList.addCard(placePucUrlField.value, placeNameField.value); //add user cards
    popupCard.close(); //popup close after adding
  });

  //button check for card form
  addCardForm.addEventListener('keyup', function () { inputCheck(placePucUrlField.value, placeNameField.value, '.popup__button_add') }); //check user input

  const editPersonalInfoForm = document.forms.data;
  const jobField = editPersonalInfoForm.elements.job;
  const nameField = editPersonalInfoForm.elements.name;

  const editButton = document.querySelector('.user-info__data-edit');
  const popupData = new Popup(document.querySelector('.popup__data'));

  editButton.addEventListener('click', function (event) {
    popupData.open();
    nameField.value = document.querySelector('.user-info__name').textContent;
    jobField.value = document.querySelector('.user-info__job').textContent;
    inputCheck(nameField.value, jobField.value, '.popup__button_data');
  });

  //click the button and get ur shit  
  editPersonalInfoForm.addEventListener('submit', () => {
    event.preventDefault();

    //post info to server
    api.setUserData(nameField.value, jobField.value)
      .then((result) => {
        popupData.close();
        editData(result.name, result.about, result.avatar);
      })
      .catch((err) => console.log(err));
  });

  //button check for user info
  editPersonalInfoForm.addEventListener('keyup', function () { inputCheck(nameField.value, jobField.value, '.popup__button_data') });

  //error text check for user info
  editPersonalInfoForm.addEventListener('keyup', errorText);
})();