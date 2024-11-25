      //search bar auto popup 
      const products = ["Mobile", "Laptop", "Tablet", "Headphones", "Watch", "Television", "Camera", "Speaker"];

        const searchInput = document.getElementById("search");
        const suggestionsBox = document.getElementById("suggestions");

        console.log("searchInput",searchInput);

        // searchInput.onkeyup = () =>{
        //     let result ='';
        //     let inputValue = searchInput.value.trim();
        //     console.log("input value length ====",inputValue.length);
        //     if(inputValue.length >0){
        //         result = products.filter((keyword)=>{
        //             return keyword.toLowerCase().includes(inputValue.toLowerCase());
        //         })
        //         console.log("result === >>",result);
        //     }
        //     displayResult(result);
        // }


        searchInput.addEventListener("keyup", () => {
            let inputValue = searchInput.value.trim();
        
            if (inputValue.length > 0) {
                // Fetch results from the API
                fetch(`http://127.0.0.1:8000/store/search/?q=${inputValue}`)
                    .then((response) => response.json())
                    .then((data) => {
                        displayResult(data.results);
                    })
                    .catch((error) => console.error("Error fetching search results:", error));
            } else {
                suggestionsBox.innerHTML = ""; // Clear suggestions if input is empty
            }
        });

        function displayResult(result){
            const resultCount = result.length;
            console.log("call .....",result);
            if(resultCount>0){
                const content =result.map((list)=>{
                    return `<div class="">
                        <a href='/product-detail/${list.id}' data-link class="text-dark text-decoration-none">${list.name}</a>
                    </div>`;
                }).join("");
                console.log("run ....");
                suggestionsBox.innerHTML = content ? content : `<div>not found !</div>`;
                suggestionsBox.innerHTML += `
                <div class="d-flex justify-content-center">
                    <span id="countProducts" class="text-primary" style="font-style: italic;">Total result(${resultCount})</span>
                </div>`;
            }else{
                suggestionsBox.innerHTML ="";
            }
        }


