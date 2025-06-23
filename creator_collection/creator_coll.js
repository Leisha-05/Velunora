const creatorContainer = document.getElementById("creatorContainer");

// Create unique creator cards
const creatorsMap = new Map();

productData.forEach((product) => {
  if (!creatorsMap.has(product.creator)) {
    creatorsMap.set(product.creator, {
      creator: product.creator,
      img: product.img,
      category: product.category
    });
  }
});

creatorsMap.forEach((creator) => {
  const card = document.createElement("div");
  card.classList.add("product-card");

  card.innerHTML = `
    <div class="image-wrapper">
      <a href="../creator_profile/creator_profile.html?creator=${encodeURIComponent(creator.creator)}">
  <img src="${creator.img}" alt="${creator.creator}" />
</a>

      <div class="view-coll">
        <a href="../creator_profile/creator_profile.html?creator=${encodeURIComponent(creator.creator)}">View Profile</a>
      </div>
    </div>
    <div class="product-info">
      <h3>${creator.creator}</h3>
      <p>Category: ${creator.category}</p>
    </div>
  `;

  creatorContainer.appendChild(card);
});
