export const getCartItem = async()=>{
    const data = {
        token:localStorage.getItem('accessToken'),
    }
    const csrfToken = getCsrfToken();
    try{
        const response = await fetch('http://127.0.0.1:8000/cart/get-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                'X-CSRFToken': csrfToken ,
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            const result = await response.json();
            console.log("result of add to cart is ",result);
            return result.products;
        } else {
            const errorData = await response.json();
            console.log("Server error:",errorData);
            // return[]
        }
    
    }catch(error){
        console.error("Fetch error:", error);
    }
}