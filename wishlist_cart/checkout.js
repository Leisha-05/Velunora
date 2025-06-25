document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const subtotalElem = document.getElementById("subtotal");
  const totalElem = document.getElementById("total");

  console.log("Cart Items:", cartItems);

  let subtotal = 0;

  cartItems.forEach(item => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (isNaN(price) || isNaN(quantity)) {
      console.warn("Invalid item in cart:", item);
      return;
    }

    subtotal += price * quantity;
  });

  subtotalElem.textContent = isNaN(subtotal) ? "0" : subtotal;
  totalElem.textContent = isNaN(subtotal) ? "0" : subtotal + 50;

  document.getElementById("place-order-btn").addEventListener("click", () => {
    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const state = document.getElementById("state").value.trim();
    const pincode = document.getElementById("pincode").value.trim();

    if (!name || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all required fields.");
      return;
    }

    const order = {
  name,
  phone,
  address,
  city,
  state,
  pincode,
  payment: "Cash on Delivery",
  items: cartItems.map(item => {
    const storedProducts = JSON.parse(localStorage.getItem("allProducts")) || [];
    const product = storedProducts.find(p => p.name === item.productName) || {};

    return {
      name: item.productName,
      quantity: 1,
      price: product.price || 0,
      creator: product.creator || "Unknown",
      customRequest: item.customRequest || {}
    };
  }),
  total: subtotal + 50,
  orderDate: new Date().toLocaleString()
};

    const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
allOrders.push(order);
localStorage.setItem("allOrders", JSON.stringify(allOrders));

    localStorage.setItem("lastOrder", JSON.stringify(order));
    localStorage.removeItem("cart");

    alert("Order placed successfully!");
    window.location.href = "../index.html"; // Create this page next!
  });
});
