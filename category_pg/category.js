// import { db, auth } from "../login_signup/firebase.js";
// import {
//   collection,
//   getDocs,
//   query,
//   where,
//   doc,
//   getDoc,
//   setDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
// } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
// import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// // ✅ Get category from URL
// const params = new URLSearchParams(window.location.search);
// const selectedCategory = params.get("category");

// document.getElementById("categoryTitle").textContent =
//   selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Collection";

// const bannerFix = {
//   jewelery: "jewelry",
//   jewelry: "jewelry",
//   art: "art",
//   decor: "decor",
//   stationery: "stationery",
//   embroidery: "embroidery",
//   gifting: "gifting",
// };

// document.querySelector(".category-header img").src = `../images/headers/${bannerFix[selectedCategory] || "default"}-banner.jpg`;

// const productContainer = document.getElementById("productContainer");
// const searchInput = document.querySelector(".search-container input");
// const sortSelect = document.getElementById("priceFilter");

// let allProducts = [];

// async function fetchProducts() {
//   const q = query(collection(db, "products"), where("category", "==", selectedCategory));
//   const querySnapshot = await getDocs(q);

//   allProducts = [];
//   querySnapshot.forEach((doc) => {
//     allProducts.push({ id: doc.id, ...doc.data() });
//   });

//   displayProducts(allProducts);
// }

// function displayProducts(products) {
//   productContainer.innerHTML = "";

//   if (products.length === 0) {
//     productContainer.innerHTML = `<p>No products found for this category.</p>`;
//     return;
//   }

// <<<<<<< HEAD

//   // Remove duplicates based on name + creator
//   const seen = new Set();
//   const uniqueProducts = products.filter((p) => {
//     const key = `${p.name.toLowerCase()}__${p.creator?.toLowerCase()}`;
//     if (seen.has(key)) return false;
//     seen.add(key);
//     return true;
//   });

//   uniqueProducts.forEach((product) => {
// =======
//   products.forEach((product) => {
//     const discountPercent = parseInt((product.discount || "0").replace("%", "")) || 0;
//     const discountedPrice = product.price
//       ? Math.round(product.price * (1 - discountPercent / 100))
//       : 0;

//     const imgSrc = product.img || "../images/default.jpg";

// >>>>>>> 078321e1b7d6f04815e9b5fb812303e6d97d13b5
//     const card = document.createElement("div");
//     card.className = "product-card";
//     card.innerHTML = `
//       <div class="image-wrapper">
//         <span class="ribbon">${product.discount || "0%"} OFF</span>
//         <img src="${imgSrc}" alt="${product.name || "Product"}" />
//         <div class="icon-bar">
//           <i class="fas fa-heart wishlist-icon" data-product-name="${product.name}" title="Wishlist"></i>
//           <i class="fas fa-shopping-cart cart-icon" data-product-name="${product.name}" title="Add to Cart"></i>
//           <i class="fas fa-share-alt" title="Share"></i>
//         </div>
//       </div>
//       <h3>${product.name || "Product"}</h3>
//       <p class="price">
//         <span class="original">₹${product.price || 0}</span>
//         <span class="discounted">₹${discountedPrice}</span>
//       </p>
//     `;

//     card.addEventListener("click", (e) => {
//       if (e.target.closest(".icon-bar i")) return;
//       window.location.href = `../product_pg/product.html?id=${product.id}`;
//     });

//     productContainer.appendChild(card);
//   });

//   attachWishlistHandlers();
//   attachCartHandlers();
// }

// searchInput.addEventListener("input", () => {
//   const searchTerm = searchInput.value.trim().toLowerCase();
//   const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(searchTerm));
//   displayProducts(filtered);
// });

// sortSelect.addEventListener("change", () => {
//   const sortValue = sortSelect.value;
//   let sorted = [...allProducts];

//   if (sortValue === "low") {
//     sorted.sort((a, b) => a.price - b.price);
//   } else if (sortValue === "high") {
//     sorted.sort((a, b) => b.price - a.price);
//   }

//   displayProducts(sorted);
// });

// <<<<<<< HEAD
// =======
// function attachWishlistHandlers() {
//   const wishlistIcons = document.querySelectorAll(".wishlist-icon");

//   onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//       const anon = await signInAnonymously(auth);
//       user = anon.user;
//     }

//     const uid = user.uid;
//     const docRef = doc(db, "userWishlists", uid);
//     const snap = await getDoc(docRef).catch(console.error);
//     let wishlist = snap?.exists() ? snap.data().wishlist || [] : [];

//     wishlistIcons.forEach((icon) => {
//       const productName = icon.dataset.productName?.trim();
//       if (!productName) return;

//       if (wishlist.some((p) => p.name === productName)) {
//         icon.style.color = "red";
//       } else {
//         icon.style.color = "";
//       }

//       icon.addEventListener("click", async (e) => {
//         e.stopPropagation();

//         const latestSnap = await getDoc(docRef).catch(console.error);
//         const currentWishlist = latestSnap?.exists() ? latestSnap.data().wishlist || [] : [];
//         const existing = currentWishlist.find((p) => p.name === productName);

//         if (existing) {
//           await updateDoc(docRef, { wishlist: arrayRemove(existing) });
//           icon.style.color = "";
//         } else {
//           const product = allProducts.find((p) => p.name === productName);
//           if (!product) return;
//           await updateDoc(docRef, { wishlist: arrayUnion(product) }).catch(async () => {
//             await setDoc(docRef, { wishlist: [product] });
//           });
//           icon.style.color = "red";
//         }
//       });
//     });
//   });
// }

// function attachCartHandlers() {
//   const cartIcons = document.querySelectorAll(".cart-icon");

//   onAuthStateChanged(auth, async (user) => {
//     if (!user) {
//       const anon = await signInAnonymously(auth);
//       user = anon.user;
//     }

//     const uid = user.uid;
//     const docRef = doc(db, "userCarts", uid);
//     const snap = await getDoc(docRef).catch(console.error);
//     let cart = snap?.exists() ? snap.data().cart || [] : [];

//     cartIcons.forEach((icon) => {
//       const productName = icon.dataset.productName?.trim();
//       if (!productName) return;

//       if (cart.some((p) => p.name === productName)) {
//         icon.style.color = "green";
//       } else {
//         icon.style.color = "";
//       }

//       icon.addEventListener("click", async (e) => {
//         e.stopPropagation();

//         const latestSnap = await getDoc(docRef).catch(console.error);
//         const currentCart = latestSnap?.exists() ? latestSnap.data().cart || [] : [];
//         const existing = currentCart.find((p) => p.name === productName);

//         if (existing) {
//           await updateDoc(docRef, { cart: arrayRemove(existing) });
//           icon.style.color = "";
//         } else {
//           const product = allProducts.find((p) => p.name === productName);
//           if (!product) return;
//           await updateDoc(docRef, { cart: arrayUnion(product) }).catch(async () => {
//             await setDoc(docRef, { cart: [product] });
//           });
//           icon.style.color = "green";
//         }
//       });
//     });
//   });
// }

// >>>>>>> 078321e1b7d6f04815e9b5fb812303e6d97d13b5
// fetchProducts();

import { db, auth } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";

// ✅ Get category from URL
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

console.log("Selected Category from URL:", selectedCategory);

if (!selectedCategory) {
  document.getElementById("productContainer").innerHTML = `<p>Invalid or missing category.</p>`;
  throw new Error("Missing category in URL");
}

document.getElementById("categoryTitle").textContent =
  selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) + " Collection";

const bannerFix = {
  jewelery: "jewelry",
  jewelry: "jewelry",
  art: "art",
  decor: "decor",
  stationery: "stationery",
  embroidery: "embroidery",
  gifting: "gifting",
};

document.querySelector(".category-header img").src = `../images/headers/${bannerFix[selectedCategory.toLowerCase()] || "default"}-banner.jpg`;

const productContainer = document.getElementById("productContainer");
const searchInput = document.querySelector(".search-container input");
const sortSelect = document.getElementById("priceFilter");

let allProducts = [];

// ✅ Fetch products from Firestore
async function fetchProducts() {
  try {
    const q = query(
      collection(db, "products"),
      where("category", "==", selectedCategory.toLowerCase())
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      productContainer.innerHTML = `<p>No products found for this category.</p>`;
      return;
    }

    allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    displayProducts(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    productContainer.innerHTML = `<p>Failed to load products.</p>`;
  }
}

// ✅ Display products in grid
function displayProducts(products) {
  productContainer.innerHTML = "";

  if (products.length === 0) {
    productContainer.innerHTML = `<p>No products found for this category.</p>`;
    return;
  }

  const seen = new Set();
  const uniqueProducts = products.filter((p) => {
    const key = `${p.name?.toLowerCase()}__${p.creator?.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  uniqueProducts.forEach((product) => {
    const discountPercent = parseInt((product.discount || "0").replace("%", "")) || 0;
    const discountedPrice = product.price
      ? Math.round(product.price * (1 - discountPercent / 100))
      : 0;

    const imgSrc = product.img || "../images/default.jpg";

    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div class="image-wrapper">
        <span class="ribbon">${product.discount || "0%"} OFF</span>
        <img src="${imgSrc}" alt="${product.name || "Product"}" />
        <div class="icon-bar">
          <i class="fas fa-heart wishlist-icon" data-product-name="${product.name}" title="Wishlist"></i>
          <i class="fas fa-shopping-cart cart-icon" data-product-name="${product.name}" title="Add to Cart"></i>
          <i class="fas fa-share-alt" title="Share"></i>
        </div>
      </div>
      <h3>${product.name || "Product"}</h3>
      <p class="price">
        <span class="original">₹${product.price || 0}</span>
        <span class="discounted">₹${discountedPrice}</span>
      </p>
    `;

    card.addEventListener("click", (e) => {
      if (e.target.closest(".icon-bar i")) return;
      window.location.href = `../product_pg/product.html?id=${product.id}`;
    });

    productContainer.appendChild(card);
  });

  attachWishlistHandlers();
  attachCartHandlers();
}

// ✅ Search functionality
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = allProducts.filter((p) => p.name.toLowerCase().includes(searchTerm));
  displayProducts(filtered);
});

// ✅ Sort functionality
sortSelect.addEventListener("change", () => {
  const sortValue = sortSelect.value;
  let sorted = [...allProducts];

  if (sortValue === "low") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortValue === "high") {
    sorted.sort((a, b) => b.price - a.price);
  }

  displayProducts(sorted);
});

// ✅ Wishlist handler
function attachWishlistHandlers() {
  const wishlistIcons = document.querySelectorAll(".wishlist-icon");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const anon = await signInAnonymously(auth);
      user = anon.user;
    }

    const uid = user.uid;
    const docRef = doc(db, "userWishlists", uid);
    const snap = await getDoc(docRef).catch(console.error);
    let wishlist = snap?.exists() ? snap.data().wishlist || [] : [];

    wishlistIcons.forEach((icon) => {
      const productName = icon.dataset.productName?.trim();
      if (!productName) return;

      icon.style.color = wishlist.some((p) => p.name === productName) ? "red" : "";

      icon.addEventListener("click", async (e) => {
        e.stopPropagation();

        const latestSnap = await getDoc(docRef).catch(console.error);
        const currentWishlist = latestSnap?.exists() ? latestSnap.data().wishlist || [] : [];
        const existing = currentWishlist.find((p) => p.name === productName);

        if (existing) {
          await updateDoc(docRef, { wishlist: arrayRemove(existing) });
          icon.style.color = "";
        } else {
          const product = allProducts.find((p) => p.name === productName);
          if (!product) return;
          await updateDoc(docRef, { wishlist: arrayUnion(product) }).catch(async () => {
            await setDoc(docRef, { wishlist: [product] });
          });
          icon.style.color = "red";
        }
      });
    });
  });
}

// ✅ Cart handler
function attachCartHandlers() {
  const cartIcons = document.querySelectorAll(".cart-icon");

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      const anon = await signInAnonymously(auth);
      user = anon.user;
    }

    const uid = user.uid;
    const docRef = doc(db, "userCarts", uid);
    const snap = await getDoc(docRef).catch(console.error);
    let cart = snap?.exists() ? snap.data().cart || [] : [];

    cartIcons.forEach((icon) => {
      const productName = icon.dataset.productName?.trim();
      if (!productName) return;

      icon.style.color = cart.some((p) => p.name === productName) ? "green" : "";

      icon.addEventListener("click", async (e) => {
        e.stopPropagation();

        const latestSnap = await getDoc(docRef).catch(console.error);
        const currentCart = latestSnap?.exists() ? latestSnap.data().cart || [] : [];
        const existing = currentCart.find((p) => p.name === productName);

        if (existing) {
          await updateDoc(docRef, { cart: arrayRemove(existing) });
          icon.style.color = "";
        } else {
          const product = allProducts.find((p) => p.name === productName);
          if (!product) return;
          await updateDoc(docRef, { cart: arrayUnion(product) }).catch(async () => {
            await setDoc(docRef, { cart: [product] });
          });
          icon.style.color = "green";
        }
      });
    });
  });
}

// ✅ Call fetch on page load
fetchProducts();
