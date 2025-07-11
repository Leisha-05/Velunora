import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAX40PIcTdMLdaKk4EkVdwqfzCrybDxhLg",
  authDomain: "velunora-e4c6f.firebaseapp.com",
  projectId: "velunora-e4c6f",
  storageBucket: "velunora-e4c6f.appspot.com",
  messagingSenderId: "670245806188",
  appId: "1:670245806188:web:75a31084ee1c94a374f849",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser = null;

document.addEventListener("DOMContentLoaded", () => {
  const wishlistContainer = document.getElementById("wishlistContainer");
  const userName = document.getElementById("userName");
  const userEmail = document.getElementById("userEmail");
  const logoutBtn = document.getElementById("logoutBtn");
  const cartNav = document.getElementById("cartNav");

  if (cartNav) {
    cartNav.addEventListener("click", () => {
      window.location.href = "cart.html";
    });
  }

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      document.getElementById("navName").textContent =
        user.displayName || user.email?.split("@")[0] || "User";
      userName.textContent =
        user.displayName || user.email?.split("@")[0] || "Guest";
      userEmail.textContent = user.email || "guest@email.com";

      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};
      const isCreator = userData.role === "creator";

      if (!isCreator) {
        const profileLink = document.getElementById("profileLink");
        const ordersLink = document.getElementById("ordersLink");
        if (profileLink) profileLink.style.display = "none";
        if (ordersLink) ordersLink.style.display = "none";
      }
    } else {
      const anon = await signInAnonymously(auth);
      currentUser = anon.user;
      userName.textContent = "Guest User";
      userEmail.textContent = "guest@email.com";
    }

    const wishlist = await loadWishlist(currentUser.uid);
    const cart = await loadCart(currentUser.uid);
    renderWishlist(wishlistContainer, wishlist, cart);
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(
        () => (window.location.href = "../login_signup/login.html")
      );
    });
  }

  const sidebarLogout = document.getElementById("sidebarLogout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", async () => {
      try {
        await signOut(auth);
        window.location.href = `${window.location.origin}/login_signup/login.html`;
      } catch (err) {
        console.error("Sidebar logout failed:", err);
      }
    });
  }

  // ✅ Add search bar event listener HERE, NOT inside a function
  const searchInput = document.getElementById("wishlistSearchInput");
  const searchIcon = document.getElementById("wishlistSearchIcon");

  function handleSearch() {
    const keyword = searchInput?.value.trim();
    if (keyword) {
      window.location.href = `../search_results.html?keyword=${encodeURIComponent(
        keyword
      )}`;
    }
  }

  if (searchInput && searchIcon) {
    searchIcon.addEventListener("click", handleSearch);
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    });
  }
});

// 🔧 Helpers
async function loadWishlist(uid) {
  const snap = await getDoc(doc(db, "userWishlists", uid));
  return snap.exists() ? snap.data().wishlist || [] : [];
}

async function loadCart(uid) {
  const snap = await getDoc(doc(db, "userCarts", uid));
  return snap.exists() ? snap.data().cart || [] : [];
}

function calculateDiscount(price, discountStr) {
  const discount = parseInt(discountStr?.replace("%", "") || "0");
  return isNaN(discount)
    ? price
    : Math.round(price - (price * discount) / 100);
}

function renderWishlist(container, wishlist, cart) {
  container.innerHTML = wishlist.length
    ? ""
    : "<p>Your wishlist is empty.</p>";

  wishlist.forEach((product) => {
    const discountedPrice = calculateDiscount(product.price, product.discount);
    const isInCart = cart.some((p) => p.name === product.name);

    const card = document.createElement("div");
    card.className = "wishlist-card";

    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.img}" alt="${product.name}" />
        <div class="icon-bar">
          <i class="fas fa-times wishlist-remove-icon" title="Remove"></i>
          <i class="fas fa-shopping-cart add-to-cart" title="Add to Cart"></i>
          <i class="fas fa-share-alt" title="Share"></i>
        </div>
      </div>
      <h3>${product.name}</h3>
      <p class="price"><span class="discounted">₹${discountedPrice}</span> <span class="original">₹${product.price}</span></p>
    `;

    const removeIcon = card.querySelector(".wishlist-remove-icon");
    const cartIcon = card.querySelector(".add-to-cart");

    if (isInCart) {
      cartIcon.style.color = "green";
    }

    removeIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      const wishlistRef = doc(db, "userWishlists", currentUser.uid);
      await updateDoc(wishlistRef, { wishlist: arrayRemove(product) });
      const updatedWishlist = await loadWishlist(currentUser.uid);
      const updatedCart = await loadCart(currentUser.uid);
      renderWishlist(container, updatedWishlist, updatedCart);
    });

    cartIcon.addEventListener("click", async (e) => {
      e.stopPropagation();
      const cartRef = doc(db, "userCarts", currentUser.uid);
      const snap = await getDoc(cartRef);
      const currentCart = snap.exists() ? snap.data().cart || [] : [];
      const alreadyInCart = currentCart.some((p) => p.name === product.name);

      if (!alreadyInCart) {
        await updateDoc(cartRef, { cart: arrayUnion(product) }).catch(
          async () => {
            await setDoc(cartRef, { cart: [product] });
          }
        );
        cartIcon.style.color = "green";
      }
    });

    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "../product_pg/product.html";
    });

    container.appendChild(card);
  });
}
