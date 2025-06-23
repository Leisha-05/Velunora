function setupWishlistIcons() {
  const wishlistIcons = document.querySelectorAll(".wishlist-icon");
  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  wishlistIcons.forEach((icon) => {
    const productName = icon.dataset.productName?.trim();
    if (!productName) return;

    // Initial state
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

document.addEventListener("DOMContentLoaded", setupWishlistIcons);
window.setupWishlistIcons = setupWishlistIcons;

function setupWishlistIconForSingleProduct() {
  const icon = document.querySelector(".wishlist-icon");
  if (!icon) {
    console.warn("❌ No wishlist icon found on product page");
    return;
  }

  const productName = icon.dataset.productName?.trim();
  if (!productName) {
    console.warn("❌ No product name found in data attribute");
    return;
  }

  let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

  // ✅ Set initial visual state
  if (wishlist.includes(productName)) {
    icon.classList.add("wishlisted");
    console.log("✅ Product is already in wishlist:", productName);
  } else {
    icon.classList.remove("wishlisted");
    console.log("❌ Product not in wishlist:", productName);
  }

  icon.addEventListener("click", (e) => {
    e.stopPropagation();

    wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    if (wishlist.includes(productName)) {
      wishlist = wishlist.filter((name) => name !== productName);
      icon.classList.remove("wishlisted");
      console.log("❌ Removed from wishlist:", productName);
    } else {
      if (productName && typeof productName === "string") {
  wishlist.push(productName);
}

      icon.classList.add("wishlisted");
      console.log("✅ Added to wishlist:", productName);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  });
}
