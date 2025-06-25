document.addEventListener("DOMContentLoaded", () => {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    document.querySelector(".product-container").innerHTML = "<p>Product not found.</p>";
    return;
  }

  // 1. Set Product Details
  document.getElementById("product-img").src = product.img;
  document.getElementById("product-name").textContent = product.name;
  document.getElementById("current-price").textContent = calculateDiscount(product.price, product.discount);
  document.getElementById("original-price").textContent = "₹" + product.price;
  document.getElementById("description").textContent = `A lovingly crafted ${product.name.toLowerCase()} from our ${product.category} collection.`;
  document.getElementById("creator-link").textContent = product.creator;
  document.getElementById("creator-link").href = `../creator_profile/creator_profile.html?creator=${encodeURIComponent(product.creator)}`;

  // 2. Render Icons
  const iconButtons = document.querySelector(".icon-buttons");
  iconButtons.innerHTML = `
    <i class="fa-solid fa-heart wishlist-icon icon-btn" title="Add to Wishlist" data-product-name="${product.name}"></i>
    <i class="fa-solid fa-cart-shopping icon-btn cart-icon" title="Add to Cart" data-product-name="${product.name}"></i>
    <i class="fa-solid fa-share-alt icon-btn" title="Share"></i>
  `;

  setupWishlistIconForSingleProduct();
  setupCartIcons();


  // 3. Load Saved Customization (if any)
  const savedRequest = localStorage.getItem(`customRequest_${product.name}`);
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

  // 4. Handle Custom Request Save
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

    localStorage.setItem(`customRequest_${product.name}`, JSON.stringify(requestData));
    alert("Request saved!");
  });

  // 5. Go Back Button
  document.querySelector(".go-back").addEventListener("click", () => {
    window.history.back();
  });

  // 6. Static Product Rating Stars (Top Section)
  const rating = 4.5;
  const ratingContainer = document.getElementById("rating-stars");
  const ratingText = document.getElementById("rating-text");
  let starHTML = "";

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starHTML += `<i class="fas fa-star"></i>`;
    } else if (i - rating < 1) {
      starHTML += `<i class="fas fa-star-half-alt"></i>`;
    } else {
      starHTML += `<i class="far fa-star"></i>`;
    }
  }

  ratingContainer.innerHTML = starHTML;
  ratingText.textContent = rating.toFixed(1);

  // 7. Review Star Selection (Form)
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

  // 8. Dummy Reviews (Always Shown)
  const key = `reviews_${product.name}`;
  const dummyReviews = [
    { name: "Maya", rating: 5, comment: "Beautiful work! Worth every penny." },
    { name: "Rishi", rating: 4, comment: "Just like I imagined. Great packaging too!" }
  ];

  // 9. Submit Review
  document.getElementById("submit-review").addEventListener("click", () => {
    const name = document.getElementById("reviewer-name").value.trim();
    const comment = document.getElementById("review-comment").value.trim();
    const rating = parseInt(ratingInput.value);

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

    // Reset form
    document.getElementById("reviewer-name").value = "";
    document.getElementById("review-comment").value = "";
    ratingInput.value = "";
    selectedRating = 0;

    starIcons.forEach((s) => s.classList.remove("selected"));
  });

  // 10. Render Reviews Function
  function renderReviews(reviewArray) {
    const reviewList = document.getElementById("review-list");
    reviewList.innerHTML = "";

    reviewArray.forEach((rev) => {
      const div = document.createElement("div");
      div.className = "review-item";

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

    document.getElementById("review-count").textContent = reviewArray.length;
  }

  // 11. Load Reviews (dummy + real)
  const storedReviews = JSON.parse(localStorage.getItem(key)) || [];
  renderReviews([...dummyReviews, ...storedReviews]);
});

// ✅ Cart icon listener - OUTSIDE DOMContentLoaded
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("cart-icon")) {
    const product = JSON.parse(localStorage.getItem("selectedProduct"));
    const request = localStorage.getItem(`customRequest_${product.name}`);
    const customRequest = request ? JSON.parse(request) : { message: "", fileName: null };

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Avoid duplicates
    if (!cart.some(item => item.name === product.name)) {
      cart.push({
        name: product.name,
        price: calculateDiscount(product.price, product.discount),
        quantity: 1,
        creator: product.creator,
        img: product.img,
        customRequest
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      alert("Product added to cart with customization!");
    } else {
      alert("Product already in cart.");
    }
  }
});


function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", ""));
  return Math.round(price - (price * discount) / 100);
}
