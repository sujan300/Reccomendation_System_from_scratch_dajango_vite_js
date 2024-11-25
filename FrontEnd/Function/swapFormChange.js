
const changePasswordForm= async()=>{
    document.getElementById('user-detail').innerHTML=`
    <span class="mb-3" style="cursor: pointer;" onclick="renderUserDashBoard()">
        <i class="fa-solid fa-arrow-left cursor-pointer" id="back"></i>
    </span>
    <form>
        <label>New Password:</label>
        <input type="password" placeholder="Old Password" class="form-control mb-2" name="current_password" id="current_password" required>
        <label>Confirm New Password:</label>
        <input type="password" placeholder="New password" class="form-control mb-2" name="new_password" id="new_password" required>
    </form>
    <div class="d-flex justify-content-end">
        <button class="btn btn-dark btn-sm">Save</button>
    </div>
`;
}

const editProfileForm=async(name,email)=>{
    document.getElementById('user-detail').innerHTML=`
    <span class="mb-3" style="cursor: pointer;" onclick="renderUserDashBoard()">
        <i class="fa-solid fa-arrow-left cursor-pointer" id="back"></i>
    </span>
    <form>
        <label>Name:</label>
        <input type="text" value=${name} class="form-control mb-2" name="name" id="name-edit">
        <label>Email:</label><span class="text-danger">You Cant Change Email</span>
        <input type="email" value=${email} class="form-control mb-2" name="email" id="email-edit" disabled>
    </form>
        <div class="d-flex justify-content-end">
        <button class="btn btn-dark btn-sm">Save</button>
    </div>
    `;
}


// const defaultUiOfUserDashBoard = ()=>{
//     document.getElementById('user-detail').innerHTML=`
//         <div class="user-info mb-3">
//             <span class="user-name">Name:${name}</span>
//         </div>
//         <div class="user-info mb-3">
//             <span class="user-email">Email:${email}</span>
//         </div>
//         <div class="user-info mb-3 d-flex justify-content-between">
//             <button class="btn btn-sm btn-dark" id="changePasswordBtn" onclick="changePasswordForm()">Change Password</button>
//             <button class="btn btn-danger btn-sm" id="profileEditBtn" onclick="editProfileForm('${name}','${email}')">Edit Profile</button>
//         </div>
//     `
// }