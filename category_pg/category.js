const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get("category");

// CATEGORY DATA
const categories = [
  {
    name: "Jewelry",
    img: "images/jewelry1.webp",
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

// Render category cards (if needed)
const container = document.getElementById("categoryContainer");
if (container) {
  categories.forEach((cat) => {
    const card = document.createElement("div");
    card.className = "category-card";
    card.innerHTML = `
      <div class="image-wrapper">
        <span class="ribbon">min ${cat.discount} Off</span>
        <img src="${cat.img}" alt="${cat.name}">
        <div class="view-coll">
          <a href="collection.html?category=${cat.value}">view collection</a>
        </div>
      </div>
      <h3>${cat.name}</h3>
    `;
    container.appendChild(card);
  });
}

// Set category title
document.getElementById("categoryTitle").textContent =
  selectedCategory.charAt(0).toUpperCase() +
  selectedCategory.slice(1) +
  " Collection";

// Set banner image
const bannerFix = {
  jewelery: "jewelry",
  jewelry: "jewelry",
  art: "art",
  decor: "decor",
  stationery: "stationery",
  embroidery: "embroidery",
  gifting: "gifting",
};

document.querySelector(
  ".category-header img"
).src = `../images/headers/${bannerFix[selectedCategory]}-banner.jpg`;

const productContainer = document.getElementById("productContainer");

const filteredProducts = productData.filter(
  (item) => item.category === selectedCategory
);

if (filteredProducts.length === 0) {
  productContainer.innerHTML = `<p>No products found for this category.</p>`;
} else {
  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.style.cursor = "pointer"; // Optional: makes it obvious it's clickable

    const discountPercent = parseInt(product.discount.replace("%", ""));
    const discountedPrice = Math.round(
      product.price * (1 - discountPercent / 100)
    );

    card.innerHTML = `
  <div class="image-wrapper">
    <span class="ribbon">${product.discount} OFF</span>
    <img src="${product.img}" alt="${product.name}" />
    <div class="icon-bar">
      <i class="fas fa-heart wishlist-icon" data-product-name="${product.name}" title="Wishlist"></i>
      <i class="fas fa-shopping-cart cart-icon" data-product-name="${product.name}" title="Add to Cart"></i>
      <i class="fas fa-share-alt" title="Share"></i>
    </div>
  </div>
  <h3>${product.name}</h3>
  <p class="price">
    <span class="original">₹${product.price}</span>
    <span class="discounted">₹${discountedPrice}</span>
  </p>
`;

    // 🔗 Add click event to redirect to product page with data
   card.addEventListener("click", (e) => {
  // Ignore clicks on icon-bar icons
  if (
    e.target.closest(".icon-bar i") // checks if you clicked an icon inside .icon-bar
  ) return;

  localStorage.setItem("selectedProduct", JSON.stringify(product));
  window.location.href = "../product_pg/product.html";
});
    productContainer.appendChild(card); // ✅ add the card to the grid
    setupWishlistIcons();              // ✅ re-run to attach events
    setupCartIcons();
  });
}

