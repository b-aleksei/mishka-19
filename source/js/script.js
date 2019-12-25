var modal = document.querySelector('.modal-container'),
navButton = document.querySelector('.header__menu-opener'),
openModal = document.querySelector('.product-info__button'),
openModalCart = document.querySelectorAll('.catalog-goods__cart'),
closeModal = document.querySelector('.modal__add-to-cart'),
navMain = document.querySelector('.header');

navMain.classList.remove('header--no-js');

navButton.addEventListener('click', function () {
  navMain.classList.toggle('header--opened');
});

try {
openModal.addEventListener('click', function (evt) {
    evt.preventDefault();
    modal.classList.add('visible');
  });
} catch (e) {
  console.log(e)
}

for(var i = 0; i < openModalCart.length; i++) {
openModalCart[i].addEventListener('click', function (evt) {
  evt.preventDefault();
  modal.classList.add('visible');
});
}

closeModal.addEventListener('click', function (evt) {
  evt.preventDefault();
  modal.classList.remove('visible');
});
