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

const spotlightWrapper = document.getElementById("spotlightWrapper");
const dotsContainer = document.getElementById("dotIndicators");

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
      ${creator.products.map(p => `
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
`).join("")}



    </div>
    <div class="view-creator-link">
      <a href="#" class="btn">Explore Full Collection</a>
    </div>
  </div>
`;

  spotlightWrapper.appendChild(slide);

  const dot = document.createElement("span");
  dot.className = "dot";
  dot.dataset.index = index;
  dot.onclick = () => scrollToIndex(index);
  dotsContainer.appendChild(dot);
});

document.querySelectorAll(".view-product-link").forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const productName = this.closest(".spotlight-product-card").querySelector(
      "p"
    ).textContent;

    // Look up the full product details from data.js
    const selectedProduct = window.productData.find(
      (p) => p.name === productName
    );

    if (selectedProduct) {
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
      window.location.href = "product_pg/product.html";
    } else {
      alert("Product details not found!");
    }
  });
});
// 🔁 Also add click listener to product images
document.querySelectorAll(".clickable-product-img").forEach((img) => {
  img.addEventListener("click", function (e) {
    e.preventDefault();
    const productName = this.dataset.name;
    const creatorName = this.dataset.creator;

    const selectedProduct = window.productData.find(
      (p) => p.name === productName && p.creator === creatorName
    );

    if (selectedProduct) {
      localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
      window.location.href = "product_pg/product.html";
    } else {
      alert("Product details not found!");
    }
  });
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
  const width = slides[0].offsetWidth + 32; // include padding/gap
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

// Initial highlight
updateDots(currentIndex);
