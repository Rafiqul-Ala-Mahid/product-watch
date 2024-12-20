// Select all color boxes and the dynamic image
const colorBoxes = document.querySelectorAll(".color-box");
const dynamicImage = document.getElementById("dynamic-image");

// Add event listener to each color box
colorBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    const newImage = box.getAttribute("data-image");
    dynamicImage.src = newImage;

    // Add a ring effect to indicate selection
    colorBoxes.forEach((b) => b.classList.remove("ring-blue-500"));
    box.classList.add("ring-blue-500");
  });
});

// Selectors for size selection and cart functionality
const sizeBoxes = document.querySelectorAll(".size-box");
const selectedSizeText = document.getElementById("selected-size");
const cartSection = document.getElementById("cart-section");
const quantityInput = document.getElementById("quantity");
const totalPriceText = document.getElementById("total-price");
const decreaseBtn = document.getElementById("decrease-btn");
const increaseBtn = document.getElementById("increase-btn");
const addToCartButton = document.querySelector(".add-to-cart");

// Cart data
let cart = [];

// Size-to-image mapping
const sizeToImageMap = {
  S: "./images/watch1.jpeg",
  M: "./images/watch2.jpeg",
  L: "./images/watch3.jpeg",
  XL: "./images/watch4.jpeg",
};

// Prices for sizes
const sizePrices = { S: 69, M: 79, L: 89, XL: 99 };

// Color hex to name mapping
const colorHexToName = {
  "#816BFF": "Purple",
  "#1FCEC9": "Cyan",
  "#4B97D3": "Blue",
  "#3B4747": "Black",
};

// Dynamic variables for selected options
let selectedPrice = 0;
let selectedSize = "S";
let selectedColor = "#816BFF"; // Default color

// Handle Size Selection
function handleSizeSelection(box) {
  sizeBoxes.forEach((b) => b.classList.remove("border-black")); // Deselect others
  box.classList.add("border-black"); // Highlight selected box

  selectedSize = box.getAttribute("data-size");
  selectedPrice = sizePrices[selectedSize];
  selectedSizeText.textContent = `Selected: ${selectedSize} - $${selectedPrice}`;
  cartSection.classList.remove("hidden"); // Show cart section
  updateTotalPrice();
}

// Update Total Price
function updateTotalPrice() {
  const quantity = parseInt(quantityInput.value) || 1; // Default to 1
  const totalPrice = selectedPrice * quantity;
  totalPriceText.textContent = `Total: $${totalPrice}`;
}

// Increase Quantity
function increaseQuantity() {
  quantityInput.value = parseInt(quantityInput.value) + 1;
  updateTotalPrice();
}

// Decrease Quantity
function decreaseQuantity() {
  const quantity = parseInt(quantityInput.value);
  if (quantity > 1) {
    quantityInput.value = quantity - 1;
    updateTotalPrice();
  }
}

// Function to update the cart item count
function updateCartItemCount() {
  const cartItemCount = document.getElementById("cart-item-count");
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  cartItemCount.textContent = totalItemCount;
}

function addToCart() {
  const quantity = parseInt(quantityInput.value) || 1;
  const selectedColorElement = document.querySelector(".ring-blue-500");
  selectedColor = selectedColorElement
    ? selectedColorElement.dataset.color
    : "#816BFF";

  const colorName = colorHexToName[selectedColor];

  // Check if the item already exists in the cart
  const existingItem = cart.find(
    (item) => item.size === selectedSize && item.color === colorName
  );

  if (existingItem) {
    // Update quantity if item exists
    existingItem.quantity += quantity;
  } else {
    // Add new item to cart
    const item = {
      name: "Classy Modern Smart watch", // Update with dynamic item name if needed
      color: colorName,
      size: selectedSize,
      quantity: quantity,
      price: selectedPrice,
      thumbnail: sizeToImageMap[selectedSize],
    };
    cart.push(item);
  }

  // Update the cart item count
  updateCartItemCount();

  // Ensure the checkout button is visible
  const checkoutButton = document.getElementById("checkout-btn");
  checkoutButton.classList.remove("hidden");

  // Update the count inside the Checkout button
  const totalItemCount = cart.reduce((total, item) => total + item.quantity, 0);
  checkoutButton.innerHTML = `Checkout <span class="ml-2 text-[#6576FF]">${totalItemCount}</span>`;

  alert(`Added ${quantity} ${selectedSize} size item(s) to the cart.`);
}

// Open Checkout Modal
function openCheckoutModal() {
  const modalItems = document.getElementById("modal-items");
  modalItems.innerHTML = ""; // Clear previous modal content

  let totalPrice = 0;

  // Create table structure for the modal
  modalItems.innerHTML = `
    <table class="w-[563px] mx-auto text-left text-[14px] text-[#8091A7] border-collapse">
      <thead>
        <tr>
          <th class="border-b pb-2">Name</th>
          <th class="border-b pb-2"></th>
          <th class="border-b pb-2">Color</th>
          <th class="border-b pb-2">Size</th>
          <th class="border-b pb-2">Qnt</th>
          <th class="border-b pb-2">Price</th>
        </tr>
      </thead>
      <tbody id="cart-table-body"></tbody>
    </table>
  `;

  const cartTableBody = document.getElementById("cart-table-body");

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;

    cartTableBody.innerHTML += `
      <tr class="h-[52px] border-b-2 border-gray-300 shadow-md">
        <td><img src="${item.thumbnail}" alt="${item.name}" class="w-[36px] h-[36px] rounded"></td>
        <td class="text-[14px] text-[#364A63]">${item.name}</td>
        <td class="text-[14px] text-[#364A63]">${item.color}</td>
        <td class="text-[14px] text-[#364A63] font-bold">${item.size}</td>
        <td class="text-[14px] text-[#364A63] font-bold">${item.quantity}</td>
        <td class="text-[14px] text-[#364A63] font-bold">$${itemTotal}</td>
      </tr>
    `;
  });

  // Update the total price
  document.getElementById(
    "total-price"
  ).innerText = `Total Price: $${totalPrice}`;

  // Show the modal
  document.getElementById("checkout-modal").classList.remove("hidden");
}

// Close Checkout Modal
function closeCheckoutModal() {
  document.getElementById("checkout-modal").classList.add("hidden");
}

// Event Listeners
sizeBoxes.forEach((box) =>
  box.addEventListener("click", () => handleSizeSelection(box))
);
quantityInput.addEventListener("input", updateTotalPrice);
increaseBtn.addEventListener("click", increaseQuantity);
decreaseBtn.addEventListener("click", decreaseQuantity);
addToCartButton.addEventListener("click", addToCart);
