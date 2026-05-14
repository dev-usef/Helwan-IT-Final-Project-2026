
let wishlistItems = [];

document.addEventListener("DOMContentLoaded", () => {
    wishlistItems = getWishlist();
    renderWishlist();
    renderRecommendations();
    setupEventListeners();
});

function getWishlist() {
    return JSON.parse(localStorage.getItem("wishlist")) || [];
}
function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
}
function updateWishlistCounter() {
    const countElement = document.getElementById("Wishlist-count");
    if (countElement) {
        countElement.innerText = `${wishlistItems.length} Items`;
    }
}

function renderWishlist() {
    const wishlistGrid = document.getElementById("Wishlist-grid");
    const emptyState = document.getElementById("Empty-state");
    const authView = document.getElementById("Auth-guest-view");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    wishlistGrid.innerHTML = "";
    updateWishlistCounter();

    if (!isLoggedIn) {
        authView.classList.remove("Hidden");
        wishlistGrid.classList.add("Hidden");
        emptyState.classList.add("Hidden");
        return;
    }

    if (wishlistItems.length === 0) {
        emptyState.classList.remove("Hidden");
        wishlistGrid.classList.add("Hidden");
        authView.classList.add("Hidden");
    } 

    else {
        emptyState.classList.add("Hidden");
        authView.classList.add("Hidden");
        wishlistGrid.classList.remove("Hidden");
     
        wishlistGrid.innerHTML = wishlistItems.map(product => `
            <div class="product-card">
                <img src="${product.img}" alt="${product.id}">
                <h4>${product.id}</h4>
                <p>$${product.price} </p>
                <button class="btn-remove" data-id="${product.id}">Remove</button>
            </div>
        `).join("");
    }
}


function removeFromWishlist(productId) {
    wishlistItems = wishlistItems.filter(item => item.id !== productId);
    saveWishlist();
    renderWishlist(); 
    renderRecommendations();
}

function renderRecommendations() {
    const recommendationsGrid = document.getElementById("Recommendations-grid");
    if (!recommendationsGrid || !Array.isArray(window.products)) return;

    const wishlistIds = wishlistItems.map(item => item.id);
    const recommendations = window.products
        .filter(product => !wishlistIds.includes(product.id))
        .slice(0, 4);

    recommendationsGrid.innerHTML = recommendations.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.id}">
            <h4>${product.id}</h4>
            <p>$${product.price}</p>
            <button class="btn-secondary add-recommendation-btn" data-id="${product.id}">
                Add to Wishlist
            </button>
        </div>
    `).join("");
}

function addRecommendationToWishlist(productId) {
    if (!Array.isArray(window.PRODUCTS)) return;

    const product = window.PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    if (!wishlistItems.some(item => item.id === product.id)) {
        wishlistItems.push(product);
        saveWishlist();
    }

    renderWishlist();
    renderRecommendations();
}


function setupEventListeners() {
    const wishlistGrid = document.getElementById("Wishlist-grid");
    const recommendationsGrid = document.getElementById("Recommendations-grid");
    const clearBtn = document.getElementById("clear-wishlist");

    if (wishlistGrid) {
        wishlistGrid.addEventListener("click", event => {
            if (event.target.classList.contains("btn-remove")) {
                removeFromWishlist(event.target.dataset.id);
            }
        });
    }

    if (recommendationsGrid) {
        recommendationsGrid.addEventListener("click", event => {
            if (event.target.classList.contains("add-recommendation-btn")) {
                addRecommendationToWishlist(event.target.dataset.id);
            }
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your wishlist?")) {
                wishlistItems = [];
                localStorage.removeItem("wishlist");
                renderWishlist();
                renderRecommendations();
            }
        });
    }
}
