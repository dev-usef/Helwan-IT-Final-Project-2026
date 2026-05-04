const THEME_STORAGE_KEY = "theme";
const LIGHT_THEME = "../css/light-theme.css";
const DARK_THEME = "../css/dark-theme.css";

const navbar = document.getElementById("navbar") || document.getElementById("Navbar");
const footer = document.getElementById("footer");
const themeLink = document.getElementById("theme-link");


function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}


function updateThemeButton() {
  const btn = document.querySelector("[aria-label='Toggle theme']");
  if (!btn) return;

  const theme = getSavedTheme();
  btn.textContent = theme === "dark" ? "☀️" : "🌙";
}


function applyTheme(themeName) {
  const theme = themeName === "dark" ? "dark" : "light";


  if (themeLink) {
    themeLink.href = theme === "dark" ? DARK_THEME : LIGHT_THEME;
  }


  document.body.classList.remove("light-theme", "dark-theme");
  document.body.classList.add(theme === "dark" ? "dark-theme" : "light-theme");


  localStorage.setItem(THEME_STORAGE_KEY, theme);


  updateThemeButton();
}


function toggleTheme() {
  const currentTheme = getSavedTheme();
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
}


function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("isLoggedIn");
  location.reload();
}

function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = value;
  return element.innerHTML;
}

function getNavbarAuthMarkup() {
  const user = localStorage.getItem("user");

  if (!user) {
    return `<li><a href="../pages/login.html">Login</a></li>`;
  }

  return `
      <li><span class="user-name"> ${escapeHTML(user)}</span></li>
      <li><button type="button" onclick="logout()">Logout</button></li>
    `;
}

window.addEventListener("DOMContentLoaded", () => {
  applyTheme(getSavedTheme());
});

if (navbar) {
  navbar.innerHTML = `
<nav class="navbar">
  <a href="../pages/index.html" class="logo">
    <img src="../images/products/logo-light.png" class="logo-light" alt="logo">
    <img src="../images/products/logo-dark.png" class="logo-dark" alt="logo">
  </a>
  <div>
    <ul>
      <li><a href="../pages/index.html">Home</a></li>
      <li><a href="../pages/shop.html">Shop</a></li>
      <li><a href="../pages/cart.html">Cart</a></li>
      <li><a href="../pages/wishlist.html">Your Wishlist</a></li>
      <li><a href="../pages/contact.html">Contact Us</a></li>
      ${getNavbarAuthMarkup()}
      
      <li><button type="button" onclick="toggleTheme()" aria-label="Toggle theme">🌙</button></li>
    </ul>
  </div>
</nav>
`;
}

if (footer) {
  footer.innerHTML = `
<p style="text-align:center">&copy; 2026 Vexon </p>
<p style="text-align:center">Made with effort by Helwan IT students ❤️ </p>

`;
}
