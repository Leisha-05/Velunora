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
} else if (pathname.includes("creator_account")) {
    baseFolder = "../wishlist_cart/";
} else if (pathname.includes("product_pg") || pathname.includes("category_pg")) {
    baseFolder = "../wishlist_cart/";
} else {
    baseFolder = "wishlist_cart/";
}


        if (user) {
            if (loginLink) loginLink.remove();
            if (navLinks.querySelector(".account-dropdown")) return;

            // 🔍 Check user role from Firestore
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);
            const userData = userSnap.exists() ? userSnap.data() : {};
            const isCreator = userData.role === "creator";

            const dropdown = document.createElement("div");
            dropdown.classList.add("account-dropdown");

            // 🎯 Render 5 links for creator, 3 for regular user
            dropdown.innerHTML = `
    <i class="fas fa-user user-icon"></i>
    <div class="dropdown-content">
        ${
          isCreator
            ? `
            <a href="${baseFolder}../creator_account/account.html">My Account</a>
            <a href="${baseFolder}../creator_account/orders.html">My Orders</a>
            `
            : ``
        }
        <a href="${baseFolder}wishlist.html">My Wishlist</a>
        <a href="${baseFolder}cart.html">My Cart</a>
        <a href="#" id="logout-btn">Logout</a>
    </div>
`;

            navLinks.appendChild(dropdown);

            // 🔐 Logout handler
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
            // 👤 Show login link if not logged in
            if (!loginLink) {
                const loginAnchor = document.createElement("a");
                loginAnchor.href = "login_signup/login.html";
                loginAnchor.textContent = "Login / Sign Up";
                navLinks.appendChild(loginAnchor);
            }
        }
    });
});
