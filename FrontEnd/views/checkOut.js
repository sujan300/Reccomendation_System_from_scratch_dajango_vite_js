import showTable from './showInTable';
import {getCartItem} from "../api/products/getCartItem"



// http://127.0.0.1:8000/account/login

const checkOutPage = async() => {

    document.title ="Check out page";
    const products = await getCartItem();
    const count =await countTotals(products);
    const totalProducts = count.totalProduct;
    const totalPrice =  count.totalPrice;

    const validateForm = async(event)=>{
        event.preventDefault();
        console.log("Check Out Form just click !");
        const fullName = document.querySelector('input[name="full-name"]').value;
        const phonenumber = document.querySelector('input[name="phone-number"]').value;
        const postCode = document.querySelector('input[name="post-code"]').value;
        const state = document.querySelector('input[name="state"]').value;
        const city = document.querySelector('input[name="city"]').value;
        const address = document.querySelector('input[name="address"]').value;
        const showErrorFormName = document.querySelector("#error-showfull-name");
        const showErrorFormPhone = document.querySelector("#error-showphone-number");
        const showErrorFormPostCode = document.querySelector("#error-showpost-code");
        const showErrorFormState = document.querySelector("#error-showstate");
        const showErrorFormCity = document.querySelector("#error-showcity");
        const showErrorFormAddress = document.querySelector("#error-showaddress");
        showErrorFormName.textContent ='';
        showErrorFormPhone.textContent ='';
        showErrorFormPostCode.textContent ='';
        showErrorFormState.textContent ='';
        showErrorFormCity.textContent ='';
        showErrorFormAddress.textContent ='';
        if(!fullName){
            showErrorFormName.textContent = "Enter Full Name !";
        }else if(!phonenumber){
            showErrorFormPhone.textContent = "Enter Phone Number !";
        }
        else if(!postCode){
            showErrorFormPostCode.textContent = "Enter Post Code !";
        }else if(!state){
            showErrorFormState.textContent = "Enter State !";
        }
        else if(!city){
            showErrorFormCity.textContent = "Enter City !";
        }
        else if(!address){
            showErrorFormAddress.textContent = "Enter address !";
        }        
        else{
            const data = {
                fullName:fullName,
                phonenumber:phonenumber,
                postCode:postCode,
                state:state,
                city:city,
                address:address,
            }
                const csrfToken = getCsrfToken();
                try {
                    const response = await fetch('http://127.0.0.1:8000/order/order-place', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                            'X-CSRFToken': csrfToken,
                        },
                        body: JSON.stringify(data)
                    });
                    if (response.ok) {
                        const result = await response.json();
                        navigateTo(`/user-dashboard`);
                        console.log("Order placed successfully:", result);
                    } else {
                        console.error("Error placing order:", await response.json());
                    }
                } catch (error) {
                    console.error("Fetch error:", error);
                }
        }

    } 
    setTimeout(()=>{
        const form = document.querySelector("#order-place-form");
        form.addEventListener("submit",validateForm);
    },0)
    return`
        <div class="container py-5 row">
        <form id="order-place-form">
            <div class="row">
                <div class="col-md-8 py-3">
                    <div class="row">
                        <div class="col-md-6 py-3">
                            <div class="mb-3">
                                <label for="fullname" class="form-label">Full Name:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showfull-name"></span>
                                </div>
                                <input type="text" placeholder="Full Name" class="form-control" name="full-name"> 
                            </div>
                            <div class="mb-3">
                                <label for="phonenumber" class="form-label">Phone Number:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showphone-number"></span>
                                </div>
                                <input type="text" placeholder="Phone Number" class="form-control" name="phone-number">
                            </div>
                            <div class="mb-3">
                                <label for="phonenumber" class="form-label">Post Code:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showpost-code"></span>
                                </div>
                                <input type="text" placeholder="Post Code" class="form-control" name="post-code">
                            </div>
                        </div>
                        <div class="col-md-6 py-3">
                            <div class="mb-3">
                                <label for="state" class="form-label">State:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showstate"></span>
                                </div>
                                <input type="text" placeholder="State" class="form-control mb-2" name="state">
                            </div>
                            <div class="mb-3">
                                <label for="city" class="form-label">City:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showcity"></span>
                                </div>
                                <input type="text" placeholder="City" class="form-control" name="city"> 
                            </div>
                            <div class="mb-3">
                                <label for="address" class="form-label">Address:</label>
                                <div class="mb-2 text-center">
                                    <span class="text-danger" id="error-showaddress"></span>
                                </div>
                                <input type="text" placeholder="Address(eg. Name of Local Area)" class="form-control mb-2" name="address">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 py-3 bg-light">
                    <div class="container">
                        <div class="col-md-12 py-3">
                            <div style="max-height: 300px; overflow-y: auto;" class="p-3"  class="">
                                <table class="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">Name</th>
                                        <th scope="col">Qty</th>
                                        <th scope="col">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${showTable(products)}
                                        <tr>
                                            <td>Total</td>
                                            <td>${totalProducts}</td>
                                            <td>${totalPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="text-end mt-3">
                        <button type="submit" class="btn btn-sm btn-dark">Place Order</button>
                    </div>
                </div>
            </div>
            </form>
        </div>
    `;
}    
export default checkOutPage;