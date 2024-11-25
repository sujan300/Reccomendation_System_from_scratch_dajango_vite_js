const increaseFunc = (stock, id,qty) => {
  let inputQty;
  const inputField = id ? document.getElementById(`qty-input${id}`) : document.getElementById("qty-input");
  if (!inputField) {
    return;
  }

  inputQty = parseInt(inputField.value);

  if (isNaN(inputQty)) {
    inputQty = 1;
  }

  if (inputQty < stock) {
    inputQty += 1;
    updateQty(id,inputQty,stock);
  }
  inputField.value = inputQty;
};


const decreaseFunc = (id,qty,stock)=>{
  const inputField = id ? document.getElementById(`qty-input${id}`) : document.getElementById("qty-input"); 
  if (!inputField) {
    return;
  }
  let inputQty = parseInt(inputField.value);
  if(isNaN(inputQty)){
    inputQty = 1;
  }
    if(1<inputQty){
      inputQty -=1;
      updateQty(id,inputQty,stock);
      console.log("input value === "+inputQty);
    }
  inputField.value = inputQty;
}

// product detail page function 




//  add to cart increament and decrement 
async function updateQty(id,qty,stock){
  const inputField = document.getElementById(`qty-input${id}`);
  const outOfStock = document.getElementById(`out-of-stock${id}`);
  console.log("qty is ====",qty);
  console.log("stock",stock);
  if(qty>=stock){
    inputField.value = stock;
    console.log("out of stock",outOfStock);
    outOfStock.textContent = `Sorry, we only have ${stock} in our store!`;
    outOfStock.style.visibility = "visible";
    addToCartApi(id,stock,true);
  }else if(qty==0){
    inputField.value = 1;
    addToCartApi(id,1,true);
  }else{
    inputField.value = qty;
    addToCartApi(id,qty,true);
  }
}
