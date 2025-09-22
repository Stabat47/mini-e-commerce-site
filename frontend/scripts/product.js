document.addEventListener('DOMContentLoaded', () => {
    const productId = new URLSearchParams(window.location.search).get('id');
    const productContainer = document.getElementById('product-container');

    if (productId) {
        fetchProductDetails(productId);
    }

    function fetchProductDetails(id) {
        fetch(`/api/products/${id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(product => {
                displayProductDetails(product);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    function displayProductDetails(product) {
        productContainer.innerHTML = `
            <h1>${product.name}</h1>
            <img src="${product.imageUrl}" alt="${product.name}">
            <p>${product.description}</p>
            <p>Price: $${product.price}</p>
            <button id="add-to-cart">Add to Cart</button>
        `;

        document.getElementById('add-to-cart').addEventListener('click', () => {
            addToCart(product);
        });
    }

    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === product._id);

        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Product added to cart!');
    }
});