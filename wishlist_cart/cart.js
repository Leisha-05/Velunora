// ✅ Firebase & Firestore Setup
import {
    getAuth,
    onAuthStateChanged,
    signInAnonymously,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    arrayUnion
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAX40PIcTdMLdaKk4EkVdwqfzCrybDxhLg",
    authDomain: "velunora-e4c6f.firebaseapp.com",
    projectId: "velunora-e4c6f",
    storageBucket: "velunora-e4c6f.appspot.com",
    messagingSenderId: "670245806188",
    appId: "1:670245806188:web:75a31084ee1c94a374f849"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
    const cartContainer = document.getElementById("cartContainer");
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");
    const logoutBtn = document.getElementById("logoutBtn");
    const wishlistNav = document.getElementById("wishlistNav");

    if (wishlistNav) {
        wishlistNav.addEventListener("click", () => {
            window.location.href = "wishlist.html";
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = "../login_signup/login.html";
            }).catch((error) => {
                console.error("Logout error:", error);
            });
        });
    }

   onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        userName.textContent = user.displayName || user.email?.split("@")[0] || "Guest User";
        userEmail.textContent = user.email || "guest@email.com";

        // 🔹 Check role to hide sidebar links if not creator
        try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            const userData = userDoc.exists() ? userDoc.data() : {};
            const isCreator = userData.role === "creator";

            if (!isCreator) {
                const profileLink = document.getElementById("profileLink");
                const ordersLink = document.getElementById("ordersLink");
                if (profileLink) profileLink.style.display = "none";
                if (ordersLink) ordersLink.style.display = "none";
            }
        } catch (err) {
            console.error("Error checking user role:", err);
        }

    } else {
        const anonUser = await signInAnonymously(auth);
        currentUser = anonUser.user;
        userName.textContent = "Guest User";
        userEmail.textContent = "guest@email.com";
    }

    // 🔹 Load and render cart + wishlist
    const cart = await loadCart(currentUser.uid);
    const wishlist = await loadWishlist(currentUser.uid);
    renderCart(cart, wishlist);

    // 🔹 Logout handling
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", async () => {
            try {
                await signOut(auth);
                window.location.href = "../login_signup/login.html"; // or window.location.reload();
            } catch (error) {
                console.error("Error during logout:", error);
            }
        });
    }
    const sidebarLogout = document.getElementById("sidebarLogout");
if (sidebarLogout) {
  sidebarLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      // clear any local state if needed:
      localStorage.clear();
      // redirect to login page:
      window.location.href = "../login_signup/login.html";
    } catch (err) {
      console.error("Sidebar logout failed:", err);
    }
  });
}
});


    async function loadCart(uid) {
        try {
            const cartRef = doc(db, "userCarts", uid);
            const docSnap = await getDoc(cartRef);
            return docSnap.exists() && docSnap.data().cart ? docSnap.data().cart : [];
        } catch (e) {
            console.error("❌ Failed to load cart from Firestore:", e);
            return [];
        }
    }

    async function saveCart(uid, cart) {
        try {
            await setDoc(doc(db, "userCarts", uid), { cart }, { merge: true });
        } catch (err) {
            console.error("❌ Failed to save cart to Firestore:", err);
        }
    }

    async function loadWishlist(uid) {
        try {
            const ref = doc(db, "userWishlists", uid);
            const snap = await getDoc(ref);
            return snap.exists() && snap.data().wishlist ? snap.data().wishlist : [];
        } catch (e) {
            console.error("❌ Failed to load wishlist from Firestore:", e);
            return [];
        }
    }

    async function saveWishlist(uid, wishlist) {
        try {
            await setDoc(doc(db, "userWishlists", uid), { wishlist }, { merge: true });
        } catch (err) {
            console.error("❌ Failed to save wishlist to Firestore:", err);
        }
    }

    function renderCart(cart, wishlist) {
        cartContainer.innerHTML = "";

        if (!cart || cart.length === 0) {
            cartContainer.innerHTML = "<p>Your cart is empty.</p>";
            return;
        }

        cart.forEach((item) => {
            const discountedPrice = item.discount ? calculateDiscount(item.price, item.discount) : item.price;
            const isInWishlist = wishlist.some(w => w.name === item.name);

            const productCard = document.createElement("div");
            productCard.className = "wishlist-card";
            productCard.innerHTML = `
                <div class="image-wrapper">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="icon-bar">
                        <i class="fas fa-heart wishlist-icon ${isInWishlist ? 'active' : ''}" title="Add to Wishlist"></i>
                        <i class="fas fa-times cart-remove-icon" title="Remove from Cart"></i>
                        <i class="fas fa-share-alt" title="Share"></i>
                    </div>
                </div>
                <h3>${item.name}</h3>
                <p class="price">
                    <span class="discounted">₹${discountedPrice}</span>
                    <span class="original">₹${item.price}</span>
                </p>
                ${item.customRequest?.message ? `
                    <p class="custom-request">
                        <strong>Customization:</strong> ${item.customRequest.message}<br>
                        ${item.customRequest.fileName ? `📎 File: ${item.customRequest.fileName}` : ''}
                    </p>` : ''}
            `;

           productCard.querySelector(".wishlist-icon").addEventListener("click", async (e) => {
    e.stopPropagation();

    const heartIcon = e.target;
    if (heartIcon.classList.contains("active")) {
        // Already in wishlist; optionally show toast or ignore
        return;
    }

    try {
        const uid = currentUser.uid;
        const wishlistRef = doc(db, "userWishlists", uid);
        const wishlistSnap = await getDoc(wishlistRef);
        let wishlist = wishlistSnap.exists() && wishlistSnap.data().wishlist ? wishlistSnap.data().wishlist : [];

        // Check for duplicate by name (adjust as needed)
        const alreadyInWishlist = wishlist.some(w => w.name === item.name);
        if (!alreadyInWishlist) {
            wishlist.push(item);
            await setDoc(wishlistRef, { wishlist }, { merge: true });
        }

        // Immediately turn the heart red
        heartIcon.classList.add("active");

    } catch (error) {
        console.error("Failed to add to wishlist:", error);
    }
});


            productCard.querySelector(".cart-remove-icon").addEventListener("click", async (e) => {
                e.stopPropagation();
                const updatedCart = cart.filter(c => c.name !== item.name);
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                await saveCart(currentUser.uid, updatedCart);
                productCard.remove();
                if (updatedCart.length === 0) {
                    cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                }
            });

            productCard.addEventListener("click", () => {
                localStorage.setItem("selectedProduct", JSON.stringify(item));
                window.location.href = "../product_pg/product.html";
            });

            cartContainer.appendChild(productCard);
        });

        const btnWrapper = document.createElement("div");
        btnWrapper.className = "order-btn-wrapper";
        btnWrapper.innerHTML = `<button id="checkout-btn" class="order-all-btn">Order All</button>`;
        cartContainer.appendChild(btnWrapper);

        document.getElementById("checkout-btn").addEventListener("click", () => {
            window.location.href = "checkout.html";
        });
    }
});

function calculateDiscount(price, discountStr) {
    const discount = parseInt(discountStr.replace("%", ""));
    return Math.round(price - (price * discount) / 100);
}
