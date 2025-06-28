function setupCartIcons() {
  const cartIcons = document.querySelectorAll(".cart-icon");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartIcons.forEach((icon) => {
    const productName = icon.dataset.productName?.trim();
    if (!productName) return;

    // Initial state
    const isInCart = cart.some((item) => item.name === productName);
    if (isInCart) {
      icon.classList.add("carted");
    } else {
      icon.classList.remove("carted");
    }

    icon.addEventListener("click", (e) => {
      e.stopPropagation();

      cart = JSON.parse(localStorage.getItem("cart")) || [];
      const index = cart.findIndex((item) => item.name === productName);

      if (index !== -1) {
        // Remove from cart
        cart.splice(index, 1);
        icon.classList.remove("carted");
      } else {
        // Add to cart
        const product = productData.find((p) => p.name === productName);
        if (!product) return;

         const request = localStorage.getItem(`customRequest_${product.name}`);
        const customRequest = request ? JSON.parse(request) : { message: "", fileName: null };

        cart.push({
          name: product.name,
          price: calculateDiscount(product.price, product.discount),
          quantity: 1,
          img: product.img,
          creator: product.creator,
          customRequest: customRequest,
        });
        icon.classList.add("carted");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
    });
  });
}

window.setupCartIcons = setupCartIcons;


function setupWishlistIcons() {
  const wishlistIcons = document.querySelectorAll(".wishlist-icon");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlistIcons.forEach((icon) => {
    const productName = icon.dataset.productName?.trim();
    if (!productName) return;

    if (wishlist.includes(productName)) {
      icon.classList.add("wishlisted");
    } else {
      icon.classList.remove("wishlisted");
    }

    icon.onclick = (e) => {
      e.stopPropagation();
      wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (wishlist.includes(productName)) {
        wishlist = wishlist.filter((p) => p !== productName);
        icon.classList.remove("wishlisted");
      } else {
        wishlist.push(productName);
        icon.classList.add("wishlisted");
      }

      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    };
  });
}

window.setupCartIcons = setupCartIcons;
window.setupWishlistIcons = setupWishlistIcons;

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr.replace("%", ""));
  return Math.round(price - (price * discount) / 100);
}
