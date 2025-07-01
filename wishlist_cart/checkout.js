import { getAuth, onAuthStateChanged, signInAnonymously, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// ✅ Initialize Firebase
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

// ✅ Handle user name and email on checkout
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");

onAuthStateChanged(auth, async (user) => {
    if (user) {
        userName.textContent = user.displayName || user.email?.split("@")[0] || "Guest";
        userEmail.textContent = user.email || "guest@email.com";
    } else {
        const anon = await signInAnonymously(auth);
        const anonUser = anon.user;
        userName.textContent = "Guest User";
        userEmail.textContent = "guest@email.com";
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const subtotalElem = document.getElementById("subtotal");
    const totalElem = document.getElementById("total");

    let subtotal = 0;

    cartItems.forEach(item => {
        const price = Number(item.price);
        const quantity = Number(item.quantity) || 1; // fallback to 1

        if (isNaN(price) || isNaN(quantity)) {
            console.warn("Invalid item in cart:", item);
            return;
        }

        subtotal += price * quantity;
    });

    subtotalElem.textContent = isNaN(subtotal) ? "0" : subtotal;
    totalElem.textContent = isNaN(subtotal) ? "0" : subtotal + 50;

    document.getElementById("place-order-btn").addEventListener("click", () => {
        const name = document.getElementById("name").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();
        const state = document.getElementById("state").value.trim();
        const pincode = document.getElementById("pincode").value.trim();

        if (!name || !phone || !address || !city || !state || !pincode) {
            alert("Please fill all required fields.");
            return;
        }

        const storedProducts = JSON.parse(localStorage.getItem("allProducts")) || [];

        const order = {
            name,
            phone,
            address,
            city,
            state,
            pincode,
            payment: "Cash on Delivery",
            items: cartItems.map(item => {
                const product = storedProducts.find(p => p.name === item.productName) || {};
                return {
                    name: item.productName,
                    quantity: 1,
                    price: product.price || 0,
                    creator: product.creator || "Unknown",
                    customRequest: item.customRequest || {}
                };
            }),
            total: subtotal + 50,
            orderDate: new Date().toLocaleString()
        };

        const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
        allOrders.push(order);
        localStorage.setItem("allOrders", JSON.stringify(allOrders));

        localStorage.setItem("lastOrder", JSON.stringify(order));
        localStorage.removeItem("cart");

        alert("Order placed successfully!");
        window.location.href = "../index.html"; // Redirect to home after order
    });
});
