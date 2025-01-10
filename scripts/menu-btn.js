const menuBtnEl = document.querySelector(".menu-btn");

const closeMenuBtnEl = document.querySelector(".close-btn");

const menuContainerEl = document.querySelector(".menu-container");

const overlayEl = document.querySelector(".overlay");

menuBtnEl.addEventListener("click", () => {
    menuContainerEl.classList.add("menu-active");
    overlayEl.classList.add("overlay-active");
})

closeMenuBtnEl.addEventListener("click", () => {
    menuContainerEl.classList.remove("menu-active");
    overlayEl.classList.remove("overlay-active");
})