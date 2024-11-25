export  const validateForm = ()=>{
    const changePassword1 = document.getElementById('changePassword1');
    const changePassword2 = document.getElementById('changePassword2');
    console.log("called inside validation");
    if(changePassword1 !== changePassword2){
        document.getElementById('show-error-change-form').innerText = "please Enter Same !"
    }
}