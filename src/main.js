import { initNavbar } from "./features/layout/navbar.js";
import { initCategoryPage } from "./features/category/category-page.js";
import { initProducts } from "./features/products/products.controller.js";

function runWhenDomReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn, { once: true });
  } else {
    fn();
  }
}

function initCountdownTimer() {
  const hEl = document.getElementById("timer-h");
  const mEl = document.getElementById("timer-m");
  const sEl = document.getElementById("timer-s");
  if (!hEl) return;

  // 12-hour countdown anchored to midnight each day
  function tick() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(12, 0, 0, 0);
    if (now >= midnight) midnight.setDate(midnight.getDate() + 1);
    const diff = Math.max(0, Math.floor((midnight - now) / 1000));
    const h = Math.floor(diff / 3600);
    const m = Math.floor((diff % 3600) / 60);
    const s = diff % 60;
    hEl.textContent = String(h).padStart(2, "0");
    mEl.textContent = String(m).padStart(2, "0");
    sEl.textContent = String(s).padStart(2, "0");
  }
  tick();
  setInterval(tick, 1000);
}

runWhenDomReady(() => {
  initNavbar();
  initCategoryPage();
  initProducts();
  initCountdownTimer();
});


// document.addEventListener("DOMContentLoaded", () => {
//   initProducts();
// });