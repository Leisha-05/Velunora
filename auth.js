// import { auth } from "./login_signup/firebase.js";
// import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// document.addEventListener("DOMContentLoaded", () => {
//     const navLinks = document.querySelector(".nav-links");
//     if (!navLinks) {
//         console.error("❌ .nav-links not found.");
//         return;
//     }

//     onAuthStateChanged(auth, (user) => {
//         console.log("✅ Auth state changed:", user);

//         const loginLink = navLinks.querySelector('a[href*="login"]');

// <<<<<<< HEAD
//     // Determine depth for correct path to files
//     const depth = window.location.pathname.split("/").length - 2;
//     const basePath = "../".repeat(depth);

//     dropdown.innerHTML = `
//       <i class="fas fa-user user-icon"></i>
//       <div class="dropdown-content">
//         ${
//           userRole === "creator"
//             ? `
//           <a href="${basePath}creator_account/account.html">My Account</a>
//           <a href="${basePath}creator_account/orders.html">My Orders</a>
//         `
//             : ""
//         }
//         <a href="${basePath}wishlist_cart/wishlist.html">My Wishlist</a>
//         <a href="${basePath}wishlist_cart/cart.html">My Cart</a>
//         <a href="#" id="logout-btn">Logout</a>
//       </div>
//     `;
// =======
//         let baseFolder;
//         const pathname = window.location.pathname;

//         if (pathname.includes("wishlist_cart")) {
//             baseFolder = "./";
//         } else if (pathname.includes("product_pg") || pathname.includes("category_pg")) {
//             baseFolder = "../wishlist_cart/";
//         } else {
//             baseFolder = "wishlist_cart/";
//         }

//         if (user) {
//             if (loginLink) loginLink.remove();
//             if (navLinks.querySelector(".account-dropdown")) return;
// >>>>>>> 078321e1b7d6f04815e9b5fb812303e6d97d13b5

//             const dropdown = document.createElement("div");
//             dropdown.classList.add("account-dropdown");

// <<<<<<< HEAD
//     dropdown.querySelector("#logout-btn").addEventListener("click", () => {
//       localStorage.clear();
//       location.reload();
// =======
//             dropdown.innerHTML = `
//                 <i class="fas fa-user user-icon"></i>
//                 <div class="dropdown-content">
//                     <a href="${baseFolder}wishlist.html">My Wishlist</a>
//                     <a href="${baseFolder}cart.html">My Cart</a>
//                     <a href="#" id="logout-btn">Logout</a>
//                 </div>
//             `;

//             navLinks.appendChild(dropdown);

//             dropdown.querySelector("#logout-btn").addEventListener("click", async (e) => {
//                 e.preventDefault();
//                 try {
//                     await signOut(auth);
//                     window.location.reload();
//                 } catch (error) {
//                     console.error("Logout error:", error);
//                 }
//             });
//         } else {
//             if (!loginLink) {
//                 const loginAnchor = document.createElement("a");
//                 loginAnchor.href = "login_signup/login.html";
//                 loginAnchor.textContent = "Login / Sign Up";
//                 navLinks.appendChild(loginAnchor);
//             }
//         }
// >>>>>>> 078321e1b7d6f04815e9b5fb812303e6d97d13b5
//     });
// });





import { auth } from "./login_signup/firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) {
    console.error("❌ .nav-links not found.");
    return;
  }

  onAuthStateChanged(auth, async (user) => {
    console.log("✅ Auth state changed:", user);

    const loginLink = navLinks.querySelector('a[href*="login"]');

    if (user) {
      // Remove login link if user is logged in
      if (loginLink) loginLink.remove();
      if (navLinks.querySelector(".account-dropdown")) return;

      // ✅ Determine relative base path
      const pathname = window.location.pathname;
      let basePath = "";

      if (pathname.includes("wishlist_cart")) {
        basePath = "./";
      } else if (pathname.includes("product_pg") || pathname.includes("category_pg") || pathname.includes("creator_profile")) {
        basePath = "../wishlist_cart/";
      } else if (pathname.includes("creator_account")) {
        basePath = "../wishlist_cart/";
      } else {
        basePath = "wishlist_cart/";
      }

      const accountDropdown = document.createElement("div");
      accountDropdown.classList.add("account-dropdown");

      // ✅ Try fetching role from localStorage (assumes it was stored after login)
      const userRole = localStorage.getItem("userRole") || "user";

      accountDropdown.innerHTML = `
        <i class="fas fa-user user-icon"></i>
        <div class="dropdown-content">
          ${
            userRole === "creator"
              ? `
            <a href="${basePath.replace("wishlist_cart/", "")}creator_account/account.html">My Account</a>
            <a href="${basePath.replace("wishlist_cart/", "")}creator_account/orders.html">My Orders</a>
          `
              : ""
          }
          <a href="${basePath}wishlist.html">My Wishlist</a>
          <a href="${basePath}cart.html">My Cart</a>
          <a href="#" id="logout-btn">Logout</a>
        </div>
      `;

      navLinks.appendChild(accountDropdown);

      // ✅ Logout handler
      accountDropdown.querySelector("#logout-btn").addEventListener("click", async (e) => {
        e.preventDefault();
        try {
          localStorage.clear();
          await signOut(auth);
          location.reload();
        } catch (error) {
          console.error("Logout error:", error);
        }
      });
    } else {
      // ✅ If not logged in, show login button
      if (!loginLink) {
        const loginAnchor = document.createElement("a");
        loginAnchor.href = "login_signup/login.html";
        loginAnchor.textContent = "Login / Sign Up";
        navLinks.appendChild(loginAnchor);
      }
    }
  });
});
