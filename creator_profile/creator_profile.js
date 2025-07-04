// import { db } from "../login_signup/firebase.js";
// import {
//   collection,
//   getDocs,
// } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// // ✅ URL parameters
// const urlParams = new URLSearchParams(window.location.search);
// const creatorName = urlParams.get("creator")?.trim();

// // ✅ DOM elements
// const creatorTitle = document.getElementById("creatorName");
// const creatorLabel = document.getElementById("creatorLabel");
// const productContainer = document.getElementById("productContainer");
// const searchInput = document.querySelector(".search-container input");
// const searchIcon = document.querySelector(".search-container i");
// const priceFilter = document.getElementById("priceFilter");

// let creatorProducts = [];

// // ✅ Set creator labels
// if (creatorName) {
//   document.title = `${creatorName} | Velunora`;
//   creatorTitle.textContent = creatorName;
//   creatorLabel.textContent = creatorName;
// }

// // ✅ Remove duplicates while keeping valid product IDs
// function removeDuplicateProducts(products) {
//   const uniqueMap = new Map();
//   for (const product of products) {
//     const key = product.name.toLowerCase().trim();
//     // Always keep the one with a valid id (Firestore ID)
//     if (!uniqueMap.has(key) || !uniqueMap.get(key)?.id) {
//       uniqueMap.set(key, product);
//     }
//   }
//   return Array.from(uniqueMap.values());
// }

// // ✅ Render Products
// function renderProducts(products) {
//   productContainer.innerHTML = "";

//   if (products.length === 0) {
//     productContainer.innerHTML = `<p>No products found for ${creatorName}.</p>`;
//     return;
//   }

//   products.forEach((product) => {
//     const card = document.createElement("div");
//     card.classList.add("product-card");

//     card.innerHTML = `
//       <div class="image-wrapper">
//         <a href="../product_pg/product.html?id=${product.id}" class="product-link">
//           <img src="${product.img}" alt="${product.name}" />
//         </a>
//         <span class="ribbon">${product.discount} OFF</span>
//         <div class="icon-bar">
//           <i class="fas fa-heart" data-product-id="${product.id}" title="Add to Wishlist"></i>
//           <i class="fas fa-shopping-cart" data-product-id="${product.id}" title="Add to Cart"></i>
//           <i class="fas fa-share-alt" title="Share"></i>
//         </div>
//       </div>
//       <div class="product-info">
//         <h3><a href="../product_pg/product.html?id=${product.id}" class="product-link">${product.name}</a></h3>
//         <p>Category: ${product.category}</p>
//         <div class="price">
//           <span class="original">₹${(product.price / (1 - parseInt(product.discount) / 100)).toFixed(0)}</span>
//           <span class="discounted">₹${product.price}</span>
//         </div>
//       </div>
//     `;

//     productContainer.appendChild(card);

//     // Ensure clicking image or name works
//     card.querySelectorAll(".product-link").forEach((link) => {
//       link.addEventListener("click", (e) => {
//         e.preventDefault();
//         if (product.id) {
//           window.location.href = `../product_pg/product.html?id=${product.id}`;
//         } else {
//           alert("Product link is broken.");
//         }
//       });
//     });
//   });
// }

// // ✅ Fetch Creator Products
// async function fetchCreatorProducts() {
//   try {
//     const snapshot = await getDocs(collection(db, "products"));
//     const allProducts = snapshot.docs.map((doc) => ({
//       id: doc.id,
//       ...doc.data(),
//     }));

//     const filtered = allProducts.filter(
//       (product) => product.creator?.trim() === creatorName
//     );

//     creatorProducts = removeDuplicateProducts(filtered);
//     renderProducts(creatorProducts);
//   } catch (error) {
//     console.error("Error fetching creator products:", error);
//     productContainer.innerHTML =
//       "<p>Failed to load products. Please try again later.</p>";
//   }
// }

// // ✅ Search Functionality
// if (searchInput && searchIcon) {
//   const handleSearch = () => {
//     const keyword = searchInput.value.trim();
//     if (keyword) {
//       window.location.href = `../search_results.html?keyword=${encodeURIComponent(keyword)}`;
//     }
//   };

//   searchIcon.addEventListener("click", handleSearch);
//   searchInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") handleSearch();
//   });
// }

// // ✅ Price Filter Functionality
// if (priceFilter) {
//   priceFilter.addEventListener("change", () => {
//     const selected = priceFilter.value;
//     if (selected === "low") {
//       renderProducts([...creatorProducts].sort((a, b) => a.price - b.price));
//     } else if (selected === "high") {
//       renderProducts([...creatorProducts].sort((a, b) => b.price - a.price));
//     } else {
//       renderProducts(creatorProducts);
//     }
//   });
// }

// // ✅ Spotlight Click Handling (if spotlight is included on this page)
// const spotlightWrapper = document.getElementById("spotlightWrapper");
// if (spotlightWrapper) {
//   spotlightWrapper.addEventListener("click", (e) => {
//     const creatorElement = e.target.closest(".spotlight-creator");
//     const productImage = e.target.closest(".clickable-product-img");
//     const viewLink = e.target.closest(".view-product-link");

//     if (creatorElement) {
//       const creatorName = creatorElement.querySelector(".creator-person-name")?.textContent.trim();
//       if (creatorName) {
//         window.location.href = `../creator_profile/creator_profile.html?creator=${encodeURIComponent(creatorName)}`;
//       }
//     }

//     if (productImage || viewLink) {
//       const productId = (productImage || viewLink).dataset.productId;
//       if (productId) {
//         window.location.href = `../product_pg/product.html?id=${productId}`;
//       }
//     }
//   });
// }

// // ✅ Initialize
// if (creatorName) {
//   fetchCreatorProducts();
// }








import { db } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ URL parameters
const urlParams = new URLSearchParams(window.location.search);
const creatorName = urlParams.get("creator")?.trim();

// ✅ DOM elements
const creatorTitle = document.getElementById("creatorName");
const creatorLabel = document.getElementById("creatorLabel");
const productContainer = document.getElementById("productContainer");
const searchInput = document.querySelector(".search-container input");
const searchIcon = document.querySelector(".search-container i");
const priceFilter = document.getElementById("priceFilter");

let creatorProducts = [];

// ✅ Set creator labels
if (creatorName) {
  document.title = `${creatorName} | Velunora`;
  creatorTitle.textContent = creatorName;
  creatorLabel.textContent = creatorName;
}

// ✅ Remove duplicates while keeping valid product IDs
function removeDuplicateProducts(products) {
  const uniqueMap = new Map();
  for (const product of products) {
    const key = product.name.toLowerCase().trim();
    if (!uniqueMap.has(key) || !uniqueMap.get(key)?.id) {
      uniqueMap.set(key, product);
    }
  }
  return Array.from(uniqueMap.values());
}

// ✅ Calculate Discounted Price
function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr?.replace("%", "")) || 0;
  return Math.round(price - (price * discount) / 100);
}

// ✅ Render Products
function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found for ${creatorName}.</p>`;
    return;
  }

  products.forEach((product) => {
    const discountedPrice = calculateDiscount(product.price, product.discount);

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
          <span class="discounted">₹${discountedPrice}</span>
          <span class="original">₹${product.price}</span>
        </div>
      </div>
    `;

    productContainer.appendChild(card);

    card.querySelectorAll(".product-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        if (product.id) {
          window.location.href = `../product_pg/product.html?id=${product.id}`;
        } else {
          alert("Product link is broken.");
        }
      });
    });
  });
}

// ✅ Fetch Creator Products
async function fetchCreatorProducts() {
  try {
    const snapshot = await getDocs(collection(db, "products"));
    const allProducts = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = allProducts.filter(
      (product) => product.creator?.trim() === creatorName
    );

    creatorProducts = removeDuplicateProducts(filtered);
    renderProducts(creatorProducts);
  } catch (error) {
    console.error("Error fetching creator products:", error);
    productContainer.innerHTML =
      "<p>Failed to load products. Please try again later.</p>";
  }
}

// ✅ Search Functionality
if (searchInput && searchIcon) {
  const handleSearch = () => {
    const keyword = searchInput.value.trim();
    if (keyword) {
      window.location.href = `../search_results.html?keyword=${encodeURIComponent(keyword)}`;
    }
  };

  searchIcon.addEventListener("click", handleSearch);
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSearch();
  });
}

// ✅ Price Filter Functionality
if (priceFilter) {
  priceFilter.addEventListener("change", () => {
    const selected = priceFilter.value;
    if (selected === "low") {
      renderProducts([...creatorProducts].sort((a, b) =>
        calculateDiscount(a.price, a.discount) - calculateDiscount(b.price, b.discount)
      ));
    } else if (selected === "high") {
      renderProducts([...creatorProducts].sort((a, b) =>
        calculateDiscount(b.price, b.discount) - calculateDiscount(a.price, a.discount)
      ));
    } else {
      renderProducts(creatorProducts);
    }
  });
}

// ✅ Spotlight Click Handling
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
      const productId = (productImage || viewLink).dataset.productId;
      if (productId) {
        window.location.href = `../product_pg/product.html?id=${productId}`;
      }
    }
  });
}

// ✅ Initialize
if (creatorName) {
  fetchCreatorProducts();
}
