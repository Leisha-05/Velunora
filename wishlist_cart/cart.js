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
  setDoc
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
     if (user.displayName) {
    userName.textContent = user.displayName;
    } else if (user.email) {
    userName.textContent = user.email.split("@")[0]; 
    } else {
    userName.textContent = "Guest User";
}

userEmail.textContent = user.email || "guest@email.com";

    } else {
      const anonUser = await signInAnonymously(auth);
      currentUser = anonUser.user;
      userName.textContent = "Guest User";
      userEmail.textContent = "guest@email.com";
    }
    const cart = await loadCart(currentUser.uid);
    renderCart(cart);
  });

  async function loadCart(uid) {
    try {
      const cartRef = doc(db, "userCarts", uid);
      const docSnap = await getDoc(cartRef);
      const cart = docSnap.exists() && docSnap.data().cart ? docSnap.data().cart : [];
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
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

  function renderCart(cart) {
    cartContainer.innerHTML = "";

    if (!cart || cart.length === 0) {
      cartContainer.innerHTML = "<p>Your cart is empty.</p>";
      return;
    }

    cart.forEach((item) => {
      const discountedPrice = item.discount
        ? calculateDiscount(item.price, item.discount)
        : item.price;

      const productCard = document.createElement("div");
      productCard.className = "wishlist-card";
      productCard.innerHTML = `
        <div class="image-wrapper">
          <img src="${item.img}" alt="${item.name}">
          <div class="icon-bar">
            <i class="fas fa-heart wishlist-icon" title="Add to Wishlist"></i>
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

      productCard.addEventListener("click", () => {
        localStorage.setItem("selectedProduct", JSON.stringify(item));
        window.location.href = "../product_pg/product.html";
      });

      productCard.querySelector(".cart-remove-icon").addEventListener("click", async (e) => {
        e.stopPropagation();
        const updatedCart = cart.filter((c) => c.name !== item.name);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        await saveCart(currentUser.uid, updatedCart);
        productCard.remove();
        if (updatedCart.length === 0) {
          cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        }
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
