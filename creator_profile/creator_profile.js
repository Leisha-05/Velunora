import { db } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const creatorName = urlParams.get("creator")?.trim();
const productName = urlParams.get("name")?.trim();

const creatorTitle = document.getElementById("creatorName");
const creatorLabel = document.getElementById("creatorLabel");
const productContainer = document.getElementById("productContainer");
const searchInput = document.querySelector(".search-container input");
const searchIcon = document.querySelector(".search-container i");
const priceFilter = document.getElementById("priceFilter");

let creatorProducts = [];

if (creatorName) {
  document.title = `${creatorName} | Velunora`;
  creatorTitle.textContent = creatorName;
  creatorLabel.textContent = creatorName;
}

function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found for ${creatorName}.</p>`;
    return;
  }

  products.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <div class="image-wrapper">
        <a href="../product_pg/product.html?id=${product.id}" class="product-link">
          <img src="${product.img}" alt="${product.name}" />
        </a>
        <span class="ribbon">${product.discount} OFF</span>
        <div class="icon-bar">
          <i class="fas fa-heart" data-product-id="${product.id}" title="Add to Wishlist"></i>
          <i class="fas fa-shopping-cart" data-product-id="${product.id}" title="Add to Cart"></i>
          <i class="fas fa-share-alt" title="Share"></i>
        </div>
      </div>
      <div class="product-info">
        <h3><a href="../product_pg/product.html?id=${product.id}" class="product-link">${product.name}</a></h3>
        <p>Category: ${product.category}</p>
        <div class="price">
          <span class="original">₹${(product.price / (1 - parseInt(product.discount)/100)).toFixed(0)}</span>
          <span class="discounted">₹${product.price}</span>
        </div>
      </div>
    `;

    productContainer.appendChild(card);

    const links = card.querySelectorAll(".product-link");
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = `../product_pg/product.html?id=${product.id}`;
      });
    });
  });
}

async function fetchCreatorProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    creatorProducts = allProducts.filter(
      (product) => product.creator?.trim() === creatorName
    );

    renderProducts(creatorProducts);
  } catch (error) {
    console.error("Error fetching creator products:", error);
    productContainer.innerHTML = `<p>Failed to load products. Please try again later.</p>`;
  }
}

if (searchInput && searchIcon) {
  const handleSearch = () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
      window.location.href = `../search_results.html?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  searchIcon.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}

if (priceFilter) {
  priceFilter.addEventListener("change", () => {
    const selected = priceFilter.value;
    if (selected === "low") {
      const sorted = [...creatorProducts].sort((a, b) => a.price - b.price);
      renderProducts(sorted);
    } else if (selected === "high") {
      const sorted = [...creatorProducts].sort((a, b) => b.price - a.price);
      renderProducts(sorted);
    } else {
      renderProducts(creatorProducts);
    }
  });
}

if (creatorName) {
  fetchCreatorProducts();
}

const spotlightWrapper = document.getElementById("spotlightWrapper");
if (spotlightWrapper) {
  spotlightWrapper.addEventListener("click", (e) => {
    const creatorElement = e.target.closest(".spotlight-creator");
    const productImage = e.target.closest(".clickable-product-img");
    const viewLink = e.target.closest(".view-product-link");

    if (creatorElement) {
      const creatorName = creatorElement.querySelector(".creator-person-name")?.textContent.trim();
      if (creatorName) {
        window.location.href = `../creator_profile/creator_profile.html?creator=${encodeURIComponent(creatorName)}`;
      }
    }

    if (productImage || viewLink) {
      const productName = (productImage || viewLink).dataset.name;
      if (productName) {
        window.location.href = `../product_pg/product.html?name=${encodeURIComponent(productName)}`;
      }
    }
  });
}
