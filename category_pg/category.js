import { db } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Get category from URL
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

// Update banner and title
document.getElementById("categoryTitle").textContent =
  selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Collection";

const bannerFix = {
  jewelery: "jewelry",
  jewelry: "jewelry",
  art: "art",
  decor: "decor",
  stationery: "stationery",
  embroidery: "embroidery",
  gifting: "gifting",
};

document.querySelector(
  ".category-header img"
).src = `../images/headers/${bannerFix[selectedCategory]}-banner.jpg`;

const productContainer = document.getElementById("productContainer");
const searchInput = document.querySelector(".search-container input");
const sortSelect = document.getElementById("priceFilter");

let allProducts = [];

async function fetchProducts() {
  const q = query(collection(db, "products"), where("category", "==", selectedCategory));
  const querySnapshot = await getDocs(q);

  allProducts = [];
  querySnapshot.forEach((doc) => {
    allProducts.push({ id: doc.id, ...doc.data() });
  });

  displayProducts(allProducts);
}

function displayProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found for this category.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const discountPercent = parseInt(product.discount.replace("%", ""));
    const discountedPrice = Math.round(
      product.price * (1 - discountPercent / 100)
    );

    card.innerHTML = `
      <div class="image-wrapper">
        <span class="ribbon">${product.discount} OFF</span>
        <img src="${product.img}" alt="${product.name}" />
        <div class="icon-bar">
          <i class="fas fa-heart wishlist-icon" data-product-id="${product.id}" title="Wishlist"></i>
          <i class="fas fa-shopping-cart cart-icon" data-product-id="${product.id}" title="Add to Cart"></i>
          <i class="fas fa-share-alt" title="Share"></i>
        </div>
      </div>
      <h3>${product.name}</h3>
      <p class="price">
        <span class="original">₹${product.price}</span>
        <span class="discounted">₹${discountedPrice}</span>
      </p>
    `;

    // ✅ Open product page with correct ID in URL
    card.addEventListener("click", (e) => {
      if (e.target.closest(".icon-bar i")) return;
      window.location.href = `../product_pg/product.html?id=${product.id}`;
    });

    productContainer.appendChild(card);
  });
}

// Search functionality
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = allProducts.filter((p) =>
    p.name.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
});

// Sort functionality
sortSelect.addEventListener("change", () => {
  const sortValue = sortSelect.value;
  let sorted = [...allProducts];

  if (sortValue === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  displayProducts(sorted);
});

// Initial fetch
fetchProducts();
