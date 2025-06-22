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

// --------------------------------------
// ADD THIS: Render products for selected category
// --------------------------------------

const productData = [
  {
    name: "Rose Quartz Necklace",
    img: "../images/products/jewelry1.jpg",
    discount: "15%",
    price: 1571,
    category: "jewelry",
  },
  {
    name: "Beaded Anklet",
    img: "../images/products/jewelry2.jpg",
    discount: "5%",
    price: 1436,
    category: "jewelry",
  },
  {
    name: "Pearl Earrings",
    img: "../images/products/jewelry3.jpg",
    discount: "20%",
    price: 1773,
    category: "jewelry",
  },
  {
    name: "Turquoise Ring",
    img: "../images/products/jewelry4.jpg",
    discount: "10%",
    price: 1351,
    category: "jewelry",
  },
  {
    name: "Silver Bracelet",
    img: "../images/products/jewelry5.jpg",
    discount: "10%",
    price: 1489,
    category: "jewelry",
  },
  {
    name: "Gold Nose Pin",
    img: "../images/products/jewelry6.jpg",
    discount: "15%",
    price: 1116,
    category: "jewelry",
  },
  {
    name: "Threaded Choker",
    img: "../images/products/jewelry7.jpg",
    discount: "15%",
    price: 889,
    category: "jewelry",
  },
  {
    name: "Gemstone Pendant",
    img: "../images/products/jewelry8.jpg",
    discount: "5%",
    price: 233,
    category: "jewelry",
  },
  {
    name: "Hoop Earrings",
    img: "../images/products/jewelry9.jpg",
    discount: "20%",
    price: 494,
    category: "jewelry",
  },
  {
    name: "Layered Chain",
    img: "../images/products/jewelry10.jpg",
    discount: "10%",
    price: 946,
    category: "jewelry",
  },
  {
    name: "Ethnic Bangles",
    img: "../images/products/jewelry11.jpg",
    discount: "10%",
    price: 1582,
    category: "jewelry",
  },
  {
    name: "Minimalist Studs",
    img: "../images/products/jewelry12.jpg",
    discount: "20%",
    price: 1372,
    category: "jewelry",
  },
  {
    name: "Macrame Wall Hanging",
    img: "../images/products/decor1.jpg",
    discount: "5%",
    price: 666,
    category: "decor",
  },
  {
    name: "Clay Planter",
    img: "../images/products/decor2.jpg",
    discount: "10%",
    price: 1097,
    category: "decor",
  },
  {
    name: "Handmade Dreamcatcher",
    img: "../images/products/decor3.jpg",
    discount: "5%",
    price: 909,
    category: "decor",
  },
  {
    name: "Bamboo Lamp",
    img: "../images/products/decor4.jpg",
    discount: "10%",
    price: 1105,
    category: "decor",
  },
  {
    name: "Terracotta Vase",
    img: "../images/products/decor5.jpg",
    discount: "20%",
    price: 1508,
    category: "decor",
  },
  {
    name: "Wall Mirror",
    img: "../images/products/decor6.jpg",
    discount: "15%",
    price: 418,
    category: "decor",
  },
  {
    name: "Resin Coasters",
    img: "../images/products/decor7.jpg",
    discount: "5%",
    price: 1339,
    category: "decor",
  },
  {
    name: "Boho Rug",
    img: "../images/products/decor8.jpg",
    discount: "15%",
    price: 1562,
    category: "decor",
  },
  {
    name: "String Light Jar",
    img: "../images/products/decor9.jpg",
    discount: "20%",
    price: 852,
    category: "decor",
  },
  {
    name: "Tapestry",
    img: "../images/products/decor10.jpg",
    discount: "5%",
    price: 1802,
    category: "decor",
  },
  {
    name: "Wooden Frame Art",
    img: "../images/products/decor11.jpg",
    discount: "5%",
    price: 1349,
    category: "decor",
  },
  {
    name: "Hanging Shelf",
    img: "../images/products/decor12.jpg",
    discount: "20%",
    price: 676,
    category: "decor",
  },
  {
    name: "Sunset Canvas",
    img: "../images/products/art_prints1.jpg",
    discount: "15%",
    price: 1634,
    category: "art",
  },
  {
    name: "Abstract Print",
    img: "../images/products/art_prints2.jpg",
    discount: "15%",
    price: 1776,
    category: "art",
  },
  {
    name: "Custom Portrait",
    img: "../images/products/art_prints3.jpg",
    discount: "20%",
    price: 1496,
    category: "art",
  },
  {
    name: "Mandala Artwork",
    img: "../images/products/art_prints4.jpg",
    discount: "20%",
    price: 278,
    category: "art",
  },
  {
    name: "Minimal Line Art",
    img: "../images/products/art_prints5.jpg",
    discount: "15%",
    price: 470,
    category: "art",
  },
  {
    name: "Mountain Sketch",
    img: "../images/products/art_prints6.jpg",
    discount: "10%",
    price: 1028,
    category: "art",
  },
  {
    name: "Watercolor Scenery",
    img: "../images/products/art_prints7.jpg",
    discount: "15%",
    price: 1672,
    category: "art",
  },
  {
    name: "Folk Art Poster",
    img: "../images/products/art_prints8.jpg",
    discount: "15%",
    price: 1765,
    category: "art",
  },
  {
    name: "Quote Print",
    img: "../images/products/art_prints9.jpg",
    discount: "20%",
    price: 593,
    category: "art",
  },
  {
    name: "Botanical Art",
    img: "../images/products/art_prints10.jpg",
    discount: "20%",
    price: 337,
    category: "art",
  },
  {
    name: "Mythical Creature Print",
    img: "../images/products/art_prints11.jpg",
    discount: "10%",
    price: 1823,
    category: "art",
  },
  {
    name: "Cityscape Watercolor",
    img: "../images/products/art_prints12.jpg",
    discount: "15%",
    price: 1972,
    category: "art",
  },
  {
    name: "Vintage Bookmark Set",
    img: "../images/products/stationery1.jpg",
    discount: "10%",
    price: 411,
    category: "stationery",
  },
  {
    name: "Handmade Diary",
    img: "../images/products/stationery2.jpg",
    discount: "15%",
    price: 871,
    category: "stationery",
  },
  {
    name: "Botanical Stickers",
    img: "../images/products/stationery3.jpg",
    discount: "20%",
    price: 1985,
    category: "stationery",
  },
  {
    name: "Ink Pen Set",
    img: "../images/products/stationery4.jpg",
    discount: "10%",
    price: 995,
    category: "stationery",
  },
  {
    name: "Doodle Pad",
    img: "../images/products/stationery5.jpg",
    discount: "15%",
    price: 1576,
    category: "stationery",
  },
  {
    name: "Letter Writing Kit",
    img: "../images/products/stationery6.jpg",
    discount: "10%",
    price: 728,
    category: "stationery",
  },
  {
    name: "Washi Tape Pack",
    img: "../images/products/stationery7.jpg",
    discount: "15%",
    price: 411,
    category: "stationery",
  },
  {
    name: "Custom Notebook",
    img: "../images/products/stationery8.jpg",
    discount: "20%",
    price: 1713,
    category: "stationery",
  },
  {
    name: "Planner Sheets",
    img: "../images/products/stationery9.jpg",
    discount: "5%",
    price: 686,
    category: "stationery",
  },
  
  {
    name: "Floral Hoop Art",
    img: "../images/products/embroidery1.jpg",
    discount: "15%",
    price: 848,
    category: "embroidery",
  },
  {
    name: "Bird Embroidery Frame",
    img: "../images/products/embroidery2.jpg",
    discount: "10%",
    price: 350,
    category: "embroidery",
  },
  {
    name: "Boho Thread Design",
    img: "../images/products/embroidery3.jpg",
    discount: "10%",
    price: 529,
    category: "embroidery",
  },
  {
    name: "Custom Name Stitch",
    img: "../images/products/embroidery4.jpg",
    discount: "10%",
    price: 1275,
    category: "embroidery",
  },
  {
    name: "Wedding embroidery",
    img: "../images/products/embroidery5.jpg",
    discount: "15%",
    price: 936,
    category: "embroidery",
  },
  {
    name: "Mini Pocket Embroidery",
    img: "../images/products/embroidery6.jpg",
    discount: "10%",
    price: 1551,
    category: "embroidery",
  },
  {
    name: "Zodiac Sign Stitch",
    img: "../images/products/embroidery7.jpg",
    discount: "10%",
    price: 1353,
    category: "embroidery",
  },
  {
    name: "Peacock Pattern",
    img: "../images/products/embroidery8.jpg",
    discount: "10%",
    price: 251,
    category: "embroidery",
  },
  {
    name: "Butterfly Patch",
    img: "../images/products/embroidery9.jpg",
    discount: "15%",
    price: 1459,
    category: "embroidery",
  },
  {
    name: "Custom Mug",
    img: "../images/products/gifting1.jpg",
    discount: "20%",
    price: 379,
    category: "gifting",
  },
  {
    name: "Scented Candle Box",
    img: "../images/products/gifting2.jpg",
    discount: "10%",
    price: 934,
    category: "gifting",
  },
  {
    name: "Mini Gift Hamper",
    img: "../images/products/gifting3.jpg",
    discount: "20%",
    price: 552,
    category: "gifting",
  },
  {
    name: "Birthday Explosion Box",
    img: "../images/products/gifting4.jpg",
    discount: "10%",
    price: 627,
    category: "gifting",
  },
  {
    name: "Love Letter Set",
    img: "../images/products/gifting5.jpg",
    discount: "15%",
    price: 1916,
    category: "gifting",
  },
  {
    name: "Handmade Chocolate Pack",
    img: "../images/products/gifting6.jpg",
    discount: "20%",
    price: 1736,
    category: "gifting",
  },
  {
    name: "Polaroid Memory Box",
    img: "../images/products/gifting7.jpg",
    discount: "5%",
    price: 1582,
    category: "gifting",
  },
  {
    name: "Personalized Keychain",
    img: "../images/products/gifting8.jpg",
    discount: "5%",
    price: 347,
    category: "gifting",
  },
  {
    name: "Message Bottle",
    img: "../images/products/gifting9.jpg",
    discount: "20%",
    price: 1148,
    category: "gifting",
  },
];
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

  const discountPercent = parseInt(product.discount.replace("%", ""));
  const discountedPrice = Math.round(
    product.price * (1 - discountPercent / 100)
  );

  card.innerHTML = `
  <div class="image-wrapper">
    <span class="ribbon">${product.discount} OFF</span>
    <img src="${product.img}" alt="${product.name}" />
    <div class="icon-bar">
      <i class="fas fa-heart" title="Wishlist"></i>
      <i class="fas fa-shopping-cart" title="Add to Cart"></i>
      <i class="fas fa-share-alt" title="Share"></i>
    </div>
  </div>
  <h3>${product.name}</h3>
  <p class="price">
    <span class="original">₹${product.price}</span>
    <span class="discounted">₹${discountedPrice}</span>
  </p>
`;


  productContainer.appendChild(card);
});

}
