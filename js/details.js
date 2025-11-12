// async function fetchProductDetails() {
  
//   const params = new URLSearchParams(window.location.search);
//   const id = params.get("id");

//   try {
    
//     const res = await fetch(`https://dummyjson.com/products/${id}`);
//     const product = await res.json();

    
//     displayProduct(product);
//   } catch (err) {
//     console.log("Error:", err);
//   }
// }

// function displayProduct(p) {
//   document.getElementById("details").innerHTML = `
//     <div class="card-details">
//       <img src="${p.thumbnail}" alt="${p.title}">
//       <div class="info">
//         <h1>${p.title}</h1>
//         <p>${p.description}</p>
//         <h2>Price: $${p.price}</h2>
//         <h3>Brand: ${p.brand}</h3>
//         <h4>Category: ${p.category}</h4>
//       </div>
//     </div>
//   `;
// }

// fetchProductDetails();



async function fetchProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    const product = await res.json();
    displayProduct(product);
  } catch (err) {
    console.error("Error fetching product details:", err);
  }
}

function displayProduct(p) {
  const discountedPrice = (p.price * (1 - p.discountPercentage / 100)).toFixed(2);

  const thumbnails = p.images
    .map(
      (img, i) =>
        `<img src="${img}" class="${i === 0 ? "active" : ""}" onmouseover="showImage('${img}', this)">`
    )
    .join("");

  // ✅ Specifications (sample + some derived data)
  const specifications = `
    <ul>
      <li><b>Category:</b> ${p.category}</li>
      <li><b>Brand:</b> ${p.brand}</li>
      <li><b>Stock:</b> ${p.stock}</li>
      <li><b>Warranty:</b> 1 Year Manufacturer Warranty</li>
      <li><b>Return Policy:</b> 7 Days</li>
      <li><b>Dimensions:</b> ${Math.floor(Math.random() * 100)} x ${Math.floor(
        Math.random() * 100
      )} x ${Math.floor(Math.random() * 100)} cm</li>
      <li><b>Weight:</b> ${(Math.random() * 15 + 5).toFixed(1)} kg</li>
    </ul>
  `;

  // ✅ Reviews from API
 // Generate reviews in the new style
const reviewsHTML = (p.reviews && p.reviews.length > 0)
  ? p.reviews
      .map(r => {
        const fullStars = "⭐".repeat(Math.floor(r.rating));
        const halfStar = r.rating % 1 >= 0.5 ? "☆" : "";
        const stars = fullStars + halfStar + "☆".repeat(5 - Math.ceil(r.rating));

        return `
          <div class="review">
            <div class="review-header">
              <div class="stars">${stars}</div>
            </div>

            <p class="review-comment">${r.comment || "No comment"}</p>

            <div class="review-footer">
              <span class="review-user">
                ${r.reviewerName || "Anonymous"} 
                <span class="verified">✔ Verified Buyer</span>
              </span>
              <span class="review-date">${new Date(r.date).toLocaleDateString()}</span>
            </div>

            <div class="review-actions">
              <button class="like-btn">👍 Helpful</button>
              <button class="dislike-btn">👎 Not Helpful</button>
            </div>
          </div>
        `;
      })
      .join("")
  : `<p class="no-review">No customer reviews yet.</p>`;


  // ✅ Full Layout
  document.getElementById("details").innerHTML = `
    <div class="card-details">
      <div class="left">
        <div class="thumbnails">${thumbnails}</div>
        <div class="main-image">
          <img id="mainImg" src="${p.thumbnail}" alt="${p.title}">
        </div>
      </div>

      <div class="right">
        <h1>${p.title}</h1>
        <div class="brand"><b>Brand:</b> ${p.brand}</div>

        <div class="rating-box">
          <span class="rating">⭐ ${p.rating.toFixed(1)}</span>
          <span class="review-count">(${p.reviews?.length || 0} Reviews)</span>
        </div>

        <div class="price-box">
          <span class="real-price">₹${(p.price * 100).toLocaleString()}</span>
          <span class="discounted">₹${(discountedPrice * 100).toLocaleString()}</span>
          <span class="discount">(${p.discountPercentage}% OFF)</span>
        </div>

        <div class="buttons">
          <button class="btn buy">BUY NOW</button>
          <button class="btn cart">ADD TO CART</button>
        </div>

        <div class="highlights">
          <h3>Highlights</h3>
          <ul>
            <li><b>Category:</b> ${p.category}</li>
            <li><b>Stock:</b> ${p.stock}</li>
            <li><b>Warranty:</b> 1 Year</li>
            <li><b>Return Policy:</b> 7 Days</li>
          </ul>
        </div>

        <div class="specifications">
          <h3>Specifications</h3>
          ${specifications}
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>${p.description}</p>
        </div>

        <div class="reviews">
          <h3>Customer Reviews</h3>
          ${reviewsHTML}
        </div>
      </div>
    </div>
  `;
}

// ✅ Image switch on hover
function showImage(src, el) {
  document.getElementById("mainImg").src = src;
  document.querySelectorAll(".thumbnails img").forEach(img => img.classList.remove("active"));
  el.classList.add("active");
}

fetchProductDetails();
