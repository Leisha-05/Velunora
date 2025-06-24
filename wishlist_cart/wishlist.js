document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.getElementById("wishlistContainer");

  const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((productName) => {
    const product = productData.find((p) => p.name === productName);
    if (product) {
      const productCard = document.createElement("div");
      productCard.className = "wishlist-card";

      const discountedPrice = calculateDiscount(
        product.price,
        product.discount
      );

      productCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${product.img}" alt="${product.name}">
          <div class="icon-bar">
            <i class="fas fa-times wishlist-remove-icon" data-product-name="${product.name}" title="Remove from Wishlist"></i>
            <i class="fas fa-shopping-cart" data-product-name="${product.name}" title="Add to Cart"></i>
            <i class="fas fa-share-alt" title="Share"></i>
          </div>
        </div>
        <h3>${product.name}</h3>
        <p class="price">
          <span class="discounted">₹${discountedPrice}</span>
          <span class="original">₹${product.price}</span>
        </p>
      `;

      productCard.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(product));
        window.location.href = "../product_pg/product.html";
      });

      wishlistContainer.appendChild(productCard);
    }
  });
  wishlistContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("wishlist-remove-icon")) {
      const productName = e.target.dataset.productName;
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      wishlist = wishlist.filter((name) => name !== productName);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      location.reload();
    }
  });
});

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", ""));
  return Math.round(price - (price * discount) / 100);
}
