import { products } from "../features/products/products.api.js";
import { productCardHTML } from "../features/products/products.ui.js";
import { initNavbar } from "../features/layout/navbar.js";
import { addToCart } from "../features/cart/cart.api.js";

initNavbar();

const main = document.getElementById("pd-main");
const loading = document.getElementById("pd-loading");

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) s += "★";
    else if (i === full && half) s += "½";
    else s += "☆";
  }
  return s;
}

function getParam() {
  return parseInt(new URLSearchParams(location.search).get("id"), 10);
}

function render(p) {
  const relatedList = products.filter(r => r.category === p.category && r.id !== p.id).slice(0, 4);
  const discount = p.oldPrice
    ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)
    : null;

  // Features / specs (derived from product data)
  const specs = [
    { label: "Category", value: p.category.charAt(0).toUpperCase() + p.category.slice(1) },
    { label: "Rating", value: `${p.rating} / 5.0 (${p.reviews} reviews)` },
    { label: "Price", value: `$${p.price.toLocaleString()}` },
    p.oldPrice ? { label: "Original Price", value: `$${p.oldPrice.toLocaleString()}` } : null,
    p.badge ? { label: "Badge", value: p.badge } : null,
    { label: "Availability", value: "In Stock" },
    { label: "Warranty", value: "1 Year Official Warranty" },
    { label: "Shipping", value: "Free — Delivered in 48 hours" },
  ].filter(Boolean);

  const specsHTML = specs.map(s => `
    <div class="pd-spec-row">
      <dt class="pd-spec-label">${s.label}</dt>
      <dd class="pd-spec-value">${s.value}</dd>
    </div>
  `).join("");

  const relatedHTML = relatedList.length
    ? `<section class="pd-related sec" aria-labelledby="related-title">
        <div class="sec__inner">
          <header class="sec__head">
            <p class="sec__eyebrow">More Like This</p>
            <h2 id="related-title" class="sec__title">Related Products</h2>
          </header>
          <div class="pcard-grid">${relatedList.map(productCardHTML).join("")}</div>
        </div>
      </section>`
    : "";

  main.innerHTML = `
    <!-- Breadcrumb -->
    <div class="pd-breadcrumb-wrap">
      <div class="pd-breadcrumb-inner">
        <nav class="breadcrumb" aria-label="Breadcrumb">
          <ol>
            <li><a href="index.html">Home</a></li>
            <li><a href="product.html">Products</a></li>
            <li aria-current="page">${p.name}</li>
          </ol>
        </nav>
      </div>
    </div>

    <!-- Main detail -->
    <div class="pd-wrapper">
      <div class="pd-inner">

        <!-- Image gallery -->
        <div class="pd-gallery">
          <div class="pd-gallery__main">
            ${p.badge ? `<span class="pcard__badge pcard__badge--${p.badge.toLowerCase().replace(/\s/g,"-")}">${p.badge}</span>` : ""}
            <img id="pd-main-img" src="${p.image}" alt="${p.name}" />
          </div>
          <!-- Thumbnails: same image shown 3 times as demo -->
          <div class="pd-gallery__thumbs" role="list" aria-label="Product images">
            ${[p.image, p.image, p.image].map((img, i) => `
              <button class="pd-thumb ${i === 0 ? "pd-thumb--active" : ""}" role="listitem" data-img="${img}" aria-label="Image ${i + 1}">
                <img src="${img}" alt="${p.name} view ${i + 1}" />
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Info panel -->
        <div class="pd-info">
          <p class="pd-category">${p.category}</p>
          <h1 class="pd-name">${p.name}</h1>

          <div class="pd-rating-row">
            <span class="pd-stars" aria-label="${p.rating} out of 5 stars">${renderStars(p.rating)}</span>
            <span class="pd-rating-score">${p.rating}</span>
            <span class="pd-rating-count">(${p.reviews} reviews)</span>
          </div>

          <div class="pd-price-block">
            <span class="pd-price">$${p.price.toLocaleString()}</span>
            ${p.oldPrice ? `<span class="pd-old-price">$${p.oldPrice.toLocaleString()}</span>` : ""}
            ${discount ? `<span class="pd-discount">${discount}% OFF</span>` : ""}
          </div>

          <p class="pd-description">
            Experience the next level of performance with the ${p.name}. Engineered for professionals and enthusiasts alike, delivering outstanding quality and reliability backed by our official warranty and 48-hour delivery.
          </p>

          <div class="pd-quantity-row">
            <label class="pd-qty-label" for="pd-qty">Quantity</label>
            <div class="pd-qty-control">
              <button class="pd-qty-btn" id="pd-qty-minus" aria-label="Decrease quantity">−</button>
              <input id="pd-qty" class="pd-qty-input" type="number" value="1" min="1" max="99" aria-label="Quantity" />
              <button class="pd-qty-btn" id="pd-qty-plus" aria-label="Increase quantity">+</button>
            </div>
          </div>

          <div class="pd-actions">
            <button class="pd-btn pd-btn--primary" id="pd-add-cart" data-id="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Add to Cart
            </button>
            <button class="pd-btn pd-btn--wish" id="pd-wishlist" aria-label="Add to wishlist" data-id="${p.id}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          <!-- Trust badges -->
          <div class="pd-trust">
            <div class="pd-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Official Warranty</span>
            </div>
            <div class="pd-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <span>Free 48h Delivery</span>
            </div>
            <div class="pd-trust-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.51"/></svg>
              <span>Easy Returns</span>
            </div>
          </div>

          <!-- Specs -->
          <div class="pd-specs">
            <h2 class="pd-specs-title">Product Specs</h2>
            <dl class="pd-specs-list">${specsHTML}</dl>
          </div>
        </div>

      </div>
    </div>

    ${relatedHTML}
  `;

  // Thumbnails click
  document.querySelectorAll(".pd-thumb").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".pd-thumb").forEach(b => b.classList.remove("pd-thumb--active"));
      btn.classList.add("pd-thumb--active");
      document.getElementById("pd-main-img").src = btn.dataset.img;
    });
  });

  // Quantity controls
  const qtyInput = document.getElementById("pd-qty");
  document.getElementById("pd-qty-minus")?.addEventListener("click", () => {
    qtyInput.value = Math.max(1, parseInt(qtyInput.value, 10) - 1);
  });
  document.getElementById("pd-qty-plus")?.addEventListener("click", () => {
    qtyInput.value = Math.min(99, parseInt(qtyInput.value, 10) + 1);
  });

  // Add to cart feedback
  document.getElementById("pd-add-cart")?.addEventListener("click", (e) => {
    addToCart(p.id, parseInt(qtyInput.value, 10));

    const btn = e.currentTarget;
    btn.textContent = "✓ Added!";
    btn.classList.add("pd-btn--added");
    setTimeout(() => {
      btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> Add to Cart`;
      btn.classList.remove("pd-btn--added");
    }, 2000);
  });

  // Wishlist toggle
  document.getElementById("pd-wishlist")?.addEventListener("click", (e) => {
    e.currentTarget.classList.toggle("pd-btn--wished");
  });

  // Update page title
  document.title = `${p.name} — TechStore`;
}

function renderNotFound() {
  main.innerHTML = `
    <div class="pd-not-found">
      <p class="pd-not-found__emoji">🔍</p>
      <h1>Product not found</h1>
      <p>We couldn't find the product you're looking for.</p>
      <a href="product.html" class="pd-btn pd-btn--primary">Browse All Products</a>
    </div>
  `;
}

// Boot
const id = getParam();
loading.hidden = false;

setTimeout(() => {
  loading.hidden = true;
  if (!id) { renderNotFound(); return; }
  const product = products.find(p => p.id === id);
  if (!product) { renderNotFound(); return; }
  render(product);
}, 200);
