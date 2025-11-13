const params = new URLSearchParams(window.location.search);
const id = params.get("id");
displayProduct(id);

async function displayProduct(id) {
  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();

    // ⭐ Rating stars
    const fullStars = Math.floor(data.rating);
    const halfStar = data.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    let stars = "";
    for (let i = 0; i < fullStars; i++) stars += '<span class="star full">★</span>';
    if (halfStar) stars += '<span class="star half">★</span>';
    for (let i = 0; i < emptyStars; i++) stars += '<span class="star empty">☆</span>';

    // 🖼️ Thumbnail gallery
    const thumbs = data.images.map((img, i) =>
      `<img src="${img}" class="thumb ${i === 0 ? "active" : ""}" alt="thumbnail">`
    ).join("");

    const priceINR = (data.price * 83).toLocaleString();

    // 🧠 Dummy reviews (DummyJSON doesn’t include reviews)
    const reviews = [
      { reviewerName: "Anjana", rating: 5, comment: "Excellent quality and fast delivery!", date: "2025-11-01" },
      { reviewerName: "Rahul", rating: 4, comment: "Good product, but packaging could be better.", date: "2025-11-03" },
      { reviewerName: "Sneha", rating: 3, comment: "Average experience, expected more.", date: "2025-11-08" }
    ];

    const reviewsHTML = reviews.map(r => `
      <div class="review">
        <div class="review-header">
          <div class="stars">${"⭐".repeat(r.rating)}</div>
        </div>
        <p class="review-comment">${r.comment}</p>
        <div class="review-footer">
          <span class="review-user">${r.reviewerName} <span class="verified">✔ Verified Buyer</span></span>
          <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
        </div>
        <div class="review-actions">
          <button class="like-btn">👍 Helpful</button>
          <button class="dislike-btn">👎 Not Helpful</button>
        </div>
      </div>
    `).join("");

    document.title=`${data.title}`
    // 📦 Main content
    document.getElementById("product").innerHTML = `
      <div class="product-page">
        <div class="left-section">
          <div class="thumbs">${thumbs}</div>
          <div class="main-image">
            <img id="mainImg" src="${data.images[0]}" alt="${data.title}">
            <div class="buttons">
              <button id="cartBtn" class="cart-btn">ADD TO CART</button>
              <button class="buy-btn">BUY NOW</button>
            </div>
          </div>
        </div>

        <div class="right-section">
          <h1 class="title">${data.title}</h1>
          <p class="brand">Brand: ${data.brand}</p>
          <div class="rating">${stars} <span>${data.rating}</span></div>
          <p class="price">
            ₹${priceINR}
            <span class="old-price">₹${(data.price * 100).toLocaleString()}</span>
            <span class="offer">${data.discountPercentage}% off</span>
          </p>

          <div class="highlight">
            <h3>Highlights</h3>
            <ul>
              <li>Category: ${data.category}</li>
              <li>In Stock: ${data.stock}</li>
              <li>Warranty: ${data.warrantyInformation || "1 Year Warranty"}</li>
              <li>Return: ${data.returnPolicy || "7 Days Return Policy"}</li>
            </ul>
          </div>

          <div class="desc">
            <h3>Description</h3>
            <p>${data.description}</p>
          </div>

          <div class="reviews">
            <h3>Customer Reviews</h3>
            ${reviewsHTML}
          </div>
        </div>
      </div>
    `;

    // 🖱️ Thumbnail hover
    document.querySelectorAll(".thumb").forEach(thumb => {
      thumb.addEventListener("mousemove", () => {
        document.getElementById("mainImg").src = thumb.src;
        document.querySelectorAll(".thumb").forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });

    // 👍 Like / 👎 Unlike interactivity
    document.querySelectorAll(".like-btn, .dislike-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
      });
    });

    // 🛒 Add to Cart functionality
const cartBtn = document.getElementById("cartBtn");

// Check if item already in cart
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const alreadyInCart = cart.some(item => item.id === data.id);

if (alreadyInCart) {
  cartBtn.textContent = "VIEW CART";
  cartBtn.classList.add("view-cart");
} else {
  cartBtn.textContent = "ADD TO CART";
}

// When clicked
cartBtn.addEventListener("click", () => {
  if (cartBtn.textContent === "ADD TO CART") {
    cart.push({
      id: data.id,
      title: data.title,
      price: data.price,
      image: data.images[0],
      quantity: 1
    });
    localStorage.setItem("cart", JSON.stringify(cart));
    cartBtn.textContent = "VIEW CART";
    cartBtn.classList.add("view-cart");
  } else {
    window.location.href = "add_to_card.html"; // 👉 Redirect to cart page
  }
});


  } catch (error) {
    console.error("Error fetching product:", error);
  }

  // 🧾 Generate QR Code for this product page
const qrContainer = document.createElement("div");
qrContainer.classList.add("qr-section");
qrContainer.innerHTML = `
  <h3>Scan to View Product</h3>
  <canvas id="qrCode"></canvas>
`;
document.querySelector(".right-section").appendChild(qrContainer);

// Generate QR code using a library-free API
const qrCanvas = document.getElementById("qrCode");
const qrCtx = qrCanvas.getContext("2d");
const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(window.location.href)}`;
const qrImg = new Image();
qrImg.crossOrigin = "anonymous";
qrImg.onload = () => qrCtx.drawImage(qrImg, 0, 0, 150, 150);
qrImg.src = qrUrl;

}