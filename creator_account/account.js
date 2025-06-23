document.addEventListener("DOMContentLoaded", () => {
  const addForm = document.getElementById("addProductForm");
  const removeForm = document.getElementById("removeProductForm");
  const container = document.getElementById("creatorProductContainer");

  let creatorProducts = JSON.parse(localStorage.getItem("creatorProducts")) || [];

  function saveProducts() {
    localStorage.setItem("creatorProducts", JSON.stringify(creatorProducts));
    renderProducts();
  }

  function renderProducts() {
    container.innerHTML = "";
    if (creatorProducts.length === 0) {
      container.innerHTML = "<p>No products yet.</p>";
      return;
    }

    creatorProducts.forEach((product) => {
      const card = document.createElement("div");
      card.className = "wishlist-card";
      card.innerHTML = `
        <div class="image-wrapper">
          <img src="${product.img}" alt="${product.name}" />
        </div>
        <h3>${product.name}</h3>
        <div class="price">
          <span class="discounted">₹${product.price}</span>
          <span class="original">₹${(product.price * 1.2).toFixed(0)}</span>
        </div>
      `;
      container.appendChild(card);
    });
  }

  addForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("prodName").value.trim();
    const imgInput = document.getElementById("prodImg");
    const discount = document.getElementById("prodDiscount").value.trim();
    const price = Number(document.getElementById("prodPrice").value);
    const category = document.getElementById("prodCategory").value;

    const file = imgInput.files[0];
    if (!file) return alert("Please select an image");

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = e.target.result;

      creatorProducts.push({ name, img, discount, price, category });
      saveProducts();
      addForm.reset();
    };
    reader.readAsDataURL(file);
  });

  removeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameToRemove = document.getElementById("removeProdName").value.trim();

    const initialLength = creatorProducts.length;
    creatorProducts = creatorProducts.filter((p) => p.name !== nameToRemove);

    if (creatorProducts.length === initialLength) {
      alert("No product found with that name.");
    } else {
      alert("Product removed!");
      saveProducts();
    }

    removeForm.reset();
  });

  renderProducts(); // Initial load
});
