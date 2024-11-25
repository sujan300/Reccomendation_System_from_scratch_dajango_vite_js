import generateProductCards from "./products";
import { getAllCategory, getAllProducts } from "../api/products/productsApi";

let currentPage = 1; // Track the current page

const renderPagination = (nextPage) => {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    // Previous button
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "Previous";
        prevButton.classList.add("btn",'btn-sm', "btn-dark", "me-2");
        prevButton.addEventListener("click", () => {
            currentPage -= 1;
            loadProducts();
        });
        paginationContainer.appendChild(prevButton);
    }

    // Next button
    if(nextPage){
        const nextButton = document.createElement("button");
        nextButton.textContent = "Next";
        nextButton.classList.add("btn",'btn-sm', "btn-dark");
        nextButton.addEventListener("click", () => {
            currentPage += 1;
            loadProducts();
        });
        paginationContainer.appendChild(nextButton);
    }
};

const loadProducts = async (category = null) => {
    const products = await getAllProducts(currentPage, category);
    console.log("Products on page", currentPage, ":", products);
    const productsContainer = document.querySelector(".row");
    productsContainer.innerHTML = generateProductCards(products.results);
    renderPagination(products.metadata.next);
};

const setupCategoryFilter = () => {
    const categoryDropdown = document.getElementById("inputGroupSelect01");
    categoryDropdown.addEventListener("change", (event) => {
        const selectedCategory = event.target.value;
        currentPage = 1; // Reset to the first page for a new category
        loadProducts(selectedCategory === "All Category" ? null : selectedCategory);
    });
};

const loadAllCategory = (items)=>{
    return items.map(item =>{
        return `
            <option value="${item.category_name}">${item.category_name}</option>
        `
    })
}

const HomePage = async () => {
    document.title = "Home Page";
    const allcategory = await getAllCategory();
    let content = `
    <section class="hero-section py-3">
        <div class="container text-center">
            <h4 class="display-4 fw-bold">Welcome to Our E-Shop</h4>
            <p class="lead">Discover the best services and explore more features.</p>
        </div>
    </section>

    <section class="mt-3">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center p-3">
                <h4 class="mb-0">All Products</h4>
                <div class="ms-auto">
                    <select class="form-select w-auto" id="inputGroupSelect01">
                        <option selected>All Category</option>
                        ${loadAllCategory(allcategory)}
                    </select>
                </div>
            </div>
            <div class="row"></div>
        </div> 
    </section>

    <div class="container d-flex justify-content-center m-3" id="pagination"></div>
    `;
    setTimeout(() => {
        loadProducts(); // Load all products by default
        setupCategoryFilter(); // Attach category filter
    }, 0);
    return content;
};
// Load products after rendering the page
export default HomePage;
