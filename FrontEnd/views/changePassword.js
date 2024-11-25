const ChangePasswordPage = (token) => {
    document.title = "Change Password!";
    const validateForm = async(event)=>{
        event.preventDefault();
        console.log("login button just clicked !");
        const password = document.querySelector('input[name="password"]').value;
        const password2 = document.querySelector('input[name="password2"]').value;
        let showErrorForm = document.querySelector("#error-show");
        if(!password){
            showErrorForm.textContent = "Required Password !";
        }else if (!password2){
            showErrorForm.textContent = "Required Password2 !";
        }else if(password!==password2){
            showErrorForm.textContent = "Enter Same Passwords !";
        }
        else{
            showErrorForm.textContent = 'Form Submit';
            const data = {
                password:password,
            }
            const csrfToken = getCsrfToken();
            try{
                const response = await fetch(`http://127.0.0.1:8000/account/change-password/${token}/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken ,
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const result = await response.json();
                    document.getElementById("success-show-form").textContent = result.message;
                    navigateTo('/login',"password changed Successfully !");
                } else {
                    document.getElementById("success-show-form").textContent = '';
                    const errorData = await response.json();
                    showErrorForm.textContent=errorData.message;
                    console.log("error data is ==== ",errorData);
                    console.log("Server error:",errorData);
                }

            }catch(error){
                showErrorForm.textContent = "Error: Unable to connect to the server.";
                console.error("Fetch error:", error);
            }
        }

    } 
    setTimeout(()=>{
        const form = document.querySelector("#change-form");
        form.addEventListener("submit",validateForm);
    },0)
    let html= `
    <div class="container">
        <div class="row">
            <form method="POST" id="change-form" class="col-md-6 col-lg-4 py-4 border rounded border-dark mx-auto my-auto mt-5 mb-2">
                <h4 class="text-center mt-3">Change Password</h4> 
                <p class="text-danger text-center mb-2" id="error-show-form"></p>
                <p class="text-success text-center mb-2" id="success-show-form"></p>
                <input type="password" placeholder="Password" class="form-control mb-2" name="password" id="password"> 
                <input type="password" placeholder="Password" class="form-control mb-2" name="password2" id="password2"> 
                <p class="text-danger" id="error-show"></p>
                <input type="submit" value="Change Password" class="form-control btn btn-dark mb-2"> 
                <p class="text-center"> <a href="/login" data-link>Login </a> <br> I don't have an <a href="/signup" data-link>account?</a></p>  
            </form> 
        </div>
    </div>
    `;
    return html;
};

export default ChangePasswordPage;
