document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:8888/php-rest-api/index.php/products'; // I use MAMP server thats why link looks like that 
    const dataList = document.getElementById('data-list');
    const productForm = document.getElementById('product-form');
    const deleteForm = document.getElementById('delete-form');

    // function to view products
    function fetchProducts() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                dataList.innerHTML = ''; // clear list 

                if (Array.isArray(data)) {
                    data.forEach(item => {
                        const listItem = document.createElement('li');
                        listItem.textContent = `ID: ${item.id}, Name: ${item.name}, Size: ${item.size}, Available: ${item.is_available}`;
                        dataList.appendChild(listItem);
                    });
                } else {
                    const errorItem = document.createElement('li');
                    errorItem.textContent = 'No products available';
                    dataList.appendChild(errorItem);
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const errorItem = document.createElement('li');
                errorItem.textContent = 'Error fetching data';
                dataList.appendChild(errorItem);
            });
    }

    // adding product 
    productForm.addEventListener('submit', function(event) {
        event.preventDefault(); // prevent sending 

        const name = document.getElementById('name').value;
        const size = document.getElementById('size').value;
        const isAvailable = document.getElementById('is_available').checked;

        const newProduct = {
            name: name,
            size: parseInt(size),
            is_available: isAvailable
        };

        //  sending data via post 
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        })
        .then(response => response.json())
        .then(data => {
            // reset list 
            fetchProducts();
            // reset form 
            productForm.reset();
        })
        .catch(error => {
            console.error('Error adding product:', error);
        });
    });

    // remove product function 
    deleteForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productId = document.getElementById('delete-id').value;

        // prevent sednig request to API (DELETE)
        fetch(`${apiUrl}/${productId}`, {
            method: 'DELETE',
        })
        .then(response => response.json())
        .then(data => {
            fetchProducts();
            // clear form 
            deleteForm.reset();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
        });
    });
    
    // upload products
    fetchProducts();
});
