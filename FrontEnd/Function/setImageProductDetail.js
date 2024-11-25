const setImageUrl = (urlImage) => {
    const mainImage = document.getElementById("product-main-img");
    mainImage.src = urlImage;
    console.log("Image changed to:", urlImage);
};