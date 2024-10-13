function addToCart(name, price) {
    fetch('/product/add-to-cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, price }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`${name} added to cart`);
            console.log('Current cart:', data.cart);
        } else {
            alert('Error adding to cart');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
