function setupCartIcons() {
  const removeIcons = document.querySelectorAll(".cart-remove-icon");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  removeIcons.forEach((icon) => {
    const productName = icon.dataset.productName?.trim();
    if (!productName) return;

    icon.onclick = (e) => {
      e.stopPropagation();
      cart = cart.filter((p) => p !== productName);
      localStorage.setItem("cart", JSON.stringify(cart));
      icon.closest(".wishlist-card").remove();
    };
  });
}

// Reusing wishlist icon logic
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
