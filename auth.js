document.addEventListener("DOMContentLoaded", () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  const navLinks = document.querySelector(".nav-links");

  if (isLoggedIn) {
    const loginLink = navLinks.querySelector('a[href*="login"]');
    if (loginLink) loginLink.remove();

    const dropdown = document.createElement("div");
    dropdown.classList.add("account-dropdown");

    const baseFolder =
      window.location.pathname.includes("category_pg") ||
      window.location.pathname.includes("product_pg")
        ? "../wishlist_cart/"
        : "wishlist_cart/";

    dropdown.innerHTML = `
      <i class="fas fa-user user-icon"></i>
      <div class="dropdown-content">
        ${userRole === "creator" ? `<a href="creator_account/account.html">My Account</a>` : ""}
        <a href="${baseFolder}wishlist.html">My Wishlist</a>
        <a href="${baseFolder}cart.html">My Cart</a>
        <a href="#" id="logout-btn">Logout</a>
      </div>
    `;

    navLinks.appendChild(dropdown);

    // Logout
    dropdown.querySelector("#logout-btn").addEventListener("click", () => {
      localStorage.clear();
      location.reload();
    });
  }
});
