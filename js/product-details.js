const urlParams = new URLSearchParams(window.location.search);
const productIdFromURL = urlParams.get("id");
const productList =
  typeof PRODUCTS !== "undefined"
    ? PRODUCTS
    : typeof products !== "undefined"
      ? products
      : [];

const product = productList.find((p) => p.id === productIdFromURL);
const productTitle = document.getElementById("product-id");
const productImage = document.getElementById("product-img");
const productCategory = document.getElementById("product-cat");
const productPrice = document.getElementById("product-price");
const messageArea = document.getElementById("message-area");
const cartBtn = document.querySelector(".add-to-cart-btn");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showMessage(text, type = "success") {
  if (!messageArea) return;

  messageArea.innerText = text;
  messageArea.style.color = type === "success" ? "green" : "red";
  messageArea.style.fontWeight = "bold";
  messageArea.style.marginTop = "10px";
}

function renderNotFound() {
  const main = document.querySelector("main.container");

  if (main) {
    main.innerHTML = `
      <div>
        <div>
          <h1>Product Not Found</h1>
          <p>The product you are looking for is not available.</p>
          <a href="shop.html">Back to Shop</a>
        </div>
      </div>
    `;
  }
}

function renderProduct() {
  if (!product) {
    renderNotFound();
    return;
  }

  if (productTitle) productTitle.innerText = product.id;
  if (productImage) {
    productImage.src = product.img;
    productImage.alt = product.id;
  }
  if (productCategory) productCategory.innerText = product.cat;
  if (productPrice) productPrice.innerText = `$${product.price}`;

  const cart = getCart();
  if (cartBtn && cart.some((item) => item.id === product.id)) {
    cartBtn.innerText = "Already in Cart";
  }
}

if (cartBtn) {
  cartBtn.onclick = () => {
    if (!product) return;

    const cart = getCart();
    const isExist = cart.some((item) => item.id === product.id);

    if (isExist) {
      showMessage("Product is already in your cart.", "error");
      cartBtn.innerText = "Already in Cart";
      return;
    }

    cart.push(product);
    saveCart(cart);
    cartBtn.innerText = "Already in Cart";
    showMessage("Product added to cart successfully!");
  };
}

renderProduct();
