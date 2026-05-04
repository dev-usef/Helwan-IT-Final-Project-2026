const grid = document.getElementById("products-grid");
const gridBtn = document.getElementById("grid-btn");
const listBtn = document.getElementById("list-btn");
const pageIndicator = document.getElementById("page-indicator");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const noResults = document.getElementById("no-results");

const PRODUCTS = [
  { id: "SmartWatch", cat: "Watches", price: 200, img: "../images/products/watch.png" },
  { id: "Phone Stand", cat: "Phone Accessories", price: 22, img: "../images/products/phone-stand.png" },
  
  { id: "iPhone 15", cat: "Phones", price: 999, img: "../images/products/iphone15.png" },
  { id: "Samsung Galaxy S24", cat: "Phones", price: 899, img: "../images/products/galaxy.png" },
  { id: "Samsung Galaxy S25 Ultra", cat: "Phones", price: 999, img: "../images/products/3.png" },
  { id: "Samsung Galaxy S25", cat: "Phones", price: 899, img: "../images/products/1.png" },
  { id: "Apple iPhone 16 Pro Max", cat: "Phones", price: 1250, img: "../images/products/4.png" },
  { id: "Apple iPhone 17 Pro Max", cat: "Phones", price: 1450, img: "../images/products/2.png" },

  { id: "Phone Case", cat: "Phone Accessories", price: 15, img: "../images/products/phone-case.png" },
  { id: "Charging Cable", cat: "Phone Accessories", price: 12, img: "../images/products/charging-cable.png" },

  { id: "MacBook Pro", cat: "Laptops", price: 1999, img: "../images/products/macbook-pro.png" },
  { id: "Dell Laptop", cat: "Laptops", price: 1499, img: "../images/products/dell.png" },
  { id: "Laptop Stand", cat: "Laptops", price: 45, img: "../images/products/laptop-stand.png" },

  { id: "PS5 Controller", cat: "Controllers", price: 70, img: "../images/products/ps5-controller.png" },
  { id: "Xbox Controller", cat: "Controllers", price: 65, img: "../images/products/xbox-controller.png" },

  { id: "AirPods Pro", cat: "Earbuds", price: 249, img: "../images/products/airpods-pro.png" },

  { id: "GoPro", cat: "Cameras", price: 400, img: "../images/products/gopro.png" },
  { id: "Webcam", cat: "Cameras", price: 95, img: "../images/products/webcam.png" },

  { id: "Mechanical Keyboard", cat: "Computer Accessories", price: 130, img: "../images/products/keyboard.png" },
  { id: "Gaming Mouse", cat: "Computer Accessories", price: 60, img: "../images/products/mouse.png" },
  { id: "USB-C Hub", cat: "Computer Accessories", price: 55, img: "../images/products/usb-hub.png" },
  { id: "Curved Monitor", cat: "Computer Accessories", price: 350, img: "../images/products/monitor.png" },
];

const productsPerPage = 6;
let currentPage = 1;
let filteredData = [...PRODUCTS];

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];

window.PRODUCTS = PRODUCTS;
window.products = PRODUCTS;
window.filteredData = filteredData;
window.currentPage = currentPage;
window.render = render;

function render() {
  filteredData = window.filteredData;
  currentPage = window.currentPage;

  const totalPages = Math.max(1, Math.ceil(filteredData.length / productsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * productsPerPage;
  const slice = filteredData.slice(start, start + productsPerPage);

  grid.innerHTML = "";
  noResults.classList.toggle("hidden", filteredData.length > 0);

  slice.forEach((p, i) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.animationDelay = `${i * 100}ms`;

    card.innerHTML = `
      <div class="card-info">
        <div class="card-cat">${p.cat}</div>
        <div class="card-img"><img src="${p.img}"></div>
        <div class="card-name">${p.id}</div>
        <div class="card-price">$${p.price}</div>
        <button class="add-to-cart-btn">${cart.some(item => item.id === p.id) ? "Remove from Cart" : "Add to Cart"}</button>
        <button class="wishlist-btn">${wishlist.some(item => item.id === p.id) ? "❤️" : "🤍"}</button>
      </div>
    `;

    const image = card.querySelector(".card-img");
    const addToCartBtn = card.querySelector(".add-to-cart-btn");
    const wishlistBtn = card.querySelector(".wishlist-btn");

    addToCartBtn.onclick = () => {
      if (cart.some(item => item.id === p.id)) {
        cart = cart.filter(item => item.id !== p.id);
      } else {
        cart.push(p);
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      render();
    };

    wishlistBtn.onclick = () => {
      if (wishlist.some(item => item.id === p.id)) {
        wishlist = wishlist.filter(item => item.id !== p.id);
      } else {
        wishlist.push(p);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      render();
    };

    image.onclick = () => {
      window.location.href = `product-details.html?id=${p.id}`;
    };

    grid.appendChild(card);
  });

  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

function changePage(dir) {
  const totalPages = Math.ceil(window.filteredData.length / productsPerPage);
  window.currentPage = Math.min(Math.max(1, window.currentPage + dir), totalPages);
  render();
}

function toggleView() {
  if (event.target.id === "grid-btn") {
    grid.classList.add("view-grid");
    grid.classList.remove("view-list");
    gridBtn.disabled = true;
    listBtn.disabled = false;
  } else {
    grid.classList.add("view-list");
    grid.classList.remove("view-grid");
    listBtn.disabled = true;
    gridBtn.disabled = false;
  }
}

function filterByCategory(category) {
  if (category === "All") {
    window.filteredData = [...PRODUCTS];
  } else {
    window.filteredData = PRODUCTS.filter(p => p.cat === category);
  }

  window.currentPage = 1;
  render();
}

if (grid && gridBtn && listBtn && pageIndicator && prevBtn && nextBtn && noResults) {
  render();
}
