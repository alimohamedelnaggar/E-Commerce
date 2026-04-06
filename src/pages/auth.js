import { loginUser, registerUser } from "../features/auth/auth.api.js";

// Handle shared auth logic between screens
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const errorBox = document.getElementById("auth-error");
const submitBtn = document.getElementById("auth-submit-btn");

function showError(msg) {
  errorBox.textContent = msg;
  errorBox.classList.add("is-visible");
}
function hideError() {
  errorBox.classList.remove("is-visible");
}
function setLoading(isLoading) {
  submitBtn.disabled = isLoading;
  if (isLoading) {
    submitBtn.dataset.origText = submitBtn.textContent;
    submitBtn.textContent = "Please wait...";
  } else {
    submitBtn.textContent = submitBtn.dataset.origText;
  }
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    setLoading(true);
    const email = document.getElementById("login-email").value;
    const pass = document.getElementById("login-pass").value;

    try {
      await loginUser(email, pass);
      window.location.replace("index.html");
    } catch (err) {
      showError(err);
      setLoading(false);
    }
  });
}

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();
    setLoading(true);
    const name = document.getElementById("reg-name").value;
    const email = document.getElementById("reg-email").value;
    const pass = document.getElementById("reg-pass").value;

    try {
      await registerUser(name, email, pass);
      window.location.replace("index.html");
    } catch (err) {
      showError(err);
      setLoading(false);
    }
  });
}
