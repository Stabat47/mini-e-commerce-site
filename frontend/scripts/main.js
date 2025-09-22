document.addEventListener('DOMContentLoaded', async function() {
    const productList = document.getElementById('product-list');
    if (productList) {
        try {
            const res = await fetch('/api/products');
            const products = await res.json();
            if (Array.isArray(products)) {
                productList.innerHTML = products.map(product => `
                    <div class="product-card">
                        <img src="${product.imageUrl || 'assets/images/default.png'}" alt="${product.name}" />
                        <h3>${product.name}</h3>
                        <p>${product.description}</p>
                        <p>Price: $${product.price}</p>
                        <a href="product.html?id=${product._id}">View Details</a>
                    </div>
                `).join('');
            } else {
                productList.innerHTML = '<p>No products found.</p>';
            }
        } catch (err) {
            productList.innerHTML = '<p>Error loading products.</p>';
        }
    }
});