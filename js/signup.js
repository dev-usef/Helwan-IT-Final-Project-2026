document.addEventListener("DOMContentLoaded", () => {
  loadAuthStyles("../css/signup.css");

  const form = document.getElementById("signup-form");
  const message = document.getElementById("auth-msg");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const confirm = document.getElementById("confirm");

  if (!form || !name || !email || !password || !confirm) return;

  setupPasswordToggles();
  setupLiveValidation([name, email, password, confirm]);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearMessage(message);

    const isValid = validateSignup(name, email, password, confirm);
    if (!isValid) {
      showMessage(message, "Please fix the highlighted fields.", "error");
      return;
    }

    const user = {
      username: name.value.trim(),
      email: email.value.trim(),
      password: password.value,
    };


    localStorage.setItem("registeredUser", JSON.stringify(user));

    showMessage(message, "Account created successfully. You can sign in now.", "success");
    form.reset();
    updateHint("email-hint", "", "");
    updateHint("confirm-hint", "", "");
    console.log("Signup successful", { username: user.username, email: user.email });
  });
});

function validateSignup(name, email, password, confirm) {
  let isValid = true;

  if (!name.value.trim()) {
    setFieldError(name, "Full name is required.");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    setFieldError(name, "Name must be at least 2 characters.");
    isValid = false;
  } else {
    clearFieldError(name);
  }

  if (!email.value.trim()) {
    setFieldError(email, "Email is required.");
    updateHint("email-hint", "", "");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    setFieldError(email, "Enter a valid email address.");
    updateHint("email-hint", "", "");
    isValid = false;
  } else {
    clearFieldError(email);
    updateHint("email-hint", "Email looks good.", "success");
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

  if (!confirm.value.trim()) {
    setFieldError(confirm, "Please confirm your password.");
    updateHint("confirm-hint", "", "");
    isValid = false;
  } else if (confirm.value !== password.value) {
    setFieldError(confirm, "Passwords do not match.");
    updateHint("confirm-hint", "", "");
    isValid = false;
  } else {
    clearFieldError(confirm);
    updateHint("confirm-hint", "Passwords match.", "success");
  }

  return isValid;
}

function setupLiveValidation(inputs) {
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input);

      if (input.id === "email") updateHint("email-hint", "", "");
      if (input.id === "confirm") updateHint("confirm-hint", "", "");
    });
  });
}

function setupPasswordToggles() {
  document.querySelectorAll(".toggle-pw").forEach((button) => {
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

function updateHint(id, text, type) {
  const hint = document.getElementById(id);
  if (!hint) return;

  hint.textContent = text;
  hint.classList.toggle("is-success", type === "success");
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
