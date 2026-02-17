import "./main.scss";
import { initContactForm } from "./modules/contact";
import { initProjectSlider } from "./modules/slider";

document.addEventListener("DOMContentLoaded", () => {
  initContactForm();
  initProjectSlider();
});
