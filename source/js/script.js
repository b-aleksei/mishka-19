let navMain = document.querySelector('.header');
let navButton = document.querySelector('.header__menu-opener');
let modal = document.querySelector('.modal-container');
let openModal = document.querySelector('.product-info__button');
let openModalcart = document.querySelectorAll('.catalog-goods__cart');
let closeModal = document.querySelector('.modal__add-to-cart');

navMain.classList.remove('header--no-js');

navButton.addEventListener('click', function () {
  navMain.classList.toggle('header--opened')
});

try {
openModal.addEventListener('click', function (evt) {
    evt.preventDefault();
    modal.classList.add('visible');
  });
} catch (e) {
  console.log(e)
}


for(let i = 0; i < openModalcart.length; i++) {

openModalcart[i].addEventListener('click', function (evt) {
  evt.preventDefault();
  modal.classList.add('visible');
});
}

closeModal.addEventListener('click', function (evt) {
  evt.preventDefault();
  modal.classList.remove('visible');
});
