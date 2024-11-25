      //<!-- product page  -->
      const showStar = (rating) => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fa-solid fa-star checked-star"></i>'; 
            } else if (i - 0.5 === rating) {
                stars += '<i class="fa-solid fa-star-half-stroke checked-star"></i>'; 
            } else {
                stars += '<i class="fa-regular fa-star"></i>'; 
            }
        }
        return stars;
    };
