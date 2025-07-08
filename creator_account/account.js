import { db, auth } from "../login_signup/firebase.js";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

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

      // Set email from auth
      document.getElementById("creatorEmail").textContent = user.email;

      try {
        const userDoc = await getDoc(doc(db, "users", currentUID));
        if (userDoc.exists()) {
          const data = userDoc.data();
          currentDisplayName = data.name || currentDisplayName;
        } else {
          console.warn("No Firestore document found.");
        }
      } catch (err) {
        console.error("Error fetching creator name:", err);
      }

      // Update UI with name
      document.getElementById("creatorName").textContent = currentDisplayName;

      // Load products
      await loadCreatorProducts();
    } else {
      alert("Please log in to access your account.");
      window.location.href = "../login_signup/login.html";
    }
  });

  async function loadCreatorProducts() {
    container.innerHTML = "<p>Loading...</p>";
    const q = query(
      collection(db, "products"),
      where("creatorUID", "==", currentUID)
    );
    const querySnapshot = await getDocs(q);

    creatorProducts = [];
    container.innerHTML = "";

    if (querySnapshot.empty) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }

    querySnapshot.forEach((docSnap) => {
      const product = docSnap.data();
      product.id = docSnap.id;
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
      const discountPercent = parseInt(
        product.discount?.replace("%", "") || "0"
      );
      const discountedPrice = Math.round(
        product.price - (product.price * discountPercent) / 100
      );

      const card = document.createElement("div");
      card.className = "wishlist-card clickable";
      card.setAttribute("data-product-id", product.id);

      card.innerHTML = `
  <div class="image-wrapper">
    <img src="${product.img}" alt="${product.name}" />
    <div class="discount-ribbon">${product.discount} OFF</div>
  </div>
  <h3>${product.name}</h3>
  <div class="price">
    <span class="discounted">₹${discountedPrice}</span>
    <span class="original">₹${product.price}</span>
  </div>
`;
      card.addEventListener("click", () => {
        window.location.href = `../product_pg/product.html?id=${product.id}`;
      });

      container.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.trim().toLowerCase();

    if (!keyword) {
      renderCreatorProducts(creatorProducts);
      return;
    }

    const filtered = creatorProducts.filter(
      (p) =>
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
          creator: currentDisplayName,
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
