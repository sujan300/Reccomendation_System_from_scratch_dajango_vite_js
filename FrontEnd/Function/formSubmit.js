const formSubmit = (form,validateForm) =>{
    setTimeout(() => {
        form.addEventListener('submit', validateForm);
    }, 0); 
}