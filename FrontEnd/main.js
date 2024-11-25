// Get references to DOM elements
const cartContainer = document.querySelector('.cart');
let cart = [];

// Function to add items to the cart
function addToCart(product) {
  const productId = product.dataset.id;
  const productName = product.dataset.name;
  const productPrice = product.dataset.price;

  // Check if the product already exists in the cart
  const existingProduct = cart.find(item => item.id === productId);

  if (existingProduct) {
    existingProduct.quantity += 1; // Increase quantity if the product is already in the cart
  } else {
    cart.push({ id: productId, name: productName, price: productPrice, quantity: 1 });
  }

  // Update the cart display
  displayCart();
}

// Function to display the cart
function displayCart() {
  cartContainer.innerHTML = ''; // Clear the cart container

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  const cartList = document.createElement('ul');

  cart.forEach(item => {
    const cartItem = document.createElement('li');
    cartItem.textContent = `${item.name} - $${item.price} (Quantity: ${item.quantity})`;
    cartList.appendChild(cartItem);
  });

  cartContainer.appendChild(cartList);
}

// Add event listeners to "Add to Cart" buttons
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const product = button.closest('.product');
    addToCart(product);
  });
});
