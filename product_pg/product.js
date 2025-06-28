import { db } from "../login_signup/firebase.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const productName = urlParams.get("name");

async function loadProduct() {
  try {
    let productData = null;

    if (productId) {
      const docRef = doc(db, "products", productId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        productData = { id: docSnap.id, ...docSnap.data() };
      }
    } else if (productName) {
      const querySnapshot = await getDocs(collection(db, "products"));
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.name.trim().toLowerCase() === productName.trim().toLowerCase()) {
          productData = { id: doc.id, ...data };
        }
      });
    }

    if (!productData) {
      document.querySelector(".product-container").innerHTML =
        "<p>Product not found.</p>";
      return;
    }

    // 🟢 Fill product details
    document.getElementById("product-img").src = productData.img;
    document.getElementById("product-name").textContent = productData.name;
    document.getElementById("current-price").textContent = calculateDiscount(
      productData.price,
      productData.discount
    );
    document.getElementById("original-price").textContent = "₹" + productData.price;
    document.getElementById("description").textContent =
      productData.description ||
      `A lovingly crafted ${productData.name.toLowerCase()} from our ${productData.category} collection.`;

    document.getElementById("creator-link").textContent = productData.creator;
    document.getElementById("creator-link").href =
      `../creator_profile/creator_profile.html?creator=${encodeURIComponent(productData.creator)}`;

    // Icons (Wishlist, Cart, Share)
    const iconButtons = document.querySelector(".icon-buttons");
    iconButtons.innerHTML = `
      <i class="fa-solid fa-heart wishlist-icon icon-btn" title="Add to Wishlist" data-product-id="${productData.id}"></i>
      <i class="fa-solid fa-cart-shopping icon-btn cart-icon" title="Add to Cart" data-product-id="${productData.id}"></i>
      <i class="fa-solid fa-share-alt icon-btn" title="Share"></i>
    `;

    // Activate wishlist and cart logic
    setupWishlistIconForSingleProduct?.();
    setupCartIcons?.();

    loadRatingStars(4.5);
    loadReviews([
      { name: "Maya", rating: 5, comment: "Beautiful work! Worth every penny." },
      { name: "Rishi", rating: 4, comment: "Just like I imagined. Great packaging too!" },
    ]);
  } catch (error) {
    console.error("Failed to load product:", error);
    document.querySelector(".product-container").innerHTML =
      "<p>Oops! Something went wrong while loading product.</p>";
  }
}

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", "")) || 0;
  return "₹" + Math.round(price - (price * discount) / 100);
}

function loadRatingStars(rating) {
  const ratingContainer = document.getElementById("rating-stars");
  const ratingText = document.getElementById("rating-text");

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let starHTML = "";

  for (let i = 0; i < fullStars; i++) starHTML += `<i class="fas fa-star"></i>`;
  if (hasHalfStar) starHTML += `<i class="fas fa-star-half-alt"></i>`;
  for (let i = 0; i < 5 - fullStars - (hasHalfStar ? 1 : 0); i++) {
    starHTML += `<i class="far fa-star"></i>`;
  }

  ratingContainer.innerHTML = starHTML;
  ratingText.textContent = rating.toFixed(1);
}

function loadReviews(reviews) {
  const reviewList = document.getElementById("review-list");
  reviewList.innerHTML = "";

  reviews.forEach((rev) => {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
      stars += `<i class="${i <= rev.rating ? "fas" : "far"} fa-star"></i>`;
    }

    const div = document.createElement("div");
    div.className = "review-item";
    div.innerHTML = `
      <strong>${rev.name}</strong>
      <div class="star-rating">${stars}</div>
      <p>${rev.comment}</p>
    `;
    reviewList.appendChild(div);
  });
}

document.querySelector(".go-back").addEventListener("click", () => {
  window.history.back();
});

document.getElementById("custom-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = document.getElementById("custom-message").value;
  const file = document.getElementById("custom-file").files[0];

  if (!msg.trim()) {
    alert("Please enter a message.");
    return;
  }

  alert("Request submitted!");
});

loadProduct();
