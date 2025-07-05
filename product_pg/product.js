// ✅ Firebase Setup
import { db, auth } from "../login_signup/firebase.js";
import {
  doc, getDoc, setDoc, updateDoc, arrayUnion
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// 🚀 Load Product by ID or LocalStorage Fallback
async function loadProduct() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get("id");

    let productData = null;

    if (productId) {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        productData = { id: docSnap.id, ...docSnap.data() };
      }
    } else {
      const storedProduct = localStorage.getItem("selectedProduct");
      if (storedProduct) {
        productData = JSON.parse(storedProduct);
      }
    }

    if (!productData) {
      document.querySelector(".product-container").innerHTML = "<p>Product not found.</p>";
      return;
    }

    renderProductDetails(productData);
    setupWishlistButton(productData);
    setupCartButton(productData);
    loadCustomization(productData);
    setupReviewSystem(productData);
    displayAverageStars(productData);
    setupBackToCollection();

    localStorage.removeItem("selectedProduct");
  } catch (error) {
    console.error("Error loading product:", error);
    document.querySelector(".product-container").innerHTML = "<p>Error loading product.</p>";
  }
}

// ✅ Render Product Details
function renderProductDetails(product) {
  document.getElementById("product-img").src = product.img;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("current-price").textContent = calculateDiscount(product.price, product.discount);
  document.getElementById("original-price").textContent = "₹" + product.price;
  document.getElementById("description").textContent = product.description || `A lovely ${product.name}`;

  document.getElementById("creator-link").textContent = product.creator;
  document.getElementById("creator-link").href = `../creator_profile/creator_profile.html?creator=${encodeURIComponent(product.creator)}`;

  document.querySelector(".icon-buttons").innerHTML = `
    <i class="fa-solid fa-heart wishlist-icon icon-btn" title="Add to Wishlist"></i>
    <i class="fa-solid fa-cart-shopping icon-btn cart-icon" title="Add to Cart"></i>
    <i class="fa-solid fa-share-alt icon-btn share-icon" title="Share"></i>
  `;
}

// ✅ Wishlist Functionality with Color Change
function setupWishlistButton(product) {
  const wishlistIcon = document.querySelector(".wishlist-icon");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const ref = doc(db, "userWishlists", user.uid);
      const snap = await getDoc(ref);
      const wishlist = snap.exists() ? snap.data().wishlist || [] : [];
      if (wishlist.some(p => p.name === product.name)) {
        wishlistIcon.style.color = "red";
      }
    }
  });

  wishlistIcon.addEventListener("click", () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return alert("Please log in to add to wishlist.");
      const ref = doc(db, "userWishlists", user.uid);
      const snap = await getDoc(ref);
      const wishlist = snap.exists() ? snap.data().wishlist || [] : [];
      if (wishlist.some(p => p.name === product.name)) {
        alert("Already in wishlist.");
        return;
      }
      await setDoc(ref, { wishlist: [...wishlist, product] }, { merge: true });
      wishlistIcon.style.color = "red";
      alert("Added to wishlist!");
    });
  });
}

// ✅ Cart Functionality with Color Change
function setupCartButton(product) {
  const cartIcon = document.querySelector(".cart-icon");

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const ref = doc(db, "userCarts", user.uid);
      const snap = await getDoc(ref);
      const cart = snap.exists() ? snap.data().cart || [] : [];
      if (cart.some(p => p.name === product.name)) {
        cartIcon.style.color = "green";
      }
    }
  });

  cartIcon.addEventListener("click", () => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) return alert("Please log in to add to cart.");
      const ref = doc(db, "userCarts", user.uid);
      const snap = await getDoc(ref);
      const existingCart = snap.exists() ? snap.data().cart || [] : [];
      if (existingCart.some(p => p.name === product.name)) {
        alert("Product already in cart.");
        return;
      }

      const request = localStorage.getItem(`customRequest_${product.name}`);
      const customRequest = request ? JSON.parse(request) : { message: "", fileName: null };

      const item = {
        name: product.name,
        price: calculateDiscount(product.price, product.discount),
        quantity: 1,
        creator: product.creator,
        img: product.img,
        creator: auth.currentUser.email,
       creatorId: product.creatorUID || product.creatorId,  // ✅ Add this line
        customRequest
      };
      await setDoc(ref, { cart: [...existingCart, item] }, { merge: true });
      cartIcon.style.color = "green";
      alert("Added to cart with customization!");
    });
  });
}

// ✅ Display Average Star Ratings
async function displayAverageStars(product) {
  const ref = doc(db, "productReviews", product.name);
  const snap = await getDoc(ref);
  const reviews = snap.exists() ? snap.data().reviews || [] : [];

  if (reviews.length === 0) {
    document.getElementById("avgStars").innerHTML = "⭐ No ratings yet";
    return;
  }

  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
  document.getElementById("avgStars").innerHTML = `⭐ ${avg} (${reviews.length} reviews)`;
}

// ✅ Back to Collection Button
function setupBackToCollection() {
  const backBtn = document.getElementById("back-to-collection");
  if (backBtn) {
    backBtn.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.back();
    });
  }
}

// ✅ Customization Requests
function loadCustomization(product) {
  const ref = doc(db, "customRequests", product.name);
  getDoc(ref).then(snap => {
    if (snap.exists()) {
      const { message, fileName } = snap.data();
      document.getElementById("custom-message").value = message || "";
      if (fileName) {
        const fileNote = document.createElement("p");
        fileNote.textContent = `📎 File: ${fileName}`;
        document.querySelector(".custom-request").appendChild(fileNote);
      }
    }
  });

  document.getElementById("custom-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = document.getElementById("custom-message").value.trim();
    const file = document.getElementById("custom-file").files[0];
    const data = { message: msg, fileName: file ? file.name : null };
    await setDoc(ref, data);
    localStorage.setItem(`customRequest_${product.name}`, JSON.stringify(data));
    alert("Customization request saved!");
  });
}

// ✅ Review System
function setupReviewSystem(product) {
  const ref = doc(db, "productReviews", product.name);
  const stars = document.querySelectorAll("#star-rating-input i");
  const input = document.getElementById("review-rating");

  stars.forEach((star, idx) => {
    star.addEventListener("click", () => {
      input.value = idx + 1;
      updateStars(idx + 1);
    });
  });

  document.getElementById("submit-review").addEventListener("click", async () => {
    const name = document.getElementById("reviewer-name").value.trim();
    const comment = document.getElementById("review-comment").value.trim();
    const rating = parseInt(input.value);
    if (!name || !comment || !rating) return alert("All review fields are required.");
    const newReview = { name, rating, comment };
    const snap = await getDoc(ref);
    if (snap.exists()) {
      await updateDoc(ref, { reviews: arrayUnion(newReview) });
    } else {
      await setDoc(ref, { reviews: [newReview] });
    }
    alert("Review submitted!");
    fetchReviews(product);
    displayAverageStars(product);
  });

  fetchReviews(product);
}

// ✅ Fetch and Render Reviews
async function fetchReviews(product) {
  const ref = doc(db, "productReviews", product.name);
  const snap = await getDoc(ref);
  const reviews = snap.exists() ? snap.data().reviews || [] : [];
  renderReviews(reviews);
}

function renderReviews(reviews) {
  const container = document.getElementById("review-list");
  container.innerHTML = "";
  reviews.forEach(r => {
    const div = document.createElement("div");
    div.className = "review-item";
    div.innerHTML = `
      <strong>${r.name}</strong>
      <div class="star-rating">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
      <p>${r.comment}</p>`;
    container.appendChild(div);
  });
  document.getElementById("review-count").textContent = reviews.length;
}

// ✅ Utilities
function updateStars(rating) {
  const stars = document.querySelectorAll("#star-rating-input i");
  stars.forEach((star, i) => {
    star.className = i < rating ? "fas fa-star selected" : "far fa-star";
  });
}

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr?.replace("%", "")) || 0;
  return Math.round(price - (price * discount) / 100);
}

// ✅ Initialize
loadProduct();
