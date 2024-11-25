const LoginPage = (userMessage) => {
    document.title = "Login Page";
    if(!userMessage){
        userMessage='';
    }
    const validateForm = async(event)=>{
        event.preventDefault();
        console.log("login button just clicked !");
        const email = document.querySelector('input[name="email"]').value;
        const password = document.querySelector('input[name="password"]').value;
        let showErrorForm = document.querySelector("#error-show");
        if(!email || !password){
            showErrorForm.textContent = "Input Email and Password";
        }else{
            showErrorForm.textContent = 'Form Submit';
            const data = {
                email:email,
                password:password,
            }
            const csrfToken = getCsrfToken();
            try{
                const response = await fetch('http://127.0.0.1:8000/account/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken ,
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const result = await response.json();
                    document.getElementById("success-show-form").textContent = userMessage ? userMessage : result.message;
                    localStorage.setItem('accessToken', result.access);
                    localStorage.setItem('refreshToken', result.refresh);
                    updateLoginStatus();
                    const pathname = window.location.pathname;
                    console.log("result is ===== ",result);
                    navigateTo('/user-dashboard');
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
        const form = document.querySelector("#login-form");
        form.addEventListener("submit",validateForm);
    },0)
    let html= `
    <div class="container">
        <div class="row">
            <form method="POST" id="login-form" class="col-md-6 col-lg-4 py-4 border rounded border-dark mx-auto my-auto mt-5 mb-2">
                <h4 class="text-center mt-3">Login</h4> 
                <p class="text-danger text-center mb-2" id="error-show-form"></p>
                <p class="text-success text-center mb-2" id="success-show-form">${userMessage}</p>
                <input type="email" placeholder="Email" class="form-control mb-2" name="email"> 
                <input type="password" placeholder="Password" class="form-control mb-2" name="password" id="password"> 
                <p class="text-danger" id="error-show"></p>
                <input type="submit" value="Login" class="form-control btn btn-dark mb-2"> 
                <p class="text-center"> <a href="/forget-password" data-link>Forgot password?</a> <br> I don't have an <a href="/signup" data-link>account?</a></p>  
            </form> 
        </div>
    </div>
    `;
    return html;
};

export default LoginPage;
