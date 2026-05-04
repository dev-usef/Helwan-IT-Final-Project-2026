document.addEventListener("DOMContentLoaded", () => {
  loadAuthStyles("../css/login.css");

  const form = document.getElementById("login-form");
  const message = document.getElementById("auth-msg");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!form || !emailInput || !passwordInput) return;

  setupPasswordToggles();
  setupLiveValidation([emailInput, passwordInput]);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage(message);

    if (!validateLogin(emailInput, passwordInput)) {
      showMessage(message, "Please fix the highlighted fields.", "error");
      return;
    }

    const registeredUser = getRegisteredUser();
    if (!registeredUser) {
      showMessage(message, "No account found. Please create an account first.", "error");
      return;
    }

    const loginEmail = emailInput.value.trim().toLowerCase();
    const savedEmail = registeredUser.email.toLowerCase();
    const isMatchingEmail = loginEmail === savedEmail;
    const isMatchingPassword = passwordInput.value === registeredUser.password;

    if (!isMatchingEmail || !isMatchingPassword) {
      showMessage(message, "Email or password is incorrect.", "error");
      return;
    }

    localStorage.setItem("user", registeredUser.username || registeredUser.email);
    localStorage.setItem("isLoggedIn", "true");

    showMessage(message, `Welcome back, ${registeredUser.username || "there"}!`, "success");
    form.reset();
    console.log("Login successful", { email: registeredUser.email });
    window.location.href = "../pages/index.html";
  });
});

function validateLogin(email, password) {
  let isValid = true;

  if (!email.value.trim()) {
    setFieldError(email, "Email is required.");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setFieldError(email, "Enter a valid email address.");
    isValid = false;
  } else {
    clearFieldError(email);
  }

  if (!password.value.trim()) {
    setFieldError(password, "Password is required.");
    isValid = false;
  } else if (password.value.length < 6) {
    setFieldError(password, "Password must be at least 6 characters.");
    isValid = false;
  } else {
    clearFieldError(password);
  }

  return isValid;
}

function setupLiveValidation(inputs) {
  inputs.forEach((input) => {
    input.addEventListener("input", () => clearFieldError(input));
  });
}

function setupPasswordToggles() {
  document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.getElementById(button.dataset.target);
      if (!input) return;

      const shouldShow = input.type === "password";
      input.type = shouldShow ? "text" : "password";
      button.textContent = shouldShow ? "hide" : "show";
      button.setAttribute("aria-label", shouldShow ? "Hide password" : "Show password");
    });
  });
}

function getRegisteredUser() {
  try {
    const user =
      JSON.parse(localStorage.getItem("registeredUser")) ||
      JSON.parse(localStorage.getItem("authUser")) ||
      null;

    if (!user) return null;

    return {
      username: user.username || user.name || "",
      email: user.email || "",
      password: user.password || "",
    };
  } catch {
    return null;
  }
}

function setFieldError(input, text) {
  const field = input.closest(".field");
  if (!field) return;

  field.classList.add("has-error");
  input.setAttribute("aria-invalid", "true");

  let error = field.querySelector(".field-error");
  if (!error) {
    error = document.createElement("span");
    error.className = "field-error";
    error.setAttribute("role", "alert");
    field.appendChild(error);
  }

  error.textContent = text;
}

function clearFieldError(input) {
  const field = input.closest(".field");
  if (!field) return;

  field.classList.remove("has-error");
  input.removeAttribute("aria-invalid");

  const error = field.querySelector(".field-error");
  if (error) error.textContent = "";
}

function showMessage(element, text, type) {
  if (!element) return;
  element.textContent = text;
  element.classList.remove("is-error", "is-success");
  element.classList.add(type === "success" ? "is-success" : "is-error");
}

function clearMessage(element) {
  if (!element) return;
  element.textContent = "";
  element.classList.remove("is-error", "is-success");
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function loadAuthStyles(href) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  
}
