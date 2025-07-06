// ✅ CLEAN UPDATED orders.js for Velunora using creatorUID
import { auth, db } from "../login_signup/firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("ordersContainer");
  const loginLink = document.getElementById("loginLink");
  const userDropdown = document.getElementById("userDropdown");
  const logoutBtn = document.getElementById("logoutBtn");

  const creatorNameDisplay = document.getElementById("creatorName");
  const creatorEmailDisplay = document.getElementById("creatorEmail");

  let creatorName = "Creator";
  let creatorUID = null;

  // 🔐 Handle Authentication State
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      setTimeout(() => {
        alert("Please log in.");
        window.location.href = "../login_signup/login.html";
      }, 500);
      return;
    }

    loginLink.style.display = "none";
    userDropdown.style.display = "inline-block";

    creatorEmailDisplay.textContent = user.email || "Guest";
    creatorUID = user.uid;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        creatorName = userData.name || "Creator";
        creatorNameDisplay.textContent = creatorName;
      } else {
        creatorNameDisplay.textContent = "Creator";
      }
    } catch (err) {
      console.error("Error fetching creator name:", err);
      creatorNameDisplay.textContent = "Creator";
    }

    renderOrders();
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
      window.location.href = "../login_signup/login.html";
    });
  }
const sidebarLogout = document.getElementById("sidebarLogout");
  if (sidebarLogout) {
    sidebarLogout.addEventListener("click", async () => {
      await signOut(auth);
      localStorage.clear();
      window.location.href = "../login_signup/login.html";
    });
  }
  // ✅ Render Orders for This Creator
  async function renderOrders() {
    ordersContainer.innerHTML = "<p>Loading orders...</p>";

    try {
      if (!creatorUID) {
        ordersContainer.innerHTML = "<p>Unable to fetch orders. User not authenticated.</p>";
        return;
      }

      // ✅ Use query to fetch only orders containing this creatorUID (no orderBy to avoid index error)
      const q = query(
        collection(db, "orders"),
        where("creatorUIDs", "array-contains", creatorUID)
      );

      const querySnapshot = await getDocs(q);
      const orders = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        orders.push({
          id: docSnap.id,
          ...data
        });
      });

      // ✅ Sort orders client-side by date descending
      orders.sort((a, b) => {
        const aDate = a.orderDate?.toDate?.() ?? new Date(0);
        const bDate = b.orderDate?.toDate?.() ?? new Date(0);
        return bDate - aDate;
      });

      if (orders.length === 0) {
        ordersContainer.innerHTML = "<p>No orders yet.</p>";
        return;
      }

      ordersContainer.innerHTML = "";

      orders.forEach(order => {
        const orderDiv = document.createElement("div");
        orderDiv.className = "order-card";

        let formattedDate = "N/A";
        if (order.orderDate?.toDate) {
          formattedDate = order.orderDate.toDate().toLocaleString();
        }

        // ✅ Filter only the items that belong to this creatorUID
        const creatorItems = order.items.filter(item => item.creatorUID === creatorUID);

        let subtotal = 0;

        const itemList = creatorItems.map(item => {
          const price = parseFloat(item.price) || 0;
          const itemTotal = price; // quantity removed
          subtotal += itemTotal;

          const customizationNote = item.customRequest?.message
            ? `<p><strong>Customization:</strong> ${item.customRequest.message}</p>`
            : "";
          const fileNote = item.customRequest?.fileName
            ? `<p><strong>File:</strong> 📎 ${item.customRequest.fileName}</p>`
            : "";

          return `<li>
            ${item.name} – ₹${price.toFixed(2)} each = ₹${itemTotal.toFixed(2)}
            ${customizationNote}
            ${fileNote}
          </li>`;
        }).join("");

        const shipping = 50;
        const total = subtotal + shipping;

        orderDiv.innerHTML = `
          <h3>Order from: ${order.name}</h3>
          <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
          <p><strong>Phone:</strong> ${order.phone}</p>
          <p><strong>Payment:</strong> ${order.payment}</p>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <h4>Items:</h4>
          <ul>${itemList}</ul>
          <p><strong>Subtotal:</strong> ₹${subtotal.toFixed(2)}</p>
          <p><strong>Shipping:</strong> ₹${shipping}</p>
          <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
        `;

        ordersContainer.appendChild(orderDiv);
      });
    } catch (error) {
      console.error("Error fetching orders from Firestore:", error);
      ordersContainer.innerHTML = "<p>Error loading orders. Check console for details.</p>";
    }
  }

  // Optional: Alert order details when a card is clicked
  ordersContainer.addEventListener("click", (event) => {
    const card = event.target.closest(".order-card");
    if (card) {
      const orderDetails = card.querySelector("ul").innerText;
      alert(`Order Details:\n${orderDetails}`);
    }
  });
});
