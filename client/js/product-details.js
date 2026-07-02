const apiBase = '/api';
const defaultProductImage = '/images/placeholder.svg';

const sanitizeImagePath = (src) => {
  const value = String(src || '').trim();
  return value && !['null', 'undefined'].includes(value.toLowerCase()) ? value : defaultProductImage;
};

const productImage = document.getElementById('product-image');
const productName = document.getElementById('product-name');
const productCategory = document.getElementById('product-category');
const productDescription = document.getElementById('product-description');
const productPrice = document.getElementById('product-price');
const quantityInput = document.getElementById('product-quantity');
const addToCartButton = document.getElementById('add-to-cart');

const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

const fetchProduct = async () => {
  try {
    const response = await fetch(`${apiBase}/products/${productId}`);
    const product = await response.json().catch(() => null);
    if (!response.ok || !product) throw new Error('Unable to load product');
    renderProduct(product);
  } catch (error) {
    productName.textContent = 'Product unavailable';
    productDescription.textContent = error.message;
  }
};

const renderProduct = (product) => {
  productImage.src = sanitizeImagePath(product.image);
  productImage.alt = product.name || 'Product';
  productImage.loading = 'lazy';
  productImage.decoding = 'async';
  productImage.onerror = () => {
    productImage.onerror = null;
    productImage.src = defaultProductImage;
  };
  productName.textContent = product.name;
  productCategory.textContent = product.category;
  productDescription.textContent = product.description;
  productPrice.textContent = `₹${product.price.toFixed(2)}`;
};

const addToCart = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const quantity = Number(quantityInput.value);
    await fetch(`${apiBase}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity }),
    });

    alert('Added to cart');
  } catch (error) {
    alert(error.message);
  }
};

addToCartButton.addEventListener('click', addToCart);
fetchProduct();
