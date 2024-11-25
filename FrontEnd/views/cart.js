import {getCartItem} from "../api/products/getCartItem"
const showName = (text,maxLength=20)=>{
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}

window.showName = showName;


const showCart =(products)=>{
    const baseUrl = "http://127.0.0.1:8000/"
    return products.map(product => {
        return`
        <tr id="cart-item${product.product.id}">
            <th ><img src="${baseUrl}${product.product.first_image}" class="img-fluid cart-img border border-dark rounded p-3" /></th>
            <td><a href="/product-detail/${product.product.id}" class="text-decoration-none text-dark">
                    <span class="m-3" >${showName(product.product.product_name)}</span>
                </a>
            </td>
            <td><span class="m-3" id="cart-product-price${product.product.id}">Rs: ${product.product.price}</span></td>
            <td>${product.sub_total}</td>
            <td>
                <div class="qty-increse-decrease d-flex border border rounded position-relative" >
                    <span class="top-0 start-0 bg-danger position-absolute bg-danger text-white px-2 py-1 rounded overflow-auto" style="visibility: hidden;" id="out-of-stock${product.product.id}"></span>
                    <span class="btn btn-sm btn-dark" id="qty-minus" onclick="decreaseFunc(${product.product.id},1,${product.product.stock})">-</span>
                    <div>
                        <input 
                            type="number" 
                            value="${product.quantity}" 
                            min="1" 
                            max="${product.product.stock}" 
                            class="qty-input bg-light" 
                            id="qty-input${product.product.id}" 
                            oninput="updateQty(${product.product.id}, this.value,${product.product.stock})" 
                        />
                    </div>
                    <span class="btn btn-sm btn-dark qty-btn" id="qty-plus" onclick="increaseFunc(${product.product.stock},${product.product.id},1)">+</span>
                </div>
            </td>
            <td><span class="m-3 text-danger cross-cart"><i class="fa-solid fa-xmark" id="remove-item-cart${product.id}" onclick="removeItemFromCart(${product.product.id})"></i></span></td>
        </tr>
        `
    });
}




async function renderCartPage() {
    const cartContainer = document.getElementById('app');
    cartContainer.innerHTML =await CartPage();
}

window.renderCartPage =  renderCartPage;

const countTotals =(productArray)=>{
    let totalProduct = productArray.length ? productArray.reduce((total,product)=>product.quantity+total,0) :0;
    let totalPrice = productArray.length ? productArray.reduce((total,product)=>total+product.sub_total,0):0;
    document.getElementById('cart-count').innerText=totalProduct;
    return {
        totalPrice:totalPrice,
        totalProduct:totalProduct,
    }
}

window.countTotals=countTotals;


const CartPage = async() => {
    cartCount();
    document.title ="Cart Page";
    let getCartArray =await getCartItem();
    console.log("cart array is ",getCartArray);
    let count = countTotals(getCartArray);
    const totalProduct = count.totalProduct;
    const totalPrice = count.totalPrice;
    if(getCartArray.length>0){
        return `
            <div class="container  py-5">
                <div class="row justify-content-center">
                    <div class="col-md-8 border rounded mx-3" style="max-height: 450px; overflow-y: auto;" class="p-3">
                    <table class="table">
                    <thead>
                        <tr>
                        <th scope="col">Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Sub Total</th>
                        <th scope="col">Qty</th>
                        <th scope="col">Remove</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${showCart(getCartArray)}
                    </tbody>
                    </table>
                    </div>
                    <div class="col-md-3 payment-detail-bg">
                        <div class="d-flex flex-column justify-content-between border border-dark px-3 bg-light py-3 rounded text-dark">
                            <span class="p-2 cart-text d-flex justify-content-between">
                                <span>Total Products</span>
                                <span id="qty-cart">${totalProduct}</span>
                            </span>
                            <hr>
                            <span class="p-2 cart-text d-flex justify-content-between">
                                <span>Total Price</span>
                                <span id="total-price-cart">Rs:${totalPrice}</span>
                            </span>
                            <div class="check-out text-end">
                                <a href="/checkout" class="text-end" data-link>
                                    <span class="btn btn-dark btn-sm">CheckOut</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }else{
        return`
            <div class="py-3 container bg-light rounded text-center">
                <h4>NO Products in Cart !</h4>
            </div>
        `;
    }
};

export default CartPage;
