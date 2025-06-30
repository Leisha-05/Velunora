import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, arrayUnion, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyAX40PIcTdMLdaKk4EkVdwqfzCrybDxhLg",
  authDomain: "velunora-e4c6f.firebaseapp.com",
  projectId: "velunora-e4c6f",
  storageBucket: "velunora-e4c6f.appspot.com",
  messagingSenderId: "670245806188",
  appId: "1:670245806188:web:75a31084ee1c94a374f849"
};

// Initialize Firebase
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

        if (user.displayName) {
            userName.textContent = user.displayName;
        } else if (user.email) {
            userName.textContent = user.email.split("@")[0];
        } else {
            userName.textContent = "Guest User";
        }

        userEmail.textContent = user.email || "guest@email.com";
    } else {
        const anon = await signInAnonymously(auth);
        currentUser = anon.user;
        userName.textContent = "Guest User";
        userEmail.textContent = "guest@email.com";
    }

    const wishlist = await loadWishlist(currentUser.uid);
    renderWishlist(wishlistContainer, wishlist);
});


  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      signOut(auth).then(() => {
        window.location.href = "../login_signup/login.html";
      }).catch((error) => {
        console.error("Logout error:", error);
      });
    });
  }
});

async function loadWishlist(uid) {
  try {
    const snap = await getDoc(doc(db, "userWishlists", uid));
    return snap.exists() ? snap.data().wishlist || [] : [];
  } catch (err) {
    console.error("Failed to fetch wishlist:", err);
    return [];
  }
}

function calculateDiscount(price, discountStr) {
  if (typeof price !== "number") return "N/A";
  const discount = parseInt(discountStr?.replace("%", "") || "0");
  return isNaN(discount) ? price : Math.round(price - (price * discount) / 100);
}

function renderWishlist(container, wishlist) {
  container.innerHTML = "";

  if (!wishlist || wishlist.length === 0) {
    container.innerHTML = "<p>Your wishlist is empty.</p>";
    return;
  }

  wishlist.forEach((product) => {
    const discountedPrice = calculateDiscount(product.price, product.discount);
    const card = document.createElement("div");
    card.className = "wishlist-card";
    card.innerHTML = `
      <div class="image-wrapper">
        <img src="${product.img || '#'}" alt="${product.name || 'Product'}" />
        <div class="icon-bar">
          <i class="fas fa-times wishlist-remove-icon" data-name="${product.name}" title="Remove from Wishlist"></i>
          <i class="fas fa-shopping-cart" title="Add to Cart"></i>
          <i class="fas fa-share-alt" title="Share"></i>
        </div>
      </div>
      <h3>${product.name || "Unnamed Product"}</h3>
      <p class="price">
        <span class="discounted">₹${discountedPrice}</span>
        <span class="original">₹${product.price || "N/A"}</span>
      </p>
    `;

    card.addEventListener("click", () => {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
      window.location.href = "../product_pg/product.html";
    });

    container.appendChild(card);
  });

  container.addEventListener("click", async (e) => {
    if (e.target.classList.contains("wishlist-remove-icon")) {
      e.stopPropagation();
      const name = e.target.dataset.name;
      let wishlist = await loadWishlist(currentUser.uid);
      wishlist = wishlist.filter((item) => item.name !== name);
      await setDoc(doc(db, "userWishlists", currentUser.uid), { wishlist });
      location.reload();
    }
  });
}
