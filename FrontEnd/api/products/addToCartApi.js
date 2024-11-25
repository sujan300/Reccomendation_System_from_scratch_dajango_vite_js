const addToCartApi = async(id,qty,value=false)=>{
    const data = {
        token:localStorage.getItem('accessToken'),
        product_id:id,
        qty:qty,
    }

    const csrfToken = getCsrfToken();
    console.log(csrfToken ,"crsf token is =====>>>> ");
    
    try{
        const response = await fetch('http://127.0.0.1:8000/cart/add-to-cart', {
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
            if(value){
                renderCartPage();
            }
        } else {
            const errorData = await response.json();
            console.log("Server error:",errorData);
        }
    
    }catch(error){
        console.error("Fetch error:", error);
    }
}


const removeCartItemApi = async(id)=>{
    const csrfToken = getCsrfToken();
    const data={
        product_id:id,
        token:localStorage.getItem('accessToken'),
    }

    try{
        const response = await fetch(`http://127.0.0.1:8000/cart/delete-cart-item/${id}/`,
            {
                method:"DELETE",
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                    'X-CSRFToken': csrfToken ,
                },
                body:JSON.stringify(data),
            }
        )

        if(response.ok){
            const result = await response.json();
            console.log("result of call ",result);
        }else{
            console.log("error");
        }
    }catch{
        console.log("error");
    }

}