import { auth } from "./login_signup/firebase.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

const db = getFirestore();

document.addEventListener("DOMContentLoaded", () => {
  const navActions = document.querySelector(".nav-actions");
  const loginSignup = document.querySelector(".login-signup");

  if (!navActions) {
    console.error("❌ nav-actions not found.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    console.log("✅ Auth state changed:", user);

    if (user) {
      if (loginSignup) loginSignup.remove();

      let isCreator = false;
      let userName = 'User';

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          isCreator = userData.role === "creator";
          userName = userData.name || user.displayName || 'User';
        } else {
          userName = user.displayName || 'User';
        }
      } catch (err) {
        console.error("❌ Error fetching user role:", err);
      }

      // Create user icon dropdown
      let existingDropdown = navActions.querySelector(".account-dropdown");
      if (existingDropdown) existingDropdown.remove();

      const dropdown = document.createElement("div");
      dropdown.classList.add("account-dropdown");
      dropdown.innerHTML = `
        <i class="fas fa-user user-icon"></i>
        <div class="dropdown-content">
          ${isCreator ? `
            <a href="/creator_account/account.html"><i class="fas fa-user-cog"></i> &nbsp;My Account</a>
            <a href="/creator_account/orders.html"><i class="fas fa-box"></i>  &nbsp;My Orders</a>` : ''}
          <a href="/wishlist_cart/wishlist.html"><i class="fas fa-heart"></i> &nbsp;My Wishlist</a>
          <a href="/wishlist_cart/cart.html"><i class="fas fa-shopping-cart"></i> &nbsp;My Cart</a>
          <a href="#" id="logout-btn"><i class="fas fa-sign-out-alt"></i> &nbsp;Logout</a>
        </div>
      `;
      navActions.insertBefore(dropdown, navActions.firstChild);

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

      // ✅ Update sidebar user info with Firestore name
      const sidebarUserInfo = document.querySelector(".sidebar-user-info");
      const sidebarUserLinks = document.querySelector(".sidebar-user-links");

      if (sidebarUserInfo) {
        sidebarUserInfo.innerHTML = `
          <div class="sidebar-user-inline">
            <div class="sidebar-user-icon">
              <i class="fas fa-user"></i>
            </div>
            <div class="sidebar-user-details">
              <p class="welcome-text">Good Day 👋</p>
              <p class="user-name">${userName}</p>
              <p class="user-email">${user.email}</p>
            </div>
          </div>
        `;
      }

      if (sidebarUserLinks) {
        sidebarUserLinks.innerHTML = `
          ${isCreator ? `
            <a href="/creator_account/account.html">My Account</a>
            <a href="/creator_account/orders.html">My Orders</a>` : ''}
          <a href="/wishlist_cart/wishlist.html">My Wishlist</a>
          <a href="/wishlist_cart/cart.html">My Cart</a>
          <a href="#" id="sidebar-logout">Logout</a>
        `;

        sidebarUserLinks.querySelector("#sidebar-logout").addEventListener("click", async (e) => {
          e.preventDefault();
          try {
            localStorage.clear();
            await signOut(auth);
            window.location.reload();
          } catch (error) {
            console.error("❌ Sidebar logout error:", error);
          }
        });
      }

    } else {
      // Not logged in
      if (!loginSignup) {
        const newLoginSignup = document.createElement("div");
        newLoginSignup.classList.add("login-signup");
        newLoginSignup.innerHTML = `
          <a href="login_signup/login.html">Login / Sign Up</a>
        `;
        navActions.insertBefore(newLoginSignup, navActions.firstChild);
      }

      const dropdown = navActions.querySelector(".account-dropdown");
      if (dropdown) dropdown.remove();

      const sidebarUserInfo = document.querySelector(".sidebar-user-info");
      const sidebarUserLinks = document.querySelector(".sidebar-user-links");

      if (sidebarUserInfo) sidebarUserInfo.innerHTML = "";
      if (sidebarUserLinks) {
        sidebarUserLinks.innerHTML = `
          <a href="login_signup/login.html">Login / Sign Up</a>
        `;
      }
    }
  });
});
