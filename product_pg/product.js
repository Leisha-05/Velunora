
document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    document.querySelector(".product-container").innerHTML = "<p>Product not found.</p>";
    return;
  }

  document.getElementById("product-img").src = product.img;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("current-price").textContent = calculateDiscount(product.price, product.discount);
  document.getElementById("original-price").textContent = "₹" + product.price;
  document.getElementById("description").textContent = `A lovingly crafted ${product.name.toLowerCase()} from our ${product.category} collection.`;
  document.getElementById("creator-link").textContent = product.creator;
  document.getElementById("creator-link").href = `../creator_profile/creator_profile.html?creator=${encodeURIComponent(product.creator)}`;

const iconButtons = document.querySelector(".icon-buttons");
console.log("Selected product:", product.name);


iconButtons.innerHTML = `
  <i class="fa-solid fa-heart wishlist-icon icon-btn" title="Add to Wishlist" data-product-name="${product.name}"></i>
  <i class="fa-solid fa-cart-shopping icon-btn cart-icon" title="Add to Cart" data-product-name="${product.name}"></i>
  <i class="fa-solid fa-share-alt icon-btn" title="Share"></i>
`;

setupWishlistIconForSingleProduct(); // now it will 100% work
setupCartIcons();



});


function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", ""));
  return Math.round(price - (price * discount) / 100);
}

document.querySelector(".go-back").addEventListener("click", () => {
  window.history.back();
});

const ratingContainer = document.getElementById("rating-stars");
const ratingText = document.getElementById("rating-text"); // <-- Add this

// Example: let's say all products are rated 4.5
const rating = 4.5;
const fullStars = Math.floor(rating);
const hasHalfStar = rating % 1 !== 0;

let starHTML = "";

for (let i = 0; i < fullStars; i++) {
  starHTML += `<i class="fas fa-star"></i>`;
}

if (hasHalfStar) {
  starHTML += `<i class="fas fa-star-half-alt"></i>`;
}

const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
for (let i = 0; i < emptyStars; i++) {
  starHTML += `<i class="far fa-star"></i>`;
}

ratingContainer.innerHTML = starHTML;
ratingText.textContent = rating.toFixed(1); // Sets the number value in the <span>


// Dummy reviews
const reviews = [
  { name: "Maya", rating: 5, comment: "Beautiful work! Worth every penny." },
  { name: "Rishi", rating: 4, comment: "Just like I imagined. Great packaging too!" }
];


const reviewList = document.getElementById("review-list");
reviews.forEach((rev) => {
  const div = document.createElement("div");
  div.className = "review-item";
  // Generate star rating HTML
let stars = "";
for (let i = 1; i <= 5; i++) {
  stars += `<i class="${i <= rev.rating ? 'fas' : 'far'} fa-star"></i>`;
}

div.innerHTML = `
  <strong>${rev.name}</strong>
  <div class="star-rating">${stars}</div>
  <p>${rev.comment}</p>
`;

  reviewList.appendChild(div);
});

// Handle custom request submission
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

