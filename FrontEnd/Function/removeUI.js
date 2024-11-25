function removeCartItemFromUI(id) {
    const cartItemElement = document.getElementById(id);
    if (cartItemElement) {
      cartItemElement.remove(); // Removes the item from the UI
    }
  }