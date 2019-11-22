let navMain = document.querySelector('.header');
let navButton = document.querySelector('.header__menu-opener');

navMain.classList.remove('header--no-js');

navButton.addEventListener('click', function () {
  if(navMain.classList.contains('header--opened')) {
    navMain.classList.remove('header--opened');
  } else {
  navMain.classList.add('header--opened')
  }
});
