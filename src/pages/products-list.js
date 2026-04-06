import { products } from "../features/products/products.api.js";
import { renderSection } from "../features/products/products.ui.js";
import { initNavbar } from "../features/layout/navbar.js";

initNavbar();

// State
let state = {
  category: "all",
  maxPrice: 2000,
  minRating: 0,
  featured: false,
  newArrival: false,
  onSale: false,
  sort: "default",
  view: "grid",
};

const grid = document.getElementById("pl-products-grid");
const gridCount = document.getElementById("grid-count");
const resultCount = document.getElementById("result-count");
const noResults = document.getElementById("pl-no-results");
const rangeInput = document.getElementById("price-range");
const rangeOutput = document.getElementById("range-output");
const sortSelect = document.getElementById("sort-select");
const viewGridBtn = document.getElementById("view-grid");
const viewListBtn = document.getElementById("view-list");

// Render
function applyFilters() {
  let list = products.filter((p) => {
    if (state.category !== "all" && p.category !== state.category) return false;
    if (p.price > state.maxPrice) return false;
    if (p.rating < state.minRating) return false;
    if (state.featured && !p.featured) return false;
    if (state.newArrival && !p.newArrival) return false;
    if (state.onSale && !p.oldPrice) return false;
    return true;
  });

  // Sort
  if (state.sort === "price-asc") list = list.sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") list = list.sort((a, b) => b.price - a.price);
  else if (state.sort === "rating") list = list.sort((a, b) => b.rating - a.rating);
  else if (state.sort === "name") list = list.sort((a, b) => a.name.localeCompare(b.name));

  gridCount.textContent = list.length;
  if (resultCount) resultCount.textContent = list.length;

  if (list.length === 0) {
    grid.innerHTML = "";
    noResults.hidden = false;
  } else {
    noResults.hidden = true;
    renderSection(grid, list);
  }

  // Apply view mode class
  grid.classList.toggle("pcard-grid--list", state.view === "list");
}

// Category radio
document.querySelectorAll("input[name='cat']").forEach((r) => {
  r.addEventListener("change", () => {
    state.category = r.value;
    applyFilters();
  });
});

// Rating radio
document.querySelectorAll("input[name='rating']").forEach((r) => {
  r.addEventListener("change", () => {
    state.minRating = parseFloat(r.value);
    applyFilters();
  });
});

// Price range slider
if (rangeInput) {
  rangeInput.addEventListener("input", () => {
    state.maxPrice = parseInt(rangeInput.value, 10);
    rangeOutput.textContent = `Up to $${state.maxPrice.toLocaleString()}`;
    const pMax = document.getElementById("price-max");
    if (pMax) pMax.value = state.maxPrice;
    applyFilters();
  });
}

// Price max input
const priceMaxInput = document.getElementById("price-max");
if (priceMaxInput) {
  priceMaxInput.addEventListener("input", () => {
    const val = Math.min(parseInt(priceMaxInput.value, 10) || 2000, 2000);
    state.maxPrice = val;
    if (rangeInput) rangeInput.value = val;
    if (rangeOutput) rangeOutput.textContent = `Up to $${val.toLocaleString()}`;
    applyFilters();
  });
}

// Checkboxes
document.getElementById("filter-featured")?.addEventListener("change", (e) => { state.featured = e.target.checked; applyFilters(); });
document.getElementById("filter-new")?.addEventListener("change", (e) => { state.newArrival = e.target.checked; applyFilters(); });
document.getElementById("filter-sale")?.addEventListener("change", (e) => { state.onSale = e.target.checked; applyFilters(); });

// Sort
sortSelect?.addEventListener("change", () => { state.sort = sortSelect.value; applyFilters(); });

// View toggle
function setView(mode) {
  state.view = mode;
  viewGridBtn.classList.toggle("pl-view-btn--active", mode === "grid");
  viewGridBtn.setAttribute("aria-pressed", mode === "grid");
  viewListBtn.classList.toggle("pl-view-btn--active", mode === "list");
  viewListBtn.setAttribute("aria-pressed", mode === "list");
  applyFilters();
}
viewGridBtn?.addEventListener("click", () => setView("grid"));
viewListBtn?.addEventListener("click", () => setView("list"));

// Reset
function resetAll() {
  state = { category: "all", maxPrice: 2000, minRating: 0, featured: false, newArrival: false, onSale: false, sort: "default", view: state.view };
  document.querySelectorAll("input[name='cat']")[0].checked = true;
  document.querySelectorAll("input[name='rating']")[0].checked = true;
  document.querySelectorAll("input[type='checkbox']").forEach(c => c.checked = false);
  if (rangeInput) rangeInput.value = 2000;
  if (rangeOutput) rangeOutput.textContent = "Up to $2000";
  if (sortSelect) sortSelect.value = "default";
  applyFilters();
}
document.getElementById("reset-filters")?.addEventListener("click", resetAll);
document.getElementById("pl-no-results-reset")?.addEventListener("click", resetAll);

// Read URL param for pre-filtering (e.g. ?cat=laptop)
const urlCat = new URLSearchParams(location.search).get("cat");
if (urlCat) {
  state.category = urlCat;
  const radio = document.querySelector(`input[name='cat'][value='${urlCat}']`);
  if (radio) radio.checked = true;
}

// Init
applyFilters();
