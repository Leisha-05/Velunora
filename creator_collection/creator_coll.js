import { db } from "../login_signup/firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const creatorContainer = document.getElementById("creatorContainer");
const searchInput = document.querySelector(".creator-search");

let allCreators = [];

async function loadCreators() {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const allProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const creatorsMap = new Map();

    allProducts.forEach(product => {
      const creator = product.creator?.trim();
      if (creator && !creatorsMap.has(creator)) {
        creatorsMap.set(creator, {
          name: creator,
          img: product.img,
          category: product.category || "Misc",
        });
      }
    });

    allCreators = [...creatorsMap.values()];
    renderCreators(allCreators);
  } catch (error) {
    console.error("Error loading creators:", error);
    creatorContainer.innerHTML = "<p>Error loading creators.</p>";
  }
}

function renderCreators(creators) {
  creatorContainer.innerHTML = "";
  if (creators.length === 0) {
    creatorContainer.innerHTML = "<p>No creators found.</p>";
    return;
  }

  creators.forEach(creator => {
    const card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <div class="image-wrapper">
        <a href="../creator_profile/creator_profile.html?creator=${encodeURIComponent(creator.name)}">
          <img src="${creator.img}" alt="${creator.name}" />
        </a>
        <div class="view-coll">
          <a href="../creator_profile/creator_profile.html?creator=${encodeURIComponent(creator.name)}">View Profile</a>
        </div>
      </div>
      <div class="product-info">
        <h3>${creator.name}</h3>
        <p>Category: ${creator.category}</p>
      </div>
    `;
    creatorContainer.appendChild(card);
  });
}

function handleLiveSearch() {
  const keyword = searchInput.value.trim().toLowerCase();

  if (!keyword) {
    renderCreators(allCreators);
    return;
  }

  const filtered = allCreators.filter(creator =>
    creator.name.toLowerCase().includes(keyword) ||
    creator.category.toLowerCase().includes(keyword)
  );

  renderCreators(filtered);
}

document.addEventListener("DOMContentLoaded", () => {
  searchInput.addEventListener("input", handleLiveSearch);
  loadCreators();
});
