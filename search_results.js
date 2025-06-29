import { db } from "./login_signup/firebase.js";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const resultContainer = document.getElementById("searchResultsContainer");
const resultTitle = document.getElementById("resultTitle");
const searchInput = document.querySelector(".search-container input");
const searchIcon = document.querySelector(".search-container i");

function getKeywordFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("keyword")?.toLowerCase().trim();
}

async function fetchAndDisplayResults(keyword) {
  if (!keyword) {
    resultTitle.textContent = "No search keyword provided.";
    return;
  }

  resultTitle.textContent = `Search results for "${keyword}"`;
  resultContainer.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const matchedProducts = allProducts.filter((p) => {
      const name = p.name?.toLowerCase() || "";
      const category = p.category?.toLowerCase() || "";
      const tags = p.tags?.map((tag) => tag.toLowerCase()) || [];

      return (
        name.includes(keyword) ||
        category.includes(keyword) ||
        tags.some((tag) => tag.includes(keyword))
      );
    });

    if (matchedProducts.length === 0) {
      resultContainer.innerHTML = `<p>No products found for "${keyword}".</p>`;
      return;
    }

     matchedProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${product.img}" alt="${product.name}">
          <span class="ribbon">${product.ribbon || "New"}</span>
          <div class="icon-bar">
            <i class="fas fa-heart"></i>
            <i class="fas fa-shopping-cart"></i>
            <i class="fas fa-share-alt"></i>
          </div>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <div class="price">
            <span class="original">₹${product.originalPrice || (product.price * 1.2).toFixed(0)}</span>
            <span class="discounted">₹${product.price}</span>
          </div>
        </div>
      `;

       card.querySelector(".image-wrapper").addEventListener("click", () => {
        window.location.href = `product_pg/product.html?id=${product.id}`;
      });

      resultContainer.appendChild(card);
      });
  } catch (error) {
    console.error("Error fetching products:", error);
    resultContainer.innerHTML = `<p>Something went wrong. Please try again later.</p>`;
  }
}

// Initial fetch on page load
fetchAndDisplayResults(getKeywordFromURL());

// Handle search on this page too
if (searchInput && searchIcon) {
  const handleSearch = () => {
    const newKeyword = searchInput.value.trim();
    if (newKeyword) {
      window.location.href = `../search_results.html?keyword=${encodeURIComponent(newKeyword)}`;
    }
  };

  searchIcon.addEventListener("click", handleSearch);

  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  });
}












