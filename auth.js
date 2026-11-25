
const USERS_KEY = "view_livestream_users";
const SESSION_KEY = "view_livestream_user";

function readJSON(key, fallback) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return v ?? fallback;
  } catch (e) {
    return fallback;
  }
}

function getUsers() {
  return readJSON(USERS_KEY, []);
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getCurrentUser() {
  return readJSON(SESSION_KEY, null);
}

function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function logOut() {
  localStorage.removeItem(SESSION_KEY);
  updateNavAuth();
  window.dispatchEvent(new Event("authchange"));
}

async function hashPassword(text) {
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return "x" + h;
}

function updateNavAuth() {
  const link = document.getElementById("navAuthLink");
  if (!link) return;
  const user = getCurrentUser();
  link.textContent = user ? "Log Out" : "Log In / Sign Up";
  link.title = user ? `Signed in as ${user.name}` : "";
  link.setAttribute("href", user ? "#" : "login.html");
}

document.addEventListener("DOMContentLoaded", () => {
  updateNavAuth();
  const link = document.getElementById("navAuthLink");
  if (link) {
    link.addEventListener("click", (event) => {
      if (getCurrentUser()) {
        event.preventDefault();
        logOut();
      }
    });
  }
});
