// Fetching products and displaying them
// fetch('/products')
//     .then(response => response.json())
//     .then(products => {
//         const productContainer = document.getElementById('product-list');
//         products.forEach(product => {
//             const productElement = document.createElement('div');
//             productElement.className = 'product-item';
//             productElement.innerHTML = `
//                 <img src="${product.image}" alt="${product.name}">
//                 <h3>${product.name}</h3>
//                 <p>${product.description}</p>
//                 <p>$${product.price}</p>
//                 <button onclick="addToCart('${product._id}')">Add to Cart</button>
//             `;
//             productContainer.appendChild(productElement);
//         });
//     });

// function addToCart(productId) {
//     // Logic to add product to the cart
//     console.log(`Product ${productId} added to cart.`);
// }


let box = document.querySelectorAll('.rr');
let range = document.querySelectorAll('.mv');
let filter = document.querySelector('.ft');

filter.addEventListener('click', () => {
  range[0].style.zIndex = -1;
  range[1].style.zIndex = -1;
  range[2].style.zIndex = -1;
})


box[0].addEventListener('click', () => {
  range[0].style.zIndex = 1;
});
range[0].addEventListener('mouseover', () => {
  range[0].style.zIndex = 1;
});
range[0].addEventListener('mouseout', () => {
  range[0].style.zIndex = -1;
});
range[0].addEventListener('click', () => {
  range[0].style.zIndex = -1;
});


box[1].addEventListener('click', () => {
  range[1].style.zIndex = 1;
});
range[1].addEventListener('mouseover', () => {
  range[1].style.zIndex = 1;
});
range[1].addEventListener('mouseout', () => {
  range[1].style.zIndex = -1;
});
range[1].addEventListener('click', () => {
  range[1].style.zIndex = -1;
});


box[2].addEventListener('click', () => {
  range[2].style.zIndex = 1;
});
range[2].addEventListener('mouseover', () => {
  range[2].style.zIndex = 1;
});
range[2].addEventListener('mouseout', () => {
  range[2].style.zIndex = -1;
});
range[2].addEventListener('click', () => {
  range[2].style.zIndex = -1;
});
