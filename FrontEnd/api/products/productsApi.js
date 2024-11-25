export const getAllProducts =async(page=1,category=None)=>{
    console.log("category is ",category);
    const url = category
    ? `store/products?page=${page}&category=${category}`
    : `store/products?page=${page}`;
    const response = await fetch(`http://127.0.0.1:8000/${url}`);
    const data = await response.json();
    console.log("Data is ==== ",data," and type of data",typeof(data));
    if (Array.isArray(data.results)) {
        console.log("is array");
        return data;
    } else {
        return [];
    }
}

// results


export const productReview =async(id)=>{
    console.log("product is is ",id);
    const response = await fetch(`http://127.0.0.1:8000/store/product-get-rating/${id}`)
    const data = await response.json();
    console.log("data in productReview",data);
    if (Array.isArray(data.reviews)) {
        console.log("is array",data.reviews);
        return data.reviews;
    } else {
        return [];
    }
}



export const getRecommededProducts =async(id)=>{
    const accessToken = localStorage.getItem('accessToken');
    let response;
    if(accessToken){
        response = await fetch(`http://127.0.0.1:8000/store/get-simillar-products/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}` // Add the token here
            }
        });
    }else{
        response = await fetch(`http://127.0.0.1:8000/store/get-simillar-products/${id}/`)
    }
    const data = await response.json();
    console.log("Data is in recoomendation ==== ",data," and type of data",typeof(data));
    if (Array.isArray(data.data)) {
        console.log("is array");
        return data.data;
    } else {
        return [];
    }
}



export const getAllCategory =async()=>{
    const response = await fetch(`http://127.0.0.1:8000/store/get-category`);
    const data = await response.json();
    console.log( "all category is ",data);
    if (Array.isArray(data.all_categories)) {
        return data.all_categories;
    } else {
        return [];
    }
}
