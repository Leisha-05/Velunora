// checkout.js — Firebase‑only cart & order placement (preserves your existing logic)

// Imports
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ─── 1) Firebase Init ────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyAX40PIcTdMLdaKk4EkVdwqfzCrybDxhLg",
  authDomain: "velunora-e4c6f.firebaseapp.com",
  projectId: "velunora-e4c6f",
  storageBucket: "velunora-e4c6f.appspot.com",
  messagingSenderId: "670245806188",
  appId: "1:670245806188:web:75a31084ee1c94a374f849"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

// ─── 2) UI Elements ─────────────────────────────────────────────────
const subtotalElem    = document.getElementById("subtotal");
const totalElem       = document.getElementById("total");
const placeOrderBtn   = document.getElementById("place-order-btn");
const nameInput       = document.getElementById("name");
const phoneInput      = document.getElementById("phone");
const addressInput    = document.getElementById("address");
const cityInput       = document.getElementById("city");
const stateInput      = document.getElementById("state");
const pincodeInput    = document.getElementById("pincode");

let currentUserId = null;
let cartItems     = [];

// ─── 3) Auth & Load Cart ────────────────────────────────────────────
onAuthStateChanged(auth, async (user) => {
  if (user) {
    currentUserId = user.uid;
  } else {
    const anon = await signInAnonymously(auth);
    currentUserId = anon.user.uid;
  }

  // Fetch cart from Firestore
  const cartSnap = await getDoc(doc(db, "userCarts", currentUserId));
  cartItems = cartSnap.exists() ? cartSnap.data().cart || [] : [];
  renderTotals();
});

// ─── 4) Render Subtotal & Total ─────────────────────────────────────
function renderTotals() {
  const deliveryCharge = 50;
  let subtotal = cartItems.reduce((sum, item) => {
    const price    = Number(item.price)    || 0;
    const quantity = Number(item.quantity) || 1;
    return sum + price * quantity;
  }, 0);

  subtotalElem.textContent = subtotal.toFixed(2);
  totalElem.textContent    = (subtotal + deliveryCharge).toFixed(2);
}

// ─── 5) Place Order Handler ─────────────────────────────────────────
placeOrderBtn.addEventListener("click", async () => {
  // Validate form fields
  const name    = nameInput.value.trim();
  const phone   = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const city    = cityInput.value.trim();
  const state   = stateInput.value.trim();
  const pin     = pincodeInput.value.trim();

  if (!name || !phone || !address || !city || !state || !pin) {
    return alert("Please fill all required fields.");
  }

  if (cartItems.length === 0) {
    return alert("Your cart is empty.");
  }

  // Derive unique creatorUIDs
  const creatorUIDs = Array.from(new Set(
    cartItems.map(it => it.creatorUID).filter(Boolean)
  ));
  if (creatorUIDs.length === 0) {
    return alert("No valid items with creatorUID in your cart to place an order.");
  }

  // Calculate totals again
  const deliveryCharge = 50;
  const subtotal = cartItems.reduce((sum, it) => sum + (it.price * it.quantity), 0);
  const total    = subtotal + deliveryCharge;

  // Build order object
  const order = {
    userId:      currentUserId,
    creatorUIDs,
    name,
    phone,
    address,
    city,
    state,
    pincode:     pin,
    payment:     "Cash on Delivery",
    items:       cartItems,
    total,
    orderDate:   serverTimestamp()
  };

  try {
    // Save order
    await addDoc(collection(db, "orders"), order);
    // Clear Firestore cart
    await setDoc(doc(db, "userCarts", currentUserId), { cart: [] }, { merge: true });
    alert("Order placed successfully!");
    window.location.href = "../index.html";
  } catch (err) {
    console.error("Error placing order:", err);
    alert("Failed to place order. Please try again.");
  }
});
