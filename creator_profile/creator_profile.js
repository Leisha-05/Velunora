import { db, auth } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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
let currentUser = null;
onAuthStateChanged(auth, (user) => {
  if (user) currentUser = user;
});

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
async function renderProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found for ${creatorName}.</p>`;
    return;
  }
let wishlistItems = [];
let cartItems = [];

if (currentUser) {
  const wishlistRef = doc(db, "userWishlists", currentUser.uid);
  const cartRef = doc(db, "userCarts", currentUser.uid);

  const [wishlistSnap, cartSnap] = await Promise.all([
    getDoc(wishlistRef),
    getDoc(cartRef),
  ]);

  wishlistItems = wishlistSnap.exists() ? wishlistSnap.data().wishlist || [] : [];
  cartItems = cartSnap.exists() ? cartSnap.data().cart || [] : [];
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
    const wishlistIcon = card.querySelector(".fa-heart");
    const cartIcon = card.querySelector(".fa-shopping-cart");
if (wishlistItems.some(p => p.id === product.id)) {
  wishlistIcon.classList.add("active");
}
if (cartItems.some(p => p.id === product.id)) {
  cartIcon.classList.add("active");
}

    // Wishlist click
    wishlistIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!currentUser) return alert("Please login to use wishlist");
      const ref = doc(db, "userWishlists", currentUser.uid);
      const snap = await getDoc(ref);
      const existing = snap.exists() ? snap.data().wishlist || [] : [];
      const inList = existing.some(p => p.id === product.id);
      try {
        if (!inList) {
          await setDoc(ref, { wishlist : arrayUnion(product) }, { merge: true });
          wishlistIcon.classList.add("active");
        } else {
          await updateDoc(ref, { wishlist: arrayRemove(product) });
          wishlistIcon.classList.remove("active");
        }
      } catch (err) {
        console.error("Wishlist error:", err);
      }
    });

    // Cart click
    cartIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      if (!currentUser) return alert("Please login to use cart");
      const ref = doc(db, "userCarts", currentUser.uid);
      const snap = await getDoc(ref);
      const existing = snap.exists() ? snap.data().cart || [] : [];
      const inList = existing.some(p => p.id === product.id);
      try {
        if (!inList) {
          await setDoc(ref, { cart: arrayUnion(product) }, { merge: true });
          cartIcon.classList.add("active");
        } else {
          await updateDoc(ref, { cart: arrayRemove(product) });
          cartIcon.classList.remove("active");
        }
      } catch (err) {
        console.error("Cart error:", err);
      }
    });

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
