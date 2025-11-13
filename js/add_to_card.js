const cartItems = document.getElementById("cartItems");
const priceDetails = document.getElementById("priceDetails");

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart = cart.map(item => ({ ...item, qty: item.qty || 1 }));

function renderCart() {
  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty 😢</p>";
    priceDetails.innerHTML = "";
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    const priceINR = item.price * 83;
    const discountPercent = 10; // 10% off each item
    const discountedPrice = priceINR - (priceINR * discountPercent) / 100;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.title}">
        <div class="cart-info">
          <h4>${item.title}</h4>

          <p>
            <span style="color:#2874f0; font-weight:600;">₹${discountedPrice.toLocaleString()}</span>
            <span style="text-decoration:line-through; color:#888; margin-left:6px;">₹${priceINR.toLocaleString()}</span>
            <span style="color:green; margin-left:6px;">(${discountPercent}% OFF)</span>
          </p>

          <div class="quantity-controls">
            <button onclick="decreaseQty(${item.id})">−</button>
            <span>${item.qty}</span>
            <button onclick="increaseQty(${item.id})">+</button>
          </div>
        </div>

        <div class="cart-actions">
          <button onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  updateSummary();
}

function increaseQty(id) {
  cart = cart.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
  saveAndRender();
}

function decreaseQty(id) {
  cart = cart.map(item => item.id === id && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item);
  saveAndRender();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveAndRender();
}

function updateSummary() {
  const total = cart.reduce((sum, item) => sum + item.price * 83 * item.qty, 0);
  const discount = total * 0.1; // 10% discount
  const delivery = total > 1000 ? 0 : 40;
  const finalTotal = total - discount + delivery;

  priceDetails.innerHTML = `
    <div class="price-row"><span>Price (${cart.length} items)</span><span>₹${total.toLocaleString()}</span></div>
    <div class="price-row"><span>Discount</span><span style="color:green;">− ₹${discount.toFixed(0)}</span></div>
    <div class="price-row"><span>Delivery Charges</span><span>${delivery === 0 ? "<span style='color:green'>FREE</span>" : "₹" + delivery}</span></div>
    <div class="total-row"><span>Total Amount</span><span>₹${finalTotal.toLocaleString()}</span></div>
  `;
}

function saveAndRender() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();
