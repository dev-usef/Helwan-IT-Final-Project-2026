
document.addEventListener("DOMContentLoaded", () => {
    renderWishlist();
    renderRecommendations();
    setupEventListeners();
});

function renderWishlist() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistGrid = document.getElementById("Wishlist-grid");
    const emptyState = document.getElementById("Empty-state");
    const authView = document.getElementById("Auth-guest-view");
    const countElement = document.getElementById("Wishlist-count");

    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        authView.classList.remove("Hidden");
        wishlistGrid.classList.add("Hidden");
        emptyState.classList.add("Hidden");
        return;
    }

    if (wishlist.length === 0) {
        emptyState.classList.remove("Hidden");
        wishlistGrid.classList.add("Hidden");
        authView.classList.add("Hidden");
        countElement.innerText = "0 Items";
    } 

    else {
        emptyState.classList.add("Hidden");
        authView.classList.add("Hidden");
        wishlistGrid.classList.remove("Hidden");
        
        countElement.innerText = `${wishlist.length} Items`;
     
        wishlistGrid.innerHTML = wishlist.map(product => `
            <div class="product-card">
                <img src="${product.img}" alt="${product.id}">
                <h4>${product.id}</h4>
                <p>$${product.price} </p>
                <button class="btn-remove" onclick="removeFromWishlist('${product.id}')">Remove</button>
            </div>
        `).join("");
    }
}


function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.filter(item => item.id !== productId);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    renderWishlist(); 
    renderRecommendations();
}

function renderRecommendations() {
    const recommendationsGrid = document.getElementById("Recommendations-grid");
    if (!recommendationsGrid || !Array.isArray(window.products)) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const wishlistIds = wishlist.map(item => item.id);
    const recommendations = window.products
        .filter(product => !wishlistIds.includes(product.id))
        .slice(0, 4);

    recommendationsGrid.innerHTML = recommendations.map(product => `
        <div class="product-card">
            <img src="${product.img}" alt="${product.id}">
            <h4>${product.id}</h4>
            <p>$${product.price}</p>
            <button class="btn-secondary" onclick="addRecommendationToWishlist('${product.id}')">
                Add to Wishlist
            </button>
        </div>
    `).join("");
}

function addRecommendationToWishlist(productId) {
    if (!Array.isArray(window.PRODUCTS)) return;

    const product = window.PRODUCTS.find(item => item.id === productId);
    if (!product) return;

    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    if (!wishlist.some(item => item.id === product.id)) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }

    renderWishlist();
    renderRecommendations();
}


function setupEventListeners() {
    const clearBtn = document.getElementById("clear-wishlist");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to clear your wishlist?")) {
                localStorage.setItem("wishlist", JSON.stringify([]));
                renderWishlist();
                renderRecommendations();
            }
        });
    }
}
