



console.log("Pagination Page");

const getCallPagination = ()=>{
    const pagination = document.getElementById('pagination');
    console.log("pagination is =====>>>",pagination);
    pagination.innerHTML =`
        <nav aria-label="..." >          
            <ul class="pagination pagination-sm custom-pagination">
            <li class="page-item active" aria-current="page">
                <span class="page-link">1</span>
            </li>
            <li class="page-item"><a class="page-link" href="#">2</a></li>
            <li class="page-item"><a class="page-link" href="#">3</a></li>
            </ul>
        </nav>
    `
}


document.addEventListener("DOMContentLoaded", () => {
    getCallPagination();
});