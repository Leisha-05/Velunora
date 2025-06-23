document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  cart.forEach((productName) => {
    const product = productData.find((p) => p.name === productName);
    if (product) {
      const productCard = document.createElement("div");
      productCard.className = "wishlist-card";

      const discountedPrice = calculateDiscount(product.price, product.discount);

      productCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${product.img}" alt="${product.name}">
          <div class="icon-bar">
            <i class="fas fa-heart wishlist-icon" data-product-name="${product.name}" title="Add to Wishlist"></i>
            <i class="fas fa-times cart-remove-icon" data-product-name="${product.name}" title="Remove from Cart"></i>
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

      cartContainer.appendChild(productCard);
    }
  });

  setupCartIcons();
  setupWishlistIcons(); // for heart
});
