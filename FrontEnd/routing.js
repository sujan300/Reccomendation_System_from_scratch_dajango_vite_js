import HomePage from "./views/home"
import StorePage from "./views/store"
import LoginPage from "./views/login"
import SignupPage from "./views/signup"
import CartPage from "./views/cart"
import productDetail from "./views/productDetails"
import checkOutPage from "./views/checkOut"
import ValidateOtp from "./views/otpValidate"
import UserDashBoard from "./views/userDashboard"
import ForgetPasswordPage from "./views/forgetPassword"
import ChangePasswordPage from "./views/changePassword"

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

window.navigateTo=navigateTo;

const isAuthenticatedUser=(page,message)=>{
    if (!isLoggedIn()) {
        return LoginPage(message);
    }
    return page();
}

window.isAuthenticatedUser=isAuthenticatedUser;

const router = async () => {
    const routes = [
        { path: '/', view: () => HomePage() },
        { path: '/signup', view: () => SignupPage() },
        { path: '/login', view: () => LoginPage() },
        { path: '/otp-validate/:token', view: (token) => ValidateOtp(token) },
        { path: '/forget-password', view:()=>ForgetPasswordPage()},
        { path: '/store', view: () => StorePage() },
        { path: '/cart', view: () => isAuthenticatedUser(CartPage, "please login first Cart!") },
        { path: '/product-detail/:id', view: (id) => productDetail(id) },
        { path: '/checkout', view: () => isAuthenticatedUser(checkOutPage,"Please Login First to Access CheckOut Page !",)},
        { path: '/user-dashboard', view: () => isAuthenticatedUser(UserDashBoard, "please login first To Access Dashboard!") },
        { path: '/change-password/:token',view:(token)=>ChangePasswordPage(token)},
    ];

    const potentialMatches = routes.map(route => {
        const match = location.pathname.match(new RegExp(`^${route.path.replace(/:[^\s/]+/, '([\\w.-]+)')}$`));
        return {
            route: route,
            isMatch: match
        };
    });

    // Fixing the match finding logic
    let match = potentialMatches.find(potentialMatche => potentialMatche.isMatch); 

    console.log(match)
    if (!match) {
        match = {
            route: routes[0],
            isMatch: true,
        };
    }
    console.log(match)

    // Log the matched view function call
    console.log("Potential matches:", potentialMatches);
    const token = match.isMatch ? match.isMatch[1] : null; // Get token if matched
    document.querySelector("#app").innerHTML = await match.route.view(token);
    cartCount();
};

document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener('click', e => {
        if (e.target.matches("[data-link]") || e.target.closest("[data-link]")) {
            e.preventDefault();
            const target = e.target.matches("[data-link]") ? e.target : e.target.closest("[data-link]");
            navigateTo(target.getAttribute("href"));
        }
    });
    cartCount();
    router();
});
