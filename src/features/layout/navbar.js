import { getCartCount } from "../cart/cart.api.js";
import { getCurrentUser, logoutUser } from "../auth/auth.api.js";

function setBackdropTop(navbar) {
  const backdrop = navbar.querySelector("[data-nav-backdrop]");
  if (!backdrop) return;
  const h = navbar.getBoundingClientRect().height;
  backdrop.style.setProperty("--nav-backdrop-top", `${h}px`);
}

export function initNavbar() {
  const navbar = document.querySelector("[data-navbar]");
  const toggle = navbar?.querySelector(".menu-toggle");
  const navActions = navbar?.querySelector(".nav-actions");
  const backdrop = navbar?.querySelector("[data-nav-backdrop]");

  if (!navbar || !toggle || !navActions) return;

  const mq = window.matchMedia("(max-width: 1024px)");

  function closeMenu() {
    navbar.classList.remove("is-menu-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    if (backdrop) {
      backdrop.hidden = true;
      backdrop.setAttribute("aria-hidden", "true");
    }
    document.body.style.overflow = "";
  }

  function openMenu() {
    setBackdropTop(navbar);
    navbar.classList.add("is-menu-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Close menu");
    if (backdrop) {
      backdrop.hidden = false;
      backdrop.setAttribute("aria-hidden", "false");
    }
    if (mq.matches) document.body.style.overflow = "hidden";
  }

  function isOpen() {
    return navbar.classList.contains("is-menu-open");
  }

  toggle.addEventListener("click", () => {
    if (isOpen()) closeMenu();
    else openMenu();
  });

  backdrop?.addEventListener("click", closeMenu);

  navActions.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (mq.matches) closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) {
      closeMenu();
      toggle.focus();
    }
  });

  const onMqChange = () => {
    if (!mq.matches) closeMenu();
  };
  if (typeof mq.addEventListener === "function") {
    mq.addEventListener("change", onMqChange);
  } else if (typeof mq.addListener === "function") {
    mq.addListener(onMqChange);
  }

  window.addEventListener(
    "resize",
    () => {
      if (isOpen()) setBackdropTop(navbar);
    },
    { passive: true }
  );

  // --- CART BADGE LOGIC ---
  const cartBadge = navbar.querySelector(".cart-badge");
  function updateBadge() {
    if (!cartBadge) return;
    const count = getCartCount();
    cartBadge.textContent = count;
    cartBadge.setAttribute("data-cart-count", count);
  }
  updateBadge();
  window.addEventListener("cartUpdated", updateBadge);

  // --- AUTH LOGIC ---
  const authContainer = navbar.querySelector(".nav-auth");
  function updateAuth() {
    if (!authContainer) return;
    const user = getCurrentUser();
    if (user) {
      authContainer.innerHTML = `
        <span class="nav-user-greeting" style="font-weight: 600; color: #0f172a; margin-right: 0.5rem;">Hi, ${user.name.split(' ')[0]}</span>
        <button type="button" class="nav-btn nav-btn--ghost" id="nav-logout">Log out</button>
      `;
      const logoutBtn = authContainer.querySelector("#nav-logout");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          logoutUser();
        });
      }
    } else {
      authContainer.innerHTML = `
        <a href="login.html" class="nav-btn nav-btn--ghost">Log in</a>
        <a href="register.html" class="nav-btn nav-btn--primary">Register</a>
      `;
    }
  }
  updateAuth();
  window.addEventListener("sessionUpdated", updateAuth);
}
