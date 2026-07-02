const apiBase = '/api';
const defaultProductImage = '/images/placeholder.svg';

const sanitizeImagePath = (src) => {
  const value = String(src || '').trim();
  return value && !['null', 'undefined'].includes(value.toLowerCase()) ? value : defaultProductImage;
};

const renderProductImage = (src, alt) => `
  <img
    src="${sanitizeImagePath(src)}"
    alt="${alt}"
    loading="lazy"
    decoding="async"
    onerror="this.onerror=null;this.src='${defaultProductImage}'"
  />
`;

const productList = document.getElementById('product-list');
const categoryFilter = document.getElementById('category-filter');
const searchInput = document.getElementById('search-input');

const categories = new Set();
let allProducts = [];

const fetchProducts = async () => {
  try {
    const response = await fetch(`${apiBase}/products`);
    const data = await response.json().catch(() => []);
    if (!response.ok) throw new Error('Unable to load products');
    allProducts = data;
    renderProducts(data);
    renderCategoryOptions(data);
  } catch (error) {
    productList.innerHTML = `<p class="form-message">Unable to load products: ${error.message}</p>`;
  }
};

const renderProducts = (products) => {
  if (!products?.length) {
    productList.innerHTML = '<p>No products found.</p>';
    return;
  }

  productList.innerHTML = products
    .map(
      (product) => `
      <article class="product-card">
        ${renderProductImage(product.image, product.name)}
        <div>
          <h2>${product.name}</h2>
          <p>${product.category}</p>
          <p class="price">₹${product.price.toFixed(2)}</p>
          <p>${product.description.slice(0, 100)}...</p>
          <p>Stock: ${product.countInStock}</p>
        </div>
        <div class="product-actions">
          <a href="product-details.html?id=${product._id}" class="btn btn-secondary">View</a>
          <button class="btn btn-primary" onclick="addToCart('${product._id}')">Add to Cart</button>
        </div>
      </article>
    `,
    )
    .join('');
};

const renderCategoryOptions = (products) => {
  categories.clear();
  products.forEach((product) => categories.add(product.category));

  const categoryOptions = ['All', ...Array.from(categories).sort()].map(
    (category) => `<option value="${category}">${category}</option>`,
  );
  categoryFilter.innerHTML = categoryOptions.join('');
};

const filterProducts = () => {
  const selectedCategory = categoryFilter?.value || 'All';
  const searchTerm = searchInput?.value.toLowerCase() || '';

  let filtered = allProducts;
  if (selectedCategory !== 'All') {
    filtered = filtered.filter((product) => product.category === selectedCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm),
    );
  }
  renderProducts(filtered);
};

searchInput?.addEventListener('input', filterProducts);
categoryFilter?.addEventListener('change', filterProducts);

const addToCart = async (productId) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
      return;
    }
    const response = await fetch(`${apiBase}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || 'Unable to add item to cart');
    }
    alert('Added to cart');
  } catch (error) {
    alert(error.message);
  }
};

window.addToCart = addToCart;
window.filterProducts = filterProducts;

fetchProducts();
