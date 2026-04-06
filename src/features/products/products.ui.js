import { addToCart } from "../cart/cart.api.js";

/* Shared card renderer used by all four sections */
export function productCardHTML(p) {
  const stars = renderStars(p.rating);
  const discount = p.oldPrice
    ? `<span class="pcard__discount">-${Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100)}%</span>`
    : "";
  const oldPriceHTML = p.oldPrice
    ? `<span class="pcard__old-price">$${p.oldPrice.toLocaleString()}</span>`
    : "";
  const badgeHTML = p.badge
    ? `<span class="pcard__badge pcard__badge--${p.badge.toLowerCase().replace(/\s/g, "-")}">${p.badge}</span>`
    : "";

  return `
    <article class="pcard" data-id="${p.id}">
      <a href="product-detail.html?id=${p.id}" class="pcard__link-wrap">
        <div class="pcard__img-wrap">
          ${badgeHTML}
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <div class="pcard__overlay">
            <span class="pcard__quick-view">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              View Details
            </span>
          </div>
        </div>
      </a>
      <div class="pcard__body">
        <p class="pcard__category">${p.category}</p>
        <a href="product-detail.html?id=${p.id}" style="text-decoration: none;">
          <h3 class="pcard__name">${p.name}</h3>
        </a>
        <div class="pcard__rating">
          ${stars}
          <span class="pcard__reviews">(${p.reviews})</span>
        </div>
        <div class="pcard__price-row">
          <span class="pcard__price">$${p.price.toLocaleString()}</span>
          ${oldPriceHTML}
          ${discount}
        </div>
        <div class="pcard__actions">
          <button type="button" class="pcard__btn pcard__btn--cart" data-id="${p.id}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            Add to Cart
          </button>
          <button type="button" class="pcard__btn pcard__btn--wish" data-id="${p.id}" aria-label="Wishlist">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = "";
  for (let i = 0; i < 5; i++) {
    if (i < full) {
      html += `<svg class="star star--full" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    } else if (i === full && half) {
      html += `<svg class="star star--half" width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><defs><clipPath id="half-clip-${rating}"><rect x="0" y="0" width="12" height="24"/></clipPath></defs><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" clip-path="url(#half-clip-${rating})"/><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
    } else {
      html += `<svg class="star star--empty" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
  }
  return html;
}

export function renderSection(container, productList) {
  if (!container) return;
  container.innerHTML = productList.map(productCardHTML).join("");
}

// Global event delegation for product card "Add to Cart" buttons
document.addEventListener("click", (e) => {
  const cartBtn = e.target.closest(".pcard__btn--cart");
  if (cartBtn) {
    const id = parseInt(cartBtn.dataset.id, 10);
    if (!isNaN(id)) {
      addToCart(id, 1);
      
      const originalText = cartBtn.innerHTML;
      cartBtn.innerHTML = "✓ Added!";
      cartBtn.style.background = "#10b981";
      cartBtn.style.color = "white";
      cartBtn.style.borderColor = "#059669";

      setTimeout(() => {
        cartBtn.innerHTML = originalText;
        cartBtn.style.background = "";
        cartBtn.style.color = "";
        cartBtn.style.borderColor = "";
      }, 1500);
    }
  }
});