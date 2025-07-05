import { auth } from "./login_signup/firebase.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) {
    console.error("❌ .nav-links not found.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    console.log("✅ Auth state changed:", user);

    const loginLink = navLinks.querySelector('a[href*="login"]');
    const pathname = window.location.pathname;

    let baseFolder;
    if (pathname.includes("wishlist_cart")) {
      baseFolder = "./";
    } else if (
      pathname.includes("creator_account") ||
      pathname.includes("product_pg") ||
      pathname.includes("category_pg") ||
      pathname.includes("creator_profile")
    ) {
      baseFolder = "../wishlist_cart/";
    } else {
      baseFolder = "wishlist_cart/";
    }

    if (user) {
      if (loginLink) loginLink.remove();
      if (navLinks.querySelector(".account-dropdown")) return;

      // 🔍 Check user role from Firestore
      let isCreator = false;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.exists() ? userSnap.data() : {};
        isCreator = userData.role === "creator";
      } catch (err) {
        console.error("Error fetching user role:", err);
      }

      const dropdown = document.createElement("div");
      dropdown.classList.add("account-dropdown");

      dropdown.innerHTML = `
        <i class="fas fa-user user-icon"></i>
        <div class="dropdown-content">
          ${
            isCreator
              ? `
            <a href="${baseFolder.replace('wishlist_cart/', '')}creator_account/account.html">My Account</a>
            <a href="${baseFolder.replace('wishlist_cart/', '')}creator_account/orders.html">My Orders</a>
            `
              : ""
          }
          <a href="${baseFolder}wishlist.html">My Wishlist</a>
          <a href="${baseFolder}cart.html">My Cart</a>
          <a href="#" id="logout-btn">Logout</a>
        </div>
      `;

      navLinks.appendChild(dropdown);

      dropdown.querySelector("#logout-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          localStorage.clear();
          await signOut(auth);
          window.location.reload();
        } catch (error) {
          console.error("Logout error:", error);
        }
      });
    } else {
      if (!loginLink) {
        const loginAnchor = document.createElement("a");
        loginAnchor.href = "login_signup/login.html";
        loginAnchor.textContent = "Login / Sign Up";
        navLinks.appendChild(loginAnchor);
      }
    }
  });
});
