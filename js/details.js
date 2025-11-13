const params = new URLSearchParams(window.location.search);
const id = params.get("id");
displayProduct(id);

async function displayProduct(id) {
  try {
    // ✅ 1. Fetch URL must be inside quotes
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const data = await res.json();

    // ✅ 2. Calculate stars for rating
    const fullStars = Math.floor(data.rating);
    const halfStar = data.rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;

    let stars = "";
    for (let i = 0; i < fullStars; i++) stars += '<span class="star full">★</span>';
    if (halfStar) stars += '<span class="star half">★</span>';
    for (let i = 0; i < emptyStars; i++) stars += '<span class="star empty">☆</span>';

    // ✅ 3. Template literal needs backticks for thumbnails
    const thumbs = data.images
      .map(
        (img, i) =>
          `<img src="${img}" class="thumb ${i === 0 ? "active" : ""}" alt="thumbnail">`
      )
      .join("");

    // ✅ 4. Add sample reviews
    const reviews = [
      { reviewerName: "Anjana", rating: 5, comment: "Excellent quality and fast delivery!", date: "2025-11-01" },
      { reviewerName: "Rahul", rating: 4, comment: "Good product, but packaging could be better.", date: "2025-11-03" },
      { reviewerName: "Sneha", rating: 3, comment: "Average experience, expected more.", date: "2025-11-08" }
    ];

    const reviewsHTML = reviews
      .map(
        (r) => `
      <div class="review">
        <div class="review-header">
          <div class="stars">${"★".repeat(r.rating)}</div>
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
    `
      )
      .join("");

    // ✅ 5. Page title must be in backticks
    document.title = `${data.title} | My Store`;

    // ✅ 6. Build product page content
    const priceINR = (data.price * 83).toLocaleString();
    document.getElementById("product").innerHTML = `
      <div class="product-page">

        <!-- LEFT SIDE -->
        <div class="left-section">
          <div class="thumbs">${thumbs}</div>
          <div class="main-image">
            <img id="mainImg" src="${data.images[0]}" alt="${data.title}">
            <div class="buttons">
              <button class="cart-btn">ADD TO CART</button>
              <button class="buy-btn">BUY NOW</button>
            </div>
          </div>
        </div>

        <!-- RIGHT SIDE -->
        <div class="right-section">
          <h1 class="title">${data.title}</h1>
          <p class="brand">Brand: ${data.brand}</p>
          <div class="rating">${stars} <span>(${data.rating})</span></div>
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
              <li>Warranty: ${data.warrantyInformation || "1 year warranty"}</li>
              <li>Return: ${data.returnPolicy || "7-day return policy"}</li>
            </ul>
          </div>

          <div class="desc">
            <h3>Description</h3>
            <p>${data.description}</p>
          </div>

          <div class="specs">
            <h3>Specifications</h3>
            <table>
              <tr><th>Brand</th><td>${data.brand}</td></tr>
              <tr><th>Category</th><td>${data.category}</td></tr>
              <tr><th>Stock</th><td>${data.stock}</td></tr>
              <tr><th>Price</th><td>₹${priceINR}</td></tr>
              <tr><th>Discount</th><td>${data.discountPercentage}%</td></tr>
              <tr><th>Rating</th><td>${data.rating}</td></tr>
            </table>
          </div>

          <div class="reviews">
            <h3>Customer Reviews</h3>
            ${reviewsHTML}
          </div>
        </div>
      </div>
    `;

    // ✅ 7. Thumbnail hover effect
    document.querySelectorAll(".thumb").forEach((thumb) => {
      thumb.addEventListener("mousemove", () => {
        document.getElementById("mainImg").src = thumb.src;
        document.querySelectorAll(".thumb").forEach((t) => t.classList.remove("active"));
        thumb.classList.add("active");
      });
    });
  } catch (error) {
    console.error("Error fetching product:", error);
  }
}
