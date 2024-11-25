const SignupPage = () => {
    document.title = "SignUp Page";
    async function getCsrfToken() {
        const response = await fetch('http://127.0.0.1:8000/account/csrf-token-get');
        const data = await response.json();
        console.log("csrf token is ===== >>> ",data.csrfToken);
        return data.csrfToken;
    }

    // Validation function
    const validateForm = async(event) => {
        event.preventDefault(); // Prevent default form submission
        const fullName = document.querySelector('input[name="fullName"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const password1 = document.querySelector('input[name="password1"]').value;
        const password2 = document.querySelector('input[name="password2"]').value;
        let errorMessageOfForm = '';

        // Validation logic
        if (!fullName || !email || !password1 || !password2) {
            errorMessageOfForm = "Please input all information";
        } else if (password1 !== password2) {
            errorMessageOfForm = "Both passwords must be the same";
        }

        const showErrorForm = document.getElementById('error-show-form');
        if (errorMessageOfForm) {
            showErrorForm.textContent = errorMessageOfForm;
            document.getElementById("success-show-form").textContent = "";
        } else {
            showErrorForm.textContent = "";
            console.log("Form submitted successfully!");

            const data = {
                name:fullName,
                email:email,
                password:password2
            }
            const csrfToken = getCsrfToken();
            console.log(csrfToken ,"crsf token is =====>>>> ");

            try{
                const response = await fetch('http://127.0.0.1:8000/account/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken ,
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const result = await response.json();
                    const token = result.token;
                    const id = result.uid;
                    console.log("Server response:", result,"and token is ====>> ",token);
                    document.getElementById("success-show-form").textContent = result.message;
                    sessionStorage.setItem(`${token}`, `${id}`);
                    navigateTo(`/otp-validate/${token}`);
                } else {
                    document.getElementById("success-show-form").textContent = '';
                    const errorData = await response.json();
                    showErrorForm.textContent = errorData.message.email;
                    console.log("Server error:",errorData);
                }

            }catch(error){
                showErrorForm.textContent = "Error: Unable to connect to the server.";
                console.error("Fetch error:", error);
            }
        }
    };

    const html = `
    <div class="container">
        <div class="row">
            <form id="signup-form" method="POST" class="col-md-6 col-lg-4 py-4 border rounded border-dark mx-auto my-auto mt-5 mb-2">
                <h4 class="text-center mt-3">Create Account</h4>          
                <input type="text" placeholder="Full Name" class="form-control mb-2" name="fullName">  
                <input type="email" placeholder="Email" class="form-control mb-2" name="email"> 
                <input type="password" placeholder="Password" class="form-control mb-2" name="password1" id="password1">
                <input type="password" placeholder="(Again Password)" class="form-control mb-2" name="password2" id="password2">
                <p class="text-danger text-center mb-2" id="error-show-form"></p>
                <p class="text-success text-center mb-2" id="success-show-form"></p>  
                <input type="submit" value="Create Account" class="form-control btn btn-dark mb-2"> 
                <p class="text-center"> 
                    <a href="/forget-password">Forgot password?</a> <br> 
                    I have <a href="/login" data-link>account?</a>
                </p>
            </form> 
        </div>
    </div>
    `;


    setTimeout(() => {
        const form = document.getElementById('signup-form');
        form.addEventListener('submit', validateForm);
    }, 0); 
    return html; 
};

export default SignupPage;
