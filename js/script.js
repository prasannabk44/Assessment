const cartToggle = document.getElementById("cartToggle");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const suggestedItemsContainer = document.getElementById("suggestedItems");
const cartTotal = document.getElementById("cartTotal");
const filledBar = document.getElementById("filledBar");
const shippingProgress = document.getElementById("shippingProgress");
const shippingText = document.getElementById("shippingText");

let cartData = [];
let suggestedItems = [];
const shippingGoal = 2000;

cartToggle.addEventListener("click", () =>
  cartDrawer.classList.add("open")
);
closeCart.addEventListener("click", () =>
  cartDrawer.classList.remove("open")
);

async function fetchCartData() {
  try {
    const response = await fetch(
      "https://mocki.io/v1/539c3a78-25e4-4fc6-8b35-6f1550d2b7c6"
    );
    const data = await response.json();
    cartData = data;
    suggestedItems = data.suggestions;
    renderCart();
    renderSuggestedItems();
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

function renderCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cartData.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    cartItem.innerHTML = `
<div class="main">
  <div class="imgclass">
    <img class="productimg" src="${item.images}" alt="${item.title}">
  </div>
  <p>${item.title}</p>
  <p>₹${item.price}</p>
</div>
<div class="cart-itemsquantity">
  <button class="remove-btn" data-id="${item.id}">
    <img src="images/bin.png" class="icons">
  </button>
  <input type="number" class="input" value="${item.quantity}" min="1" data-id="${item.id}">
</div>
`;
    cartItemsContainer.appendChild(cartItem);
    total += parseFloat(item.price) * parseInt(item.quantity);
    totalItems += parseInt(item.quantity);
  });

  cartTotal.textContent = total.toFixed(2);
  document.getElementById("headerCartTotal").textContent =
    total.toFixed(2); // Update header total
  document.getElementById("itemCount").textContent = totalItems; // Update header item count
  updateShippingBar(total);
}

function updateShippingBar(total) {
  const progress = Math.min((total / shippingGoal) * 100, 100);
  shippingProgress.style.width = `${progress}%`;
  filledBar.style.width = `${progress}%`;

  shippingText.textContent =
    progress >= 100
      ? "You've unlocked free shipping!"
      : `Spend ₹${(shippingGoal - total).toFixed(
          2
        )} more to unlock free shipping.`;
}

// Render Suggested Items
function renderSuggestedItems() {
  suggestedItemsContainer.innerHTML = "";
  suggestedItems.forEach((item, index) => {
    const suggestedItem = document.createElement("div");
    suggestedItem.className = "suggested-item";
    suggestedItem.innerHTML = `<img src="${item.images}" class="productimg" alt="${item.title}">
    <div>
      <p>${item.title}</p>
      <p>₹${item.price}</p>
    </div>
    <button class="add-btn" data-id="${item.id}"><img src="images/plus.png" class="icons"></button>
  `;
    suggestedItemsContainer.appendChild(suggestedItem);
  });
}

fetchCartData();