const urlParams = new URLSearchParams(window.location.search);
const creatorName = urlParams.get("creator");

const creatorTitle = document.getElementById("creatorName");
const creatorLabel = document.getElementById("creatorLabel");
const productContainer = document.getElementById("productContainer");

// Set creator name in banner and section
creatorTitle.textContent = creatorName;
creatorLabel.textContent = creatorName;

// Filter products
const creatorProducts = productData.filter(
  (item) => item.creator === creatorName
);

// Display each product
creatorProducts.forEach((product) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
  <div class="image-wrapper">
    <a href="../product_pg/product.html?name=${encodeURIComponent(product.name)}">
      <img src="${product.img}" alt="${product.name}" />
    </a>
    <span class="ribbon">${product.discount} OFF</span>
    <div class="icon-bar">
      <i class="fas fa-heart" title="Add to Wishlist"></i>
      <i class="fas fa-shopping-cart" title="Add to Cart"></i>
      <i class="fas fa-share-alt" title="Share"></i>
    </div>
  </div>
  <div class="product-info">
    <h3>${product.name}</h3>
    <p>Category: ${product.category}</p>
    <div class="price">
      <span class="original">₹${(product.price / (1 - parseInt(product.discount)/100)).toFixed(0)}</span>
      <span class="discounted">₹${product.price}</span>
    </div>
  </div>
`;


  productContainer.appendChild(card);
});
