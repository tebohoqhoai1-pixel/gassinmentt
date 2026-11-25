
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const authTabs = document.getElementById("authTabs");
const tabLogin = document.getElementById("tabLogin");
const tabSignup = document.getElementById("tabSignup");
const signedInView = document.getElementById("signedInView");
const authTitle = document.getElementById("authTitle");
const formFeedback = document.getElementById("formFeedback");

function showAuthMessage(text, type) {
  formFeedback.innerHTML = "";
  const div = document.createElement("div");
  div.className = `alert alert-${type} py-2 small`;
  div.textContent = text;
  formFeedback.appendChild(div);
}

function showTab(which) {
  const login = which === "login";
  loginForm.classList.toggle("d-none", !login);
  signupForm.classList.toggle("d-none", login);
  tabLogin.classList.toggle("active", login);
  tabSignup.classList.toggle("active", !login);
  formFeedback.innerHTML = "";
}

function renderAuthState() {
  const user = getCurrentUser();
  authTabs.classList.toggle("d-none", !!user);
  signedInView.classList.toggle("d-none", !user);
  if (user) {
    loginForm.classList.add("d-none");
    signupForm.classList.add("d-none");
    document.getElementById("welcomeName").textContent = user.name;
    document.getElementById("welcomeEmail").textContent = user.email;
    authTitle.textContent = "Welcome back";
  } else {
    authTitle.textContent = "Welcome to View Livestream";
    showTab("login");
  }
}

tabLogin.addEventListener("click", () => showTab("login"));
tabSignup.addEventListener("click", () => showTab("signup"));

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const users = getUsers();

  if (!/^[a-zA-Z\s'-]{3,}$/.test(name)) return showAuthMessage("Enter a valid name (at least 3 letters).", "danger");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showAuthMessage("Enter a valid email address.", "danger");
  if (password.length < 6) return showAuthMessage("Password must be at least 6 characters.", "danger");
  if (users.some((u) => u.email === email)) return showAuthMessage("An account with this email already exists. Please log in.", "warning");

  users.push({ name, email, passwordHash: await hashPassword(password) });
  saveUsers(users);
  signupForm.reset();
  showTab("login");
  document.getElementById("loginEmail").value = email;
  showAuthMessage("Account created! Now log in with your email and password.", "success");
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const user = getUsers().find((u) => u.email === email);

  if (!user || user.passwordHash !== (await hashPassword(password))) {
    return showAuthMessage("Incorrect email or password. New here? Use the Sign Up tab.", "danger");
  }

  setCurrentUser({ name: user.name, email: user.email });
  loginForm.reset();
  updateNavAuth();
  renderAuthState();
  showAuthMessage(`Welcome, ${user.name}! Taking you to the catalogue...`, "success");
  setTimeout(() => { window.location.href = "index.html#browse"; }, 900);
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  logOut();
  showAuthMessage("You have been logged out. Log in again anytime.", "info");
});

window.addEventListener("authchange", renderAuthState);
renderAuthState();
