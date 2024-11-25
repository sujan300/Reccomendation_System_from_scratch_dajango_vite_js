
import generateProductCards from "./products";
import { getAllProducts } from "../api/products/productsApi";
import { productReview } from "../api/products/productsApi"
import {getRecommededProducts} from "../api/products/productsApi"


let saveReview = (review,id)=>{
    console.log("on save review function",review);
    localStorage.setItem('review', JSON.stringify(review));
    renderProductDetailPage(id);
    document.getElementById("review-count").innerText = review.length;
}

let getReview = () =>{
    const storedCart = localStorage.getItem('review');
    if(storedCart){
        return JSON.parse(storedCart);
    }else{
        return [];
    }
}

let deleteAllReview = (id)=>{
    console.log("delete All review !!!!!!!!!!!!!!!");
    localStorage.removeItem('review');
    renderProductDetailPage(id)
}


window.deleteAllReview = deleteAllReview;




const showReviewPost =(review)=>{
    console.log("show Review Post !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",review);
    return review.map(post=>{
        return`<div class="mx-3 complete-review">
            <span class="name-rating d-flex flex-column">
                <span>${post.get_user_name} <span>${post.updated_at}</span></span>
                <span class="text-success d-flex justify-content-between">
                    <span>Verified purchased</span>
                    <span class="text-danger">Delete</span>
                </span> 
                <span class="">${showStar(parseFloat(post.rating))}</span>
            </span>
            <p class="rating-comment">${post.review}</p>
        </div>`
    })
}


const showKeyspecification = (specification)=>{
    return specification.map(spec=>{
        return `
            <tr>
                <th>${spec.key}</th>
                <td>${spec.value}</td>
            </tr>
        `
    }).join('');
}

// .toFixed(2)

async function renderProductDetailPage(id) {
    const cartContainer = document.getElementById('app');
    cartContainer.innerHTML =await productDetail(id);
}

const productDetails =async(id)=>{
    const response = await fetch(`http://127.0.0.1:8000/store/product-detail/${id}`);
    const data = await response.json();
    return data;
}

// Define the productDetail function
const productDetail = async(id) => {
    console.log("product id ", id);
    let product=await productDetails(id);
    let baseUrl = "http://127.0.0.1:8000/"
    document.title = `${product.product_name}`;
    console.log(product.product_name,"product name ",product);

    const validateForm = async(event,id)=>{
        event.preventDefault();
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        const reviewText = document.getElementById("review-text-box").value.trim();
        if (selectedRating) {
            const ratingValue = selectedRating.value;
            const data = {
                rating:ratingValue,
                review:reviewText,
            }
            if (isLoggedIn()) {
                console.log("user is login !");
                const csrfToken =  getCsrfToken();
                try{
                    const response = await fetch(`${baseUrl}store/product-rating/${id}/`,{
                        method:"POST",
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            'X-CSRFToken': csrfToken ,
                        },
                        body: JSON.stringify(data)
                    })
                    if(response.ok){
                        const result =await response.json();
                        await renderProductDetailPage(id);
                        document.getElementById('review-post').innerText = result.message;
                        console.log("result is ",result);
                    }else{
                        const result =await response.json();
                        document.getElementById('review-post').innerText = result.message;
                        console.log("result is ",result);
                    }
                }catch{
                    console.log("Error");
                }
                
            }
            else{
                console.log("user is not login !");
                alert(`Please Login First !`);
                navigateTo('/login')
            }

        } else {
            document.getElementById('select-rating-please').innerText = "Please Give Rating First !";
        }

    }

    let stockBtnOrOutofStock=''

    if(product.stock==0){
        stockBtnOrOutofStock =`
            <p class="text-danger" id="out-of-stuck-text">Out Of Stock</p>
        `
    }else if(product.stock>0){
        stockBtnOrOutofStock =`
            <button class="btn btn-sm btn-dark" onClick="addToCart(${product.id})">Add to Cart</button>
        `
    }

    // Generate the HTML string
    let html= `
        <div class="container d-flex justify-content-between mt-3 py-5">
            <div class="container">
                <div class="row">
                    <div class="col-md-1">
                        <div class="border border-dark mb-3 py-1">
                            <img src="${baseUrl}${product.images[0].image}" class="img-fluid thumbnail" alt="Responsive image" onclick="setImageUrl('${baseUrl}${product.images[0].image}')" style="cursor: pointer;">
                        </div>
                        <div class="border border-dark mb-3 py-1">
                            <img src="${baseUrl}${product.images[1]?.image}" class="img-fluid thumbnail" alt="Responsive image" onclick="setImageUrl('${baseUrl}${product.images[1].image}')" style="cursor: pointer;">
                        </div>
                        <div class="border border-dark mb-3 py-1">
                            <img src="${baseUrl}${product.images[2]?.image}" class="img-fluid thumbnail" alt="Responsive image" onclick="setImageUrl('${baseUrl}${product.images[2].image}')" style="cursor: pointer;">
                        </div>
                    </div>
                    <div class="col-md-6 border text-center">
                        <img src="${baseUrl}${product.images[0]?.image}" id="product-main-img" class="img-fluid" alt="Responsive image">
                    </div>
                    <div class="p-3 bg-light col-md-5">
                        <div className="product-detail p-2">
                            <p class="product-price">Price: Rs ${product.price}</p>
                            <p class="product-name">${product.product_name}</p>
                            <P class="muted">Description </p>
                            <p class="product-features">Features: ${product.description}</p>
                            <p>In Stock : ${product.stock} </p>
                        </div>
                        <div class="d-flex justify-content-end">
                            ${stockBtnOrOutofStock}
                        </div>
                    </div>
                </div>
            </div>
            </div>

            <div class="container">
            <h4>Specifications</h4>
                <table class="table">
                <thead>
                    <tr>
                    <th scope="col">Key</th>
                    <th scope="col">Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${showKeyspecification(product.specifications)}
                </tbody>
                </table>
            </div>

 <div className="container">
<form class="row mx-3" id="review-form">
        <div class="">
            <h5> Give ${product.product_name} Rating </h5>
            <div className="rating">
                <div class="rate">
                        <input type="radio" name="rating" id="rating10" value="5"><label for="rating10" title="5"></label>
                        <input type="radio" name="rating" id="rating9" value="4.5"><label for="rating9" title="4.5" class="half"></label>
                        <input type="radio" name="rating" id="rating8" value="4"><label for="rating8" title="4"></label>
                        <input type="radio" name="rating" id="rating7" value="3.5"><label for="rating7" title="3.5" class="half"></label>
                        <input type="radio" name="rating" id="rating6" value="3"><label for="rating6" title="3"></label>
                        <input type="radio" name="rating" id="rating5" value="2.5"><label for="rating5" title="2.5" class="half"></label>
                        <input type="radio" name="rating" id="rating4" value="2"><label for="rating4" title="2"></label>
                        <input type="radio" name="rating" id="rating3" value="1.5"><label for="rating3" title="1.5" class="half"></label>
                        <input type="radio" name="rating" id="rating2" value="1"><label for="rating2" title="1"></label>
                        <input type="radio" name="rating" id="rating1" value="0.5"><label for="rating1" title="0.5" class="half"></label>
                </div>
                </div>
                <span class="text-danger" id="select-rating-please"></span><br>
                <span class="text-success" id="review-post"></span>
        </div>
        <h5>Reviews</h5>
        <div class="mb-3 col-md-8">
            <textarea class="form-control mb-3" placeholder="Leave a comment here" id="review-text-box" required></textarea>
            <div class="d-flex justify-content-end">
                <input type="submit" class="btn-sm btn btn-dark" value="Submit" id="review-post"/>
            </div>
        </div>                     
</form>
<div class="bg-light py-5 col-md-8">
    <div class="d-flex justify-content-center">
        <h5 class="text-primary review-count" style="font-style=italic;">Total Reviews(<span id="review-count">${product.countReview}</span>)</h5>
    </div>
    ${showReviewPost(await productReview(id))}
    <hr>
    <div class="d-flex justify-content-center">
        <span class="btn btn-sm btn-dark">Load More</span>
    </div>
</div>
</div>


            <section class="mt-3">
                <div class ="container">
                    <h5>You may like it </h5>
                    <div class="row">
                        ${generateProductCards(await getRecommededProducts(product.id))}
                    </div>        
                </div> 
            </section>
    `;

    setTimeout(() => {
        const form = document.getElementById('review-form');
        form.addEventListener('submit', (event) => validateForm(event, product.id));
    }, 0); 
    return html;
};


export default productDetail;




{/* <div className="container">
<form class="row mx-3" id="review-form">
        <div class="">
            <h5> Give ${product.product_name} Rating </h5>
            <div className="rating">
                <div class="rate">
                        <input type="radio" name="rating" id="rating10" value="5"><label for="rating10" title="5"></label>
                        <input type="radio" name="rating" id="rating9" value="4.5"><label for="rating9" title="4.5" class="half"></label>
                        <input type="radio" name="rating" id="rating8" value="4"><label for="rating8" title="4"></label>
                        <input type="radio" name="rating" id="rating7" value="3.5"><label for="rating7" title="3.5" class="half"></label>
                        <input type="radio" name="rating" id="rating6" value="3"><label for="rating6" title="3"></label>
                        <input type="radio" name="rating" id="rating5" value="2.5"><label for="rating5" title="2.5" class="half"></label>
                        <input type="radio" name="rating" id="rating4" value="2"><label for="rating4" title="2"></label>
                        <input type="radio" name="rating" id="rating3" value="1.5"><label for="rating3" title="1.5" class="half"></label>
                        <input type="radio" name="rating" id="rating2" value="1"><label for="rating2" title="1"></label>
                        <input type="radio" name="rating" id="rating1" value="0.5"><label for="rating1" title="0.5" class="half"></label>
                </div>
                </div>
                <span class="text-danger" id="select-rating-please"></span><br>
                <span class="text-success" id="review-post"></span>
        </div>
        <h5>Reviews</h5>
        <div class="mb-3 col-md-8">
            <textarea class="form-control mb-3" placeholder="Leave a comment here" id="review-text-box" required></textarea>
            <div class="d-flex justify-content-end">
                <input type="submit" class="btn-sm btn btn-dark" value="Submit" id="review-post"/>
            </div>
        </div>                     
</form>
<div class="bg-light py-5 col-md-8">
    <div class="d-flex justify-content-center">
        <h5 class="text-primary review-count" style="font-style=italic;">Total Reviews(<span id="review-count">${product.countReview}</span>)</h5>
    </div>
    ${showReviewPost(await productReview(id))}
    <hr>
    <div class="d-flex justify-content-center">
        <span class="btn btn-sm btn-dark">Load More</span>
    </div>
</div>
</div> */}