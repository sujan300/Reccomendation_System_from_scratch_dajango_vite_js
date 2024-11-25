const showTable = (listArray) => {
    console.log("list Array is ===>> ", listArray);
    return listArray.map(product => {
        return `
        <tr>
            <td>${showName(product.product.product_name)}</td>
            <td>${product.quantity}</td>
            <td>${product.product.price}</td>
        </tr>
        `;
    }).join('');
}

export default showTable;
