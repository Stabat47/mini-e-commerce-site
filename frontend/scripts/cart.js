async function loadCart() {
  const token = localStorage.getItem("token");
  if (!token) {
    document.getElementById("cart-items").innerHTML = "<p>Please login to see your cart.</p>";
    return;
  }

  const res = await fetch("/api/orders/cart", {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();

  if (res.ok) {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";
    let total = 0;

    data.products.forEach(item => {
      container.innerHTML += `<p>${item.product.name} x ${item.quantity} = $${item.product.price * item.quantity}</p>`;
      total += item.product.price * item.quantity;
    });

    document.getElementById("cart-total").innerText = `Total: $${total.toFixed(2)}`;
  } else {
    alert(data.message || "Error loading cart");
  }
}

document.addEventListener("DOMContentLoaded", loadCart);
