import { db } from "./login_signup/firebase.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const categories = [
  {
    name: "Jewelry",
    img: "images/jewelery1.webp",
    discount: "10%",
    value: "jewelry",
  },
  {
    name: "Decor",
    img: "images/decors01.jpg",
    discount: "15%",
    value: "decor",
  },
  {
    name: "Art & Prints",
    img: "images/art01.png",
    discount: "5%",
    value: "art",
  },
  {
    name: "Stationery",
    img: "images/stationary01.jpg",
    discount: "20%",
    value: "stationery",
  },
  {
    name: "Embroidery",
    img: "images/embroidery01.jpg",
    discount: "12%",
    value: "embroidery",
  },
  {
    name: "Gifting",
    img: "images/gifting01.jpg",
    discount: "8%",
    value: "gifting",
  },
];

const container = document.getElementById("categoryContainer");

categories.forEach((cat) => {
  const card = document.createElement("div");
  card.className = "category-card";
  card.innerHTML = `
    <div class="image-wrapper">
      <span class="ribbon">min ${cat.discount} Off</span>
      <a href="category_pg/category.html?category=${cat.value}">
        <img src="${cat.img}" alt="${cat.name}">
      </a>
      <div class="view-coll">
        <a href="category_pg/category.html?category=${cat.value}">view collection</a>
      </div>
    </div>
    <h3>${cat.name}</h3>
  `;
  container.appendChild(card);
});

function setupSearchBar() {
  const searchInput = document.querySelector(".search-container input");
  const searchIcon = document.querySelector(".fa-search");

  const handleSearch = async () => {
    const keyword = searchInput.value.toLowerCase().trim();
    if (!keyword) return;

    const querySnapshot = await getDocs(collection(db, "products"));
    const allProducts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const matched = allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.category.toLowerCase().includes(keyword) ||
        (p.tags && p.tags.some((tag) => tag.toLowerCase().includes(keyword)))
    );

    if (matched.length === 0) {
      alert("No matching product found. Please try another keyword.");
      return;
    }

    const queryString = encodeURIComponent(keyword);
    window.location.href = `search_results.html?keyword=${queryString}`;
  };

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSearch();
  });
  searchIcon.addEventListener("click", handleSearch);
}

setupSearchBar();

const spotlightWrapper = document.getElementById("spotlightWrapper");
const dotsContainer = document.getElementById("dotIndicators");

const creators = [
  {
    name: "Aarushi Jain",
    brand: "Few Vows",
    avatar: "images/creators/a little extra/a little extra.png",
    products: [
      {
        img: "images/creators/a little extra/jewelery1.webp",
        name: "Durga Earrings",
      },
      {
        img: "images/creators/a little extra/jewelery2.webp",
        name: "Gold Stackable Bracelet",
      },
      {
        img: "images/creators/a little extra/jewelery3.jpg",
        name: "Brass Choker",
      },
    ],
  },
  {
    name: "Sanya Malhotra",
    brand: "Your Type",
    avatar: "images/creators/knot your type/knotyourtype.png",
    products: [
      {
        img: "images/creators/knot your type/embroid1.webp",
        name: "Flower basket DIY Embroidery kit",
      },
      {
        img: "images/creators/knot your type/embroid2.webp",
        name: "Beginner's Friendly Embroidery Kit",
      },
      {
        img: "images/creators/knot your type/embroid3.webp",
        name: "BPink positivity kit",
      },
    ],
  },
  {
    name: "Simran Bhatia",
    brand: "Simran's Hub",
    avatar: "images/creators/Mouni crafts/mouni_crafts.png",
    products: [
      { img: "images/creators/Mouni crafts/img1.webp", name: "3-D Miniatures" },
      { img: "images/creators/Mouni crafts/img2.png", name: "3-D Miniatures" },
      { img: "images/creators/Mouni crafts/img3.png", name: "3-D Miniatures" },
    ],
  },
];

creators.forEach((creator, index) => {
  const slide = document.createElement("div");
  slide.className = "spotlight-slide";
  slide.innerHTML = `
  <div class="spotlight-creator">
    <img src="${creator.avatar}" alt="${creator.name}" />
    <h4 class="creator-person-name">${creator.name}</h4>
    <p class="creator-brand-name">${creator.brand}</p>
  </div>
  <div class="spotlight-products-wrapper">
    <div class="spotlight-products">
      ${creator.products
        .map(
          (p) => `
  <div class="spotlight-product-card">
    <div class="product-img-wrapper">
      <img src="${p.img}" 
           alt="${p.name}" 
           class="clickable-product-img"
           data-name="${p.name}"
           data-creator="${creator.name}" />

      <div class="view-coll">
        <a href="#" 
           class="view-product-link" 
           data-name="${p.name}" 
           data-creator="${creator.name}">
           view product
        </a>
      </div>
    </div>
    <p>${p.name}</p>
  </div>
`
        )
        .join("")}

    <div class="view-creator-link">
  <a href="../creator_profile/creator_profile.html?creator=${encodeURIComponent(
    creator.name
  )}" class="btn">
    Explore Full Collection
  </a>
</div>
`;

  spotlightWrapper.appendChild(slide);

  const dot = document.createElement("span");
  dot.className = "dot";
  dot.dataset.index = index;
  dot.onclick = () => scrollToIndex(index);
  dotsContainer.appendChild(dot);
});

let currentIndex = 0;
const slides = document.querySelectorAll(".spotlight-slide");
const dots = document.querySelectorAll(".dot");

function updateDots(index) {
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });
}

function scrollToIndex(index) {
  const width = slides[0].offsetWidth + 32;
  spotlightWrapper.scrollTo({ left: index * width, behavior: "smooth" });
  currentIndex = index;
  updateDots(index);
}

function scrollNext() {
  if (currentIndex < slides.length - 1) {
    scrollToIndex(currentIndex + 1);
  }
}

function scrollPrev() {
  if (currentIndex > 0) {
    scrollToIndex(currentIndex - 1);
  }
}

spotlightWrapper.addEventListener("click", (e) => {
  const creatorElement = e.target.closest(".spotlight-creator");
  if (creatorElement) {
    const creatorName = creatorElement.querySelector(".creator-person-name")?.textContent.trim();
    if (creatorName) {
      window.location.href = `creator_profile/creator_profile.html?creator=${encodeURIComponent(creatorName)}`;
    }
    return;
  }

  const productImage = e.target.closest(".clickable-product-img");
  if (productImage) {
    const productName = productImage.dataset.name;
    if (productName) {
      window.location.href = `product_pg/product.html?name=${encodeURIComponent(productName)}`;
    }
    return;
  }

  const viewLink = e.target.closest(".view-product-link");
  if (viewLink) {
    const productName = viewLink.dataset.name;
    if (productName) {
      window.location.href = `product_pg/product.html?name=${encodeURIComponent(productName)}`;
    }
  }
});

updateDots(currentIndex);
