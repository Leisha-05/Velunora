import { auth } from "./login_signup/firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelector(".nav-links");
    if (!navLinks) {
        console.error("❌ .nav-links not found.");
        return;
    }

    onAuthStateChanged(auth, (user) => {
        console.log("✅ Auth state changed:", user);

        const loginLink = navLinks.querySelector('a[href*="login"]');

        let baseFolder;
        const pathname = window.location.pathname;

        if (pathname.includes("wishlist_cart")) {
            baseFolder = "./";
        } else if (pathname.includes("product_pg") || pathname.includes("category_pg")) {
            baseFolder = "../wishlist_cart/";
        } else {
            baseFolder = "wishlist_cart/";
        }

        if (user) {
            if (loginLink) loginLink.remove();
            if (navLinks.querySelector(".account-dropdown")) return;

            const dropdown = document.createElement("div");
            dropdown.classList.add("account-dropdown");

            dropdown.innerHTML = `
                <i class="fas fa-user user-icon"></i>
                <div class="dropdown-content">
                    <a href="${baseFolder}wishlist.html">My Wishlist</a>
                    <a href="${baseFolder}cart.html">My Cart</a>
                    <a href="#" id="logout-btn">Logout</a>
                </div>
            `;

            navLinks.appendChild(dropdown);

            dropdown.querySelector("#logout-btn").addEventListener("click", async (e) => {
                e.preventDefault();
                try {
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
