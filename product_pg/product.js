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

    // Fix for category dropdown link issue from product page
    const dropdownLinks = document.querySelectorAll(".dropdown-content a");
    dropdownLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (!href.startsWith("../")) {
        link.setAttribute("href", `../category_pg/${href.split('/').pop()}`);
      }
    });

    const iconButtons = document.querySelector(".icon-buttons");
    iconButtons.innerHTML = `
      <i class="fa-solid fa-heart wishlist-icon icon-btn" title="Add to Wishlist" data-product-id="${productData.id}"></i>
      <i class="fa-solid fa-cart-shopping icon-btn cart-icon" title="Add to Cart" data-product-id="${productData.id}"></i>
      <i class="fa-solid fa-share-alt icon-btn" title="Share"></i>
    `;

    setupWishlistIconForSingleProduct?.();
    setupCartIcons?.();

    const savedRequest = localStorage.getItem(`customRequest_${productData.name}`);
    if (savedRequest) {
      const { message, fileName } = JSON.parse(savedRequest);
      document.getElementById("custom-message").value = message || "";
      if (fileName) {
        const fileNote = document.createElement("p");
        fileNote.className = "custom-note";
        fileNote.textContent = `📎 Previously uploaded: ${fileName}`;
        document.querySelector(".custom-request").appendChild(fileNote);
      }
    }

    document.getElementById("custom-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const msg = document.getElementById("custom-message").value;
      const file = document.getElementById("custom-file").files[0];

      if (!msg.trim()) {
        alert("Please enter a message.");
        return;
      }

      const requestData = {
        message: msg.trim(),
        fileName: file ? file.name : null,
      };

      localStorage.setItem(`customRequest_${productData.name}`, JSON.stringify(requestData));
      alert("Request saved!");
    });

    document.querySelector(".go-back").addEventListener("click", () => {
      window.history.back();
    });

    loadRatingStars(4.5);

    const key = `reviews_${productData.name}`;
    const dummyReviews = [
      { name: "Maya", rating: 5, comment: "Beautiful work! Worth every penny." },
      { name: "Rishi", rating: 4, comment: "Just like I imagined. Great packaging too!" },
    ];

    document.getElementById("submit-review").addEventListener("click", () => {
      const name = document.getElementById("reviewer-name").value.trim();
      const comment = document.getElementById("review-comment").value.trim();
      const rating = parseInt(document.getElementById("review-rating").value);

      if (!name || !comment || !rating) {
        alert("Please fill in all fields.");
        return;
      }

      const newReview = { name, rating, comment };
      const reviews = JSON.parse(localStorage.getItem(key)) || [];
      reviews.push(newReview);
      localStorage.setItem(key, JSON.stringify(reviews));

      renderReviews([...dummyReviews, ...reviews]);
      alert("Thanks for your review!");

      document.getElementById("reviewer-name").value = "";
      document.getElementById("review-comment").value = "";
      document.getElementById("review-rating").value = "";

      updateStars(0);
    });

    const ratingInput = document.getElementById("review-rating");
    const starIcons = document.querySelectorAll("#star-rating-input i");
    let selectedRating = 0;

    starIcons.forEach((star, index) => {
      star.addEventListener("click", () => {
        selectedRating = index + 1;
        ratingInput.value = selectedRating;
        updateStars(selectedRating);
      });
    });

    function updateStars(rating) {
      starIcons.forEach((star, i) => {
        if (i < rating) {
          star.classList.add("selected");
          star.classList.remove("far");
          star.classList.add("fas");
        } else {
          star.classList.remove("selected");
          star.classList.remove("fas");
          star.classList.add("far");
        }
      });
    }

    const storedReviews = JSON.parse(localStorage.getItem(key)) || [];
    renderReviews([...dummyReviews, ...storedReviews]);
  } catch (error) {
    console.error("Failed to load product:", error);
    document.querySelector(".product-container").innerHTML =
      "<p>Oops! Something went wrong while loading product.</p>";
  }
}

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", "")) || 0;
  return Math.round(price - (price * discount) / 100);
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

function renderReviews(reviews) {
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

  document.getElementById("review-count").textContent = reviews.length;
}

// Setup custom cart logic

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-icon")) {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const request = localStorage.getItem(`customRequest_${product.name}`);
    const customRequest = request ? JSON.parse(request) : { message: "", fileName: null };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!cart.some((item) => item.name === product.name)) {
      cart.push({
        name: product.name,
        price: calculateDiscount(product.price, product.discount),
        quantity: 1,
        creator: product.creator,
        img: product.img,
        customRequest,
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart with customization!");
    } else {
      alert("Product already in cart.");
    }
  }
});

loadProduct();
