import { db, auth } from '../login_signup/firebase.js';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addProductForm");
  const removeForm = document.getElementById("removeProductForm");
  const container = document.getElementById("creatorProductContainer");
  const searchInput = document.querySelector(".search-container input");

  let currentUID = null;
  let currentDisplayName = null;
  let creatorProducts = [];

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUID = user.uid;
      currentDisplayName = user.displayName || "Unknown Creator";

      // Show creator name instead of email
      document.getElementById("creatorName").textContent = currentDisplayName;
      document.getElementById("creatorEmail").textContent = "@" + user.email.split("@")[0];

      await loadCreatorProducts();
    } else {
      alert("Please log in to access your account.");
      window.location.href = '../login_signup/login.html';
    }
  });

  async function loadCreatorProducts() {
    container.innerHTML = "<p>Loading...</p>";
    const q = query(collection(db, "products"), where("creatorUID", "==", currentUID));
    const querySnapshot = await getDocs(q);

    creatorProducts = [];
    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      creatorProducts.push(product);
    });

    renderCreatorProducts(creatorProducts);
  }

  function renderCreatorProducts(products) {
    container.innerHTML = "";

    if (products.length === 0) {
      container.innerHTML = "<p>No matching products found.</p>";
      return;
    }

    products.forEach((product) => {
      const originalPrice = Math.round(product.price / (1 - parseFloat(product.discount) / 100));

      const card = document.createElement("div");
      card.className = "wishlist-card";
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${product.img}" alt="${product.name}" />
        </div>
        <h3>${product.name}</h3>
        <div class="price">
          <span class="discounted">₹${product.price}</span>
          <span class="original">₹${originalPrice}</span>
          <span class="discount-tag">(${product.discount} OFF)</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
      renderCreatorProducts(creatorProducts);
      return;
    }

    const filtered = creatorProducts.filter(p =>
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
    );

    renderCreatorProducts(filtered);
  });

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("prodName").value.trim();
    const imgInput = document.getElementById("prodImg");
    const discount = document.getElementById("prodDiscount").value.trim();
    const price = Number(document.getElementById("prodPrice").value);
    const category = document.getElementById("prodCategory").value;

    const file = imgInput.files[0];
    if (!file) return alert("Please select an image");

    const reader = new FileReader();

    reader.onload = async function (e) {
      const img = e.target.result;

      try {
        await addDoc(collection(db, "products"), {
          name,
          img,
          discount,
          price,
          category,
          creatorUID: currentUID,
          creator: currentDisplayName
        });
        alert("Product added!");
        addForm.reset();
        await loadCreatorProducts();
      } catch (err) {
        alert("Error adding product: " + err.message);
      }
    };

    reader.readAsDataURL(file);
  });

  removeForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nameToRemove = document.getElementById("removeProdName").value.trim();

    const q = query(
      collection(db, "products"),
      where("creatorUID", "==", currentUID),
      where("name", "==", nameToRemove)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("No product found with that name.");
    } else {
      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "products", docSnap.id))
      );
      await Promise.all(deletePromises);
      alert("Product removed!");
      await loadCreatorProducts();
    }

    removeForm.reset();
  });
});




