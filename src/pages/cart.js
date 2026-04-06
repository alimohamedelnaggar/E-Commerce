import { getCart, updateQuantity, removeFromCart, getCartCount } from "../features/cart/cart.api.js";
import { products } from "../features/products/products.api.js";
import { initNavbar } from "../features/layout/navbar.js";

// Initialize global nav
initNavbar();

const layout = document.getElementById("cart-layout");
const subtitle = document.getElementById("cart-header-sub");

function renderEmptyCart() {
  subtitle.textContent = "Your cart is empty.";
  layout.innerHTML = `
    <div class="cart-empty" style="grid-column: 1 / -1;">
      <p style="font-size: 3rem; margin: 0 0 1rem;">🛒</p>
      <h2>Your cart is empty!</h2>
      <p>Browse our catalog and discover our amazing deals.</p>
      <a href="product.html" class="cart-empty-btn">Shop Now</a>
    </div>
  `;
}

function render() {
  const cartData = getCart();
  const count = getCartCount();
  
  if (cartData.length === 0) {
    renderEmptyCart();
    return;
  }

  subtitle.textContent = `You have ${count} item${count === 1 ? '' : 's'} in your cart.`;

  // Hydrate cart data with product catalog details
  const items = cartData.map(item => {
    const productDef = products.find(p => p.id === item.id);
    return { ...productDef, qty: item.qty };
  }).filter(item => item.id); // Filter out orphans

  if (items.length === 0) {
    renderEmptyCart();
    return;
  }

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
  const total = subtotal + shipping;

  const itemsHTML = items.map(item => `
    <article class="cart-item">
      <img src="${item.image}" alt="${item.name}" class="cart-item__img" />
      <div class="cart-item__details">
        <h3 class="cart-item__name">${item.name}</h3>
        <p class="cart-item__category">${item.category}</p>
        <div class="cart-item__actions">
          <div class="qty-control">
            <button class="qty-btn qty-btn--minus" data-id="${item.id}" aria-label="Decrease quantity">−</button>
            <input type="number" class="qty-input" data-id="${item.id}" value="${item.qty}" min="1" max="99" aria-label="Quantity" />
            <button class="qty-btn qty-btn--plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="cart-item__remove" data-id="${item.id}">Remove</button>
        </div>
        <div class="cart-item__price-block">
          <span class="cart-item__price">$${(item.price * item.qty).toLocaleString()}</span>
        </div>
      </div>
    </article>
  `).join("");

  layout.innerHTML = `
    <div class="cart-list">
      ${itemsHTML}
    </div>
    <aside class="cart-summary" aria-labelledby="summary-title">
      <h2 id="summary-title" class="cart-summary__title">Order Summary</h2>
      
      <div class="cart-summary__row">
        <span>Subtotal</span>
        <span>$${subtotal.toLocaleString()}</span>
      </div>
      <div class="cart-summary__row">
        <span>Estimated Shipping</span>
        <span class="${shipping === 0 ? 'cart-summary__row--free' : ''}">${shipping === 0 ? 'Free' : `$${shipping.toLocaleString()}`}</span>
      </div>
      
      <div class="cart-summary__divider"></div>
      
      <div class="cart-summary__total">
        <span>Total</span>
        <span>$${total.toLocaleString()}</span>
      </div>
      
      <a href="checkout.html" class="cart-summary__btn">Proceed to Checkout</a>
      
      <div class="cart-trust">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Secure encryption guarantees safe checkout
      </div>
    </aside>
  `;

  // Bind events
  bindEvents();
}

function bindEvents() {
  // Update via input change
  document.querySelectorAll(".qty-input").forEach(input => {
    input.addEventListener("change", (e) => {
      const id = parseInt(e.target.dataset.id, 10);
      let qty = parseInt(e.target.value, 10);
      if (isNaN(qty) || qty < 1) qty = 1;
      updateQuantity(id, qty);
      render();
    });
  });

  // Minus button
  document.querySelectorAll(".qty-btn--minus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id, 10);
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      if (input) {
        const qty = Math.max(1, parseInt(input.value, 10) - 1);
        updateQuantity(id, qty);
        render();
      }
    });
  });

  // Plus button
  document.querySelectorAll(".qty-btn--plus").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id, 10);
      const input = document.querySelector(`.qty-input[data-id="${id}"]`);
      if (input) {
        const qty = Math.min(99, parseInt(input.value, 10) + 1);
        updateQuantity(id, qty);
        render();
      }
    });
  });

  // Remove button
  document.querySelectorAll(".cart-item__remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(e.currentTarget.dataset.id, 10);
      removeFromCart(id);
      render();
    });
  });
}

// Global listener to re-render if updated outside (e.g. storage events from another tab)
window.addEventListener("cartUpdated", () => {
  render();
});

// Initial boot
render();
