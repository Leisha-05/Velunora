import { auth } from "./login_signup/firebase.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const navActions = document.querySelector(".nav-actions");
  const navLinks = document.querySelector(".nav-links");
  const loginSignup = document.querySelector(".login-signup");

  if (!navLinks || !navActions) {
    console.error("❌ nav-links or nav-actions not found.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    console.log("✅ Auth state changed:", user);

    if (user) {
      // ✅ Remove login/signup container if exists
      if (loginSignup) loginSignup.remove();

      // 🔍 Check user role
      let isCreator = false;
      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          isCreator = userData.role === "creator";
        }
      } catch (err) {
        console.error("❌ Error fetching user role:", err);
      }

      // ✅ Remove old dropdown if exists (avoid duplicates)
      const existingDropdown = navActions.querySelector(".account-dropdown");
      if (existingDropdown) existingDropdown.remove();

      // ✅ Create user dropdown
      const dropdown = document.createElement("div");
      dropdown.classList.add("account-dropdown");
      dropdown.innerHTML = `
        <i class="fas fa-user user-icon"></i>
        <div class="dropdown-content">
          ${isCreator ? `
            <a href="/creator_account/account.html">My Account</a>
            <a href="/creator_account/orders.html">My Orders</a>` : ''}
          <a href="/wishlist_cart/wishlist.html">My Wishlist</a>
          <a href="/wishlist_cart/cart.html">My Cart</a>
          <a href="#" id="logout-btn">Logout</a>
        </div>
      `;

      // ✅ Insert the dropdown exactly where login/signup was
      navActions.insertBefore(dropdown, navActions.firstChild);

      // ✅ Logout logic
      dropdown.querySelector("#logout-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          localStorage.clear();
          await signOut(auth);
          window.location.reload();
        } catch (error) {
          console.error("❌ Logout error:", error);
        }
      });

    } else {
      // ✅ If logged out, ensure Login/Signup is present
      if (!loginSignup) {
        const newLoginSignup = document.createElement("div");
        newLoginSignup.classList.add("login-signup");
        newLoginSignup.innerHTML = `
          <a href="login_signup/login.html">Login / Sign Up</a>
        `;
        navActions.insertBefore(newLoginSignup, navActions.firstChild);
      }

      // ✅ Remove user dropdown if it exists
      const dropdown = navActions.querySelector(".account-dropdown");
      if (dropdown) dropdown.remove();
    }
  });
});
