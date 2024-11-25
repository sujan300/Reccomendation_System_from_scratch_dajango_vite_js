const generateProductCards = (products) => {
    const baseUrl= "http://127.0.0.1:8000/"
    return products.map(product => `
        <div class="col-md-3 mb-4">
            <div class="card p-1">
                <a data-link href="/product-detail/${product.id}" class="text-decoration-none text-dark">
                    <img src="${baseUrl}${product.images[0]?.image}" class="card-img-top card-img-fixed" alt="${product.product_name}">
                </a>
                <div class="card-body cursor-pointer">
                    <h5 class="card-title">${showName(product.product_name,40)}</h5>
                    <p class="card-text price">Rs ${product.price}</p>
                    <p class="muted" >Stock Qty:${product.stock}</p>

                    <span class="d-flex justify-content-center btn-sm btn btn-dark" onclick="addToCart(${product.id})">Add To Cart</span>
                </div>
            </div>
        </div>
    `).join(''); // Join the array into a single HTML string
};
export default generateProductCards;

{/* <div class="rating-star mb-2">
<span id="product-rating">
    ${showStar(product.averageReview)}(${product.countReview})
</span>
</div> */}