

import axios from 'axios';

export const getUserDashboard = async () => {
    console.log("Running .....................");

    const data = {
        token: localStorage.getItem('accessToken')
    };

    console.log("Access Token:", data.token);
    console.log("CSRF Token:", getCsrfToken());

    try {
        const response = await axios.post('http://127.0.0.1:8000/account/user-dashoard', data, {
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCsrfToken(),
                'Authorization': `Bearer ${data.token}`
            },
            // timeout: 5000 // optional timeout in milliseconds
        });

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.log("catch run", error);
        return null;
    }
};



export const getOrderHistoryApi = async () => {
    console.log("Running... getOrderHistoryApi");
    try {
        const response = await fetch('http://127.0.0.1:8000/order/order-history', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Result in get :", result);
            return result.orders;
        } else {
            const errorData = await response.json();
            console.log("Error data:", errorData);
        }
    } catch (error) {
        console.log("Request error:", error);
    }
};
