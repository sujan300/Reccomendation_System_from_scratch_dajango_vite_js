const ValidateOtp = (token) => {
    document.title = "Email Verification";
    console.log("token is === ",token);
    console.log("Called ---------------------------------------------->>>>");
    const validateForm = async(event) => {
        event.preventDefault();
        const otp = document.querySelector('input[name="otp"]').value;
        let errorMessageOfForm = '';
        console.log("otp is ==== ",otp);
        if (!otp) {
            errorMessageOfForm = "Please input OTP";
        }

        const showErrorForm = document.getElementById('error-show-form');
        if (errorMessageOfForm) {
            showErrorForm.textContent = errorMessageOfForm;
            document.getElementById("success-show-form").textContent = "";
        } else {
            showErrorForm.textContent = "";
            console.log("Form submitted successfully!");
            const csrfToken = getCsrfToken();
            const uid = sessionStorage.getItem(token);
            const data = {
                otp:otp,
            }
            const baseUrl = uid ? `http://127.0.0.1:8000/account/validate-email/${token}/${uid}/` : `http://127.0.0.1:8000/account/change-validate/${token}/`
            try{
                const response = await fetch(baseUrl, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRFToken': csrfToken ,
                    },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log("Server response:", result);
                    document.getElementById("success-show-form").textContent = result.message;
                    if(result.user_validate){
                        navigateTo('/login');
                    }else if(result.password_change){
                        navigateTo(`/change-password/${token}`);
                    }
                } else {
                    document.getElementById("success-show-form").textContent = '';
                    const errorData = await response.json();
                    showErrorForm.textContent = "please Enter valid opt ";
                    console.log("Server error+++++++++++++++:",errorData);
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
            <form id="otp-form" method="POST" class="col-md-6 col-lg-4 py-4 border rounded border-dark mx-auto my-auto mt-5 mb-2">
                <h4 class="text-center mt-3">Enter Otp</h4>            
                <input type="number" placeholder="Enter OTP from Your Email" class="form-control mb-2" name="otp"> 
                <p class="text-danger text-center mb-2" id="error-show-form"></p>
                <p class="text-success text-center mb-2" id="success-show-form"></p>  
                <input type="submit" value="Create Account" class="form-control btn btn-dark mb-2"> 
            </form> 
        </div>
    </div>
    `;


    setTimeout(() => {
        const form = document.getElementById('otp-form');
        form.addEventListener('submit', validateForm);
    }, 0); 
    return html; 
};

export default ValidateOtp;
