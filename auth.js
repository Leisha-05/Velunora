document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  const navLinks = document.querySelector(".nav-links");

  if (isLoggedIn) {
    const loginLink = navLinks.querySelector('a[href*="login"]');
    if (loginLink) loginLink.remove();

    const dropdown = document.createElement("div");
    dropdown.classList.add("account-dropdown");

    // Determine depth for correct path to files
    const depth = window.location.pathname.split("/").length - 2;
    const basePath = "../".repeat(depth);

    dropdown.innerHTML = `
      <i class="fas fa-user user-icon"></i>
      <div class="dropdown-content">
        ${
          userRole === "creator"
            ? `
          <a href="${basePath}creator_account/account.html">My Account</a>
          <a href="${basePath}creator_account/orders.html">My Orders</a>
        `
            : ""
        }
        <a href="${basePath}wishlist_cart/wishlist.html">My Wishlist</a>
        <a href="${basePath}wishlist_cart/cart.html">My Cart</a>
        <a href="#" id="logout-btn">Logout</a>
      </div>
    `;

    navLinks.appendChild(dropdown);

    dropdown.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }
});
