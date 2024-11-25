
import {getUserDashboard} from '../api/account/userDashboardapi';
import {getOrderHistoryApi} from '../api/account/userDashboardapi';


async function renderUserDashBoard() {
    const cartContainer = document.getElementById('app');
    cartContainer.innerHTML =await UserDashBoard();
}
window.renderUserDashBoard = renderUserDashBoard;

const showUserOrderHistory=(orderHistory)=>{
    return orderHistory.map(order=>{
        let colorOfStatus ='';
        if(order.status ==="New"){
            colorOfStatus="bg-primary"
            
        }else if(order.status ==="Accepted"){
            colorOfStatus = "bg-warning"
        }else if(order.status ==="Completed"){
            colorOfStatus="bg-success"

        }else if(order.status ==="Cancelled"){
            colorOfStatus="bg-danger"
        }
        return`
            <tr>
                <td>${order.order_id}</th>
                <td>${order.full_name}</td>
                <td><span class="py-1 px-2 ${colorOfStatus} rounded">${order.status}</span></td>
                <td>${order.phone}</td>
                <td>Rs:${order.total_paid}</td>
                <td>${order.updated}</td>
            </tr>
        `;
    }).join('');
}


const UserDashBoard = async() => {
    const userData= await getUserDashboard();
    const orderHistory = await getOrderHistoryApi();
    const email=userData.email;
    const name = userData.name;
    document.title ="User Dash board";
    const userDetail = document.getElementById('user-detail');
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    // search-order-item


    const ValidateSearchOrderItem = async (event) => {
        event.preventDefault(); // Prevent default form submission
    
        // Get the order_id from the input field
        const orderId = document.querySelector('input[name="searchOrderItem"]').value;
        console.log("Order item ID is ===>>>", orderId);
        console.log("token is ====>>> ",localStorage.getItem('token'));
    
        if (!orderId) {
            console.error("Order ID is required!");
            return;
        }
    
        try {
            // Make a GET request to the API with the order_id as a query parameter
            const response = await fetch(`http://127.0.0.1:8000/order/search-order-item?order_id=${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
    
            // Check if the response is OK

            // <p>Total Items: ${data.total_items}</p>
            // <ul>
            //     ${data.order_items.map(item => `
            //         <li>${item.product_name} (Quantity: ${item.quantity}, Price: $${item.price}) <img src="http://127.0.0.1:8000/${item.image_url}" alt="..." class="img-thumbnail"  style="width: 150px;"></li>
            //     `).join('')}
            // </ul>
            if (response.ok) {
                const data = await response.json();
                console.log("Order Items:", data);
                const resultContainer = document.getElementById('result-container-items');
                const orderId = document.getElementById('order-id').innerText="Order Id is: "+data.order_id;
                // Ensure you handle multiple order items
                const itemsHTML = data.order_items.map(item => `
                    <tr>
                        <td>${item.product_name}</td>
                        <td>${item.quantity}</td>
                        <td>Rs:${item.price}</td>
                        <td><img src="http://127.0.0.1:8000/${item.image_url}" alt="Product Image" class="img-thumbnail" style="width: 100px;"></td>
                    </tr>
                `).join('');  // Join all items' HTML into a single string
    
                // Insert the order items into the result container
                resultContainer.innerHTML = itemsHTML;
            } else {
                // Handle error responses
                const errorData = await response.json();
                console.error("Error:", errorData.error || "Something went wrong");
                alert(errorData.error || "Failed to fetch order items");
            }
        } catch (error) {
            console.error("Request failed:", error);
            alert("An error occurred. Please try again.");
        }
    };
    


    setTimeout(() => {
        const form = document.getElementById('order-id-form');
        form.addEventListener('submit', ValidateSearchOrderItem);
    }, 0);

    return`
        <div class="container py-5">
            <div class="row">
                <div class="col-md-3 py-3 bg-light">
                    <div class="user-detail p-3" id="user-detail">
                        <div class="user-info mb-3">
                            <span class="user-name">Name:${name}</span>
                        </div>
                        <div class="user-info mb-3">
                            <span class="user-email">Email:${email}</span>
                        </div>
                    </div>
                </div>
                <div class="col-md-8 py-3">
                <h5>Order History</h5>
                    <div style="max-height: 150px; overflow-y: auto;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">Order Id</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Total Amount</th>
                                    <th scope="col">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${showUserOrderHistory(orderHistory)}
                            </tbody>
                        </table>
                    </div>
                    <hr>
                    <form id="order-id-form">
                        <label>Enter Order Id:</label>
                        <div class="d-flex justify-content-between">
                            <input placeholder="Enter Order Id To See Order Item" class="form-control" type="text" name="searchOrderItem" />
                            <button class="btn btn-dark">Search</button>
                        </div>
                    </form>
                </div>
            </div>
            <div class="container">
                <div>
                <h5 id="order-id"></h5>
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">QTY</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Image</th>
                            </tr>
                        </thead>
                        <tbody id="result-container-items">
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}
    
export default UserDashBoard;