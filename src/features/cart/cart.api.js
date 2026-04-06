/**
 * Core Cart API using localStorage to persist cart state.
 * Emits a "cartUpdated" window event whenever the cart changes so that
 * UI components (like the Navbar badge) can react instantly worldwide.
 */

const CART_KEY = "techstore_cart";

/**
 * Retrieve the current cart from local storage.
 * @returns {Array<{id: number, qty: number}>}
 */
export function getCart() {
  try {
    const data = localStorage.getItem(CART_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse cart data", error);
    return [];
  }
}

/**
 * Save the cart to local storage and dispatch update event.
 */
function saveCart(cartData) {
  localStorage.setItem(CART_KEY, JSON.stringify(cartData));
  window.dispatchEvent(new Event("cartUpdated"));
}

/**
 * Add a product to the cart or increment its quantity if it exists.
 * @param {number} productId 
 * @param {number} qty 
 */
export function addToCart(productId, qty = 1) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.qty += qty;
  } else {
    cart.push({ id: productId, qty });
  }

  saveCart(cart);
}

/**
 * Remove a specific product completely from the cart.
 * @param {number} productId 
 */
export function removeFromCart(productId) {
  const cart = getCart();
  const updatedCart = cart.filter((item) => item.id !== productId);
  saveCart(updatedCart);
}

/**
 * Update the quantity for a specific product.
 * @param {number} productId 
 * @param {number} qty 
 */
export function updateQuantity(productId, qty) {
  if (qty <= 0) {
    removeFromCart(productId);
    return;
  }

  const cart = getCart();
  const item = cart.find((item) => item.id === productId);
  if (item) {
    item.qty = qty;
    saveCart(cart);
  }
}

/**
 * Get the total number of physical items in the cart (sum of all quantities).
 * @returns {number}
 */
export function getCartCount() {
  return getCart().reduce((total, item) => total + item.qty, 0);
}

/**
 * Clear the entire cart.
 */
export function clearCart() {
  saveCart([]);
}
