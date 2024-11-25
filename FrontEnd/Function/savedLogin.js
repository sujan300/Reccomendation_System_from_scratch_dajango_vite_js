




function isLoggedIn() {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return false;
    }

   //  // Optional: Decode the JWT to check its expiration
   //  const payload = JSON.parse(atob(accessToken.split('.')[1]));
   //  const isExpired = Date.now() >= payload.exp * 1000;
   //  console.log("access token is ", accessToken);
    return true;
}



function updateLoginStatus() {
    const divLoginSignup = document.getElementById('head-login-signup');
    if (isLoggedIn()) {
       divLoginSignup.innerHTML = `
          <a href="/user-dashboard" class="text-light text-decoration-none me-3" data-link>User Dashboard</a>
          <a href="#" class="text-light text-decoration-none" id="logoutLink">Logout</a>
       `;

       // Add event listener to handle logout
       document.getElementById("logoutLink").addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("accessToken");
          window.location.reload();
       });
    } else {
       divLoginSignup.innerHTML = `
          <a href="/login" class="text-light text-decoration-none me-3" data-link>LogIn</a>
          <a href="/signup" class="text-light text-decoration-none" data-link>SignUp</a>
       `;
    }
 }


document.addEventListener("DOMContentLoaded", function () {
   // Initial check on page load
   updateLoginStatus();
});

