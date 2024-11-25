async function checkLoginStatus() {
    const response = await fetch('http://127.0.0.1:8000/account/status', {
        method: 'GET',
        credentials: 'include',
    });
    const data = await response.json();
    if (data.loggedIn) {
        console.log(`User is logged in as ${data.email}`);
    } else {
        console.log('User is not logged in');
    }
}

// Example usage
checkLoginStatus();