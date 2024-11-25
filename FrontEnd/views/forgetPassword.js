const ForgetPasswordPage = (userMessage) => {
    document.title = "Forget Password";
    if(!userMessage){
        userMessage='';
    }
    const validateForm = async(event)=>{
        event.preventDefault();
        console.log("login button just clicked !");
        const email = document.querySelector('input[name="email"]').value;
        let showErrorForm = document.querySelector("#error-show");
        if(!email){
            showErrorForm.textContent = "Input Email !";
        }else{
            showErrorForm.textContent = 'Form Submit';
            const data = {
                email:email,
            }
            const csrfToken = getCsrfToken();
            try{
                const response = await fetch('http://127.0.0.1:8000/account/forgetpassword', {
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
                    console.log("result is ===== ",result);
                    let token = result.token;

                    navigateTo(`/otp-validate/${token}`);
                } else {
                    document.getElementById("success-show-form").textContent = '';
                    const errorData = await response.json();
                    showErrorForm.textContent=errorData.message;
                    console.log("error data is ==== ",errorData);
                    console.log("Server error--------->>>:",errorData);
                }

            }catch(error){
                showErrorForm.textContent = "Error: Unable to connect to the server.";
                console.error("Fetch error:", error);
            }
        }

    } 
    setTimeout(()=>{
        const form = document.querySelector("#forget-password-form");
        form.addEventListener("submit",validateForm);
    },0)
    let html= `
    <div class="container">
        <div class="row">
            <form method="POST" id="forget-password-form" class="col-md-6 col-lg-4 py-4 border rounded border-dark mx-auto my-auto mt-5 mb-2">
                <h4 class="text-center mt-3">Input Email</h4> 
                <p class="text-danger text-center mb-2" id="error-show-form"></p>
                <p class="text-success text-center mb-2" id="success-show-form">${userMessage}</p>
                <input type="email" placeholder="Email" class="form-control mb-2" name="email"> 
                <p class="text-danger" id="error-show"></p>
                <input type="submit" value="Send OTP" class="form-control btn btn-dark mb-2">   
            </form> 
        </div>
    </div>
    `;
    return html;
};

export default ForgetPasswordPage;
