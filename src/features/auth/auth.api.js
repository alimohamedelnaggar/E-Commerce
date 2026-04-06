/**
 * Core Auth API simulating a backend via localStorage.
 */

const USERS_KEY = "techstore_users";
const SESSION_KEY = "techstore_session";

/**
 * Get all registered users.
 */
function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

/**
 * Get the currently logged-in user.
 * @returns {Object|null}
 */
export function getCurrentUser() {
  try {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

/**
 * Register a new completely fake user.
 * @returns {Promise} Resolves if successful, rejects with error string if failed.
 */
export function registerUser(name, email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        return reject("An account with this email already exists.");
      }
      
      const newUser = { id: Date.now(), name, email, password };
      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      // Auto-login
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: newUser.id, name: newUser.name, email: newUser.email }));
      window.dispatchEvent(new Event("sessionUpdated"));
      resolve(newUser);
    }, 800); // Fake network delay
  });
}

/**
 * Attempt to login standard user.
 */
export function loginUser(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (!user) {
        return reject("Invalid email or password.");
      }
      
      localStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, name: user.name, email: user.email }));
      window.dispatchEvent(new Event("sessionUpdated"));
      resolve(user);
    }, 800);
  });
}

/**
 * Logout
 */
export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event("sessionUpdated"));
}
