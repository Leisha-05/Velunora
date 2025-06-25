document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cartContainer");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // Step 1: Sanitize old string entries
  cart = cart.map((item) => {
    if (typeof item === "string") {
      const product = productData.find((p) => p.name === item);
      if (product) {
        return {
          name: product.name,
          price: Number(product.price),
          quantity: 1,
          img: product.img
        };
      }
      return null;
    }
    return item;
  }).filter(Boolean);

  // Save cleaned cart back to localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // Step 2: Check for empty cart
  if (cart.length === 0) {
    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // Step 3: Render each cart item
  cart.forEach((item) => {
    const product = productData.find((p) => p.name === item.name);
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

      // Remove from cart
      productCard.querySelector(".cart-remove-icon").addEventListener("click", (e) => {
        e.stopPropagation();
        const indexToRemove = cart.findIndex((c) => c.name === product.name);
        if (indexToRemove !== -1) {
          cart.splice(indexToRemove, 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          productCard.remove();
          if (cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
          }
        }
      });
    }
  });

  // Setup heart and cart-remove icons
  setupCartIcons();
  setupWishlistIcons();

  // Add checkout button
  const btnWrapper = document.createElement("div");
  btnWrapper.className = "order-btn-wrapper";
  btnWrapper.innerHTML = `<button id="checkout-btn" class="order-all-btn">Order All</button>`;
  cartContainer.appendChild(btnWrapper);

  document.getElementById("checkout-btn").addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
});
