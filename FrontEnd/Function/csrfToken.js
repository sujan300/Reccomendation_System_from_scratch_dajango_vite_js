async function getCsrfToken() {
    const response = await fetch('http://127.0.0.1:8000/account/csrf-token-get');
    const data = await response.json();
    console.log("csrf token is ===== >>> ",data.csrfToken);
    return data.csrfToken;
}