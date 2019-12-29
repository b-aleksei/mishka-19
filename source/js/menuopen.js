navButton = document.querySelector(".header__menu-opener");
navMain = document.querySelector(".header");

navMain.classList.remove("header--no-js");

navButton.addEventListener("click", function () {
  navMain.classList.toggle("header--opened");
});
