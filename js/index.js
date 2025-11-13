let data = [];
let allProducts = [];
let allCategories = [];
let selectedCategory = "";

// 🚀 Initialize everything
async function init() {
  try {
    // 1️⃣ Fetch all products
    const res = await fetch("https://dummyjson.com/products");
    const productData = await res.json();
    allProducts = productData.products;
    data = allProducts;

    // 2️⃣ Fetch all categories
    const catRes = await fetch("https://dummyjson.com/products/category-list");
    allCategories = await catRes.json();

    // 3️⃣ Display UI
    displayCategories();
    display(data);
  } catch (err) {
    console.log("Error:", err);
  }
}

// 🏷️ Display category buttons
function displayCategories() {
  const catContainer = document.getElementById("categories");
  let catHTML = `<button class="category-btn active" data-cat="">All</button>`;
  allCategories.forEach(cat => {
    catHTML += `<button class="category-btn" data-cat="${cat}">${cat}</button>`;
  });
  catContainer.innerHTML = catHTML;

  // 👉 Add click listeners
  document.querySelectorAll(".category-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".category-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCategory = btn.getAttribute("data-cat");
      filterProducts(); // 🔥 update displayed products
    });
  });
}

// 🔍 Combined Filter (Category + Search + Brand)
function filterProducts() {
  const searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();

  const filtered = allProducts.filter(p => {
    const matchesCategory = selectedCategory ? p.category === selectedCategory : true;

    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm) ||
      p.brand?.toLowerCase().includes(searchTerm) ||
      p.category.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  display(filtered);
}

// 🧾 Display product cards
function display(list) {
  const cards = document.getElementById("cards");

  if (list.length === 0) {
    cards.innerHTML = `<p class="no-results">No products found!</p>`;
    return;
  }

  let html = "";
  list.forEach(i => {
    html += `
      <div class="card">
        <a href="../pages/details.html?id=${i.id}">
          <img src="${i.thumbnail}" alt="${i.title}">
          <h1>${i.title}</h1>
          <h2>$${i.price}</h2>
        </a>
      </div>
    `;
  });

  cards.innerHTML = html;
}

// 🧠 Search events
document.getElementById("searchInput").addEventListener("input", filterProducts);
document.getElementById("searchBtn").addEventListener("click", filterProducts);

// 🚀 Initialize app
init();

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.length;
  document.getElementById("cartCount").textContent = count;
}
updateCartCount();