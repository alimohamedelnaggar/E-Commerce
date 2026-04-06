import { products, getFeatured, getNewArrivals, getBestSellers } from "./products.api.js";
import { renderSection } from "./products.ui.js";

export function initProducts() {
  renderSection(document.getElementById("products-grid"), products);
  renderSection(document.getElementById("featured-grid"), getFeatured());
  renderSection(document.getElementById("arrivals-grid"), getNewArrivals());
  renderSection(document.getElementById("bestsellers-grid"), getBestSellers());

  const tabBtns = document.querySelectorAll("[data-products-tab]");
  tabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      tabBtns.forEach(b => b.classList.remove("tab--active"));
      btn.classList.add("tab--active");
      const filter = btn.dataset.productsTab;
      const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
      renderSection(document.getElementById("products-grid"), filtered);
    });
  });
}
