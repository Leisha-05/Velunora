document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("ordersContainer");
  const allOrders = JSON.parse(localStorage.getItem("allOrders")) || [];
  const creatorName = "Creator"; // Replace dynamically if needed

  const filteredOrders = allOrders.filter(order =>
    order.items.some(item => item.creator === creatorName)
  );

  if (filteredOrders.length === 0) {
    ordersContainer.innerHTML = "<p>No orders yet.</p>";
    return;
  }

  filteredOrders.forEach(order => {
    const orderDiv = document.createElement("div");
    orderDiv.className = "order-card";

    const itemList = order.items
      .filter(item => item.creator === creatorName)
      .map(item => {
        const customizationNote = item.customRequest?.message
          ? `<p><strong>Customization:</strong> ${item.customRequest.message}</p>`
          : "";

        const fileNote = item.customRequest?.fileName
          ? `<p><strong>File:</strong> 📎 ${item.customRequest.fileName}</p>`
          : "";

        return `
          <li>
            ${item.name} x ${item.quantity} - ₹${item.price}
            ${customizationNote}
            ${fileNote}
          </li>
        `;
      })
      .join("");

    orderDiv.innerHTML = `
      <h3>Order from: ${order.name}</h3>
      <p><strong>Address:</strong> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
      <p><strong>Phone:</strong> ${order.phone}</p>
      <p><strong>Payment:</strong> ${order.payment}</p>
      <p><strong>Date:</strong> ${order.orderDate}</p>
      <h4>Items:</h4>
      <ul>${itemList}</ul>
    `;

    ordersContainer.appendChild(orderDiv);
  });
});
