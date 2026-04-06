import { getCart, clearCart } from "../features/cart/cart.api.js";
import { products } from "../features/products/products.api.js";

const layout = document.getElementById("co-layout");
const itemsList = document.getElementById("co-items-list");
const subtotalEl = document.getElementById("co-subtotal");
const shippingEl = document.getElementById("co-shipping");
const totalEl = document.getElementById("co-total");
const form = document.getElementById("checkout-form");
const submitBtn = document.getElementById("submit-btn");

function init() {
  const cartData = getCart();

  if (cartData.length === 0) {
    // Empty cart protection => Redirect back to products
    window.location.replace("cart.html");
    return;
  }

  // Calculate & render summary
  const items = cartData.map(item => {
    const p = products.find(prod => prod.id === item.id);
    return { ...p, qty: item.qty };
  }).filter(item => item.id);

  if (items.length === 0) {
    window.location.replace("cart.html");
    return;
  }

  let subtotal = 0;
  itemsList.innerHTML = items.map(item => {
    const itemTotal = item.price * item.qty;
    subtotal += itemTotal;
    
    return `
      <div class="co-item">
        <div class="co-item__img-wrap">
          <img src="${item.image}" alt="${item.name}" class="co-item__img" />
          <span class="co-item__qty">${item.qty}</span>
        </div>
        <div class="co-item__info">
          <p class="co-item__name">${item.name}</p>
          <span class="co-item__price">$${itemTotal.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join("");

  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
  shippingEl.textContent = shipping === 0 ? "Free" : `$${shipping.toLocaleString()}`;
  shippingEl.className = shipping === 0 ? "co-totals-row--highlight" : "";
  totalEl.textContent = `$${total.toLocaleString()}`;

  // Reveal layout
  layout.hidden = false;

  // Handle simulated form processing
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    processOrder();
  });
}

function processOrder() {
  // Setup loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Processing secure payment...";

  // Simulate network delay
  setTimeout(() => {
    clearCart(); // Clear out local storage cart

    // Build success modal
    const modalHTML = `
      <div class="co-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="co-modal__content">
          <div class="co-modal__icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 id="modal-title" class="co-modal__title">Order Confirmed!</h2>
          <p class="co-modal__desc">Thank you for your purchase. We've sent a confirmation to your email.</p>
          <p style="font-size: 0.85rem; color: #94a3b8;">Redirecting to homepage...</p>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);

    // Redirect to home after showing modal
    setTimeout(() => {
      window.location.replace("index.html");
    }, 3500);

  }, 1800); // 1.8s artificial delay
}

// Boot up
init();
