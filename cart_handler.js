function setupCartIcons() {
  const cartIcons = document.querySelectorAll(".cart-icon");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cartIcons.forEach((icon) => {
    const productName = icon.dataset.productName?.trim();
    if (!productName) return;

    // Initial visual state
    if (cart.includes(productName)) {
      icon.classList.add("carted"); // Add a class to style active state
    } else {
      icon.classList.remove("carted");
    }

    icon.onclick = (e) => {
      e.stopPropagation();
      cart = JSON.parse(localStorage.getItem("cart")) || [];

      if (cart.includes(productName)) {
        cart = cart.filter((p) => p !== productName);
        icon.classList.remove("carted");
      } else {
        cart.push(productName);
        icon.classList.add("carted");
      }

      localStorage.setItem("cart", JSON.stringify(cart));
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
