import { getCartItem } from "../api/products/getCartItem";

let cart =[];


const saveCart = (needSaveArrayCart)=>{
    localStorage.setItem('cart', JSON.stringify(needSaveArrayCart));
    cartCount();
}

const deleteAllCart = ()=>{
    localStorage.removeItem('cart');
    const cartCount = document.getElementById("cart-count").innerText =0;
    renderCartPage();
}


const cartCount = async()=>{
    let productArray = await getCartItem();
    let totalProduct = productArray.length ? productArray.reduce((total,product)=>product.quantity+total,0) :0;
    document.getElementById('cart-count').innerText=totalProduct;
}

async function addToCart(id,qty,value){
    console.log("qty in add to cart",qty);
    if(isLoggedIn()){
        if(!qty){
            console.log("called right !");
            await addToCartApi(id,1,value);
        }else{
            await addToCartApi(id,qty,value);   
        }
    }else{
        alert("please Login First !")
        navigateTo('/login')
    }
    console.log("call add to cart !");
    await cartCount();
}


async function removeItemFromCart(id){
    await removeCartItemApi(id)
    // removeCartItemFromUI(`cart-item${id}`)
    renderCartPage();
}


const getCart = () =>{
    const storedCart = localStorage.getItem('cart');
    if(storedCart){
        return JSON.parse(storedCart);
    }else{
        return [];
    }
}



document.addEventListener('DOMContentLoaded', function() {
    cartCount();
});


window.addToCart = addToCart;
window.cart = cart;
window.removeItemFromCart = removeItemFromCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.deleteAllCart = deleteAllCart;
window.cartCount = cartCount;