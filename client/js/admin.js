const apiBase = '/api';
const productForm = document.getElementById('product-form');
const adminProductList = document.getElementById('admin-product-list');
const adminOrderList = document.getElementById('admin-order-list');
const adminUserList = document.getElementById('admin-user-list');

const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');
const defaultProductImage = '/images/placeholder.svg';

const sanitizeImagePath = (src) => {
  const value = String(src || '').trim();
  return value && !['null', 'undefined'].includes(value.toLowerCase()) ? value : defaultProductImage;
};

const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;

const ensureAdminAccess = () => {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    window.location.href = 'products.html';
    return false;
  }
  return true;
};

const fetchAdminData = async () => {
  try {
    if (!ensureAdminAccess()) return;

    const token = getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const [productsRes, ordersRes, usersRes] = await Promise.all([
      fetch(`${apiBase}/products`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiBase}/admin/orders`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiBase}/admin/users`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    if (!productsRes.ok || !ordersRes.ok || !usersRes.ok) {
      const error = await productsRes.json().catch(() => null) ||
                    await ordersRes.json().catch(() => null) ||
                    await usersRes.json().catch(() => null);
      throw new Error(error?.message || 'Admin access required');
    }

    const [products, orders, users] = await Promise.all([productsRes.json(), ordersRes.json(), usersRes.json()]);
    renderProducts(products);
    renderOrders(orders);
    renderUsers(users);
  } catch (error) {
    adminProductList.innerHTML = `<p class="form-message">${error.message}</p>`;
    adminOrderList.innerHTML = `<p class="form-message">${error.message}</p>`;
    adminUserList.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
};

const renderProducts = (products) => {
  if (!products.length) {
    adminProductList.innerHTML = '<p>No products available.</p>';
    return;
  }

  adminProductList.innerHTML = products
    .map(
      (product) => `
      <div class="order-card admin-product-card">
        <img src="${sanitizeImagePath(product.image)}" alt="${product.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${defaultProductImage}'" />
        <h3>${product.name}</h3>
        <p>Category: ${product.category}</p>
        <p>Price: ${formatCurrency(product.price)}</p>
        <p>Stock: ${product.countInStock}</p>
        <button class="btn btn-secondary" onclick="deleteProduct('${product._id}')">Delete</button>
      </div>
    `,
    )
    .join('');
};

const renderOrders = (orders) => {
  if (!orders.length) {
    adminOrderList.innerHTML = '<p>No orders available.</p>';
    return;
  }

  adminOrderList.innerHTML = orders
    .map(
      (order) => `
      <div class="order-card order-admin-card">
        <h3>Order #${order._id.slice(-6)}</h3>
        <p>User: ${order.user.name} (${order.user.email})</p>
        <p>Items: ${order.orderItems.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
        <p>Subtotal: ${formatCurrency(order.itemsPrice)}</p>
        <p>Shipping: ${formatCurrency(order.shippingPrice)}</p>
        <p>Tax: ${formatCurrency(order.taxPrice)}</p>
        <p>Total: ${formatCurrency(order.totalPrice)}</p>
        <p>Status: ${order.status}</p>
        <select onchange="updateOrderStatus('${order._id}', this.value)">
          <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Shipped" ${order.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
          <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
        </select>
      </div>
    `,
    )
    .join('');
};

const renderUsers = (users) => {
  if (!users.length) {
    adminUserList.innerHTML = '<p>No users found.</p>';
    return;
  }

  adminUserList.innerHTML = users
    .map(
      (user) => `
      <div class="order-card">
        <h3>${user.name}</h3>
        <p>Email: ${user.email}</p>
        <p>Role: ${user.role}</p>
        <button class="btn btn-secondary" onclick="deleteUser('${user._id}')">Delete User</button>
      </div>
    `,
    )
    .join('');
};

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const token = getToken();
  try {
    const productData = {
      name: document.getElementById('product-name').value,
      category: document.getElementById('product-category').value,
      image: document.getElementById('product-image').value,
      price: Number(document.getElementById('product-price').value),
      countInStock: Number(document.getElementById('product-stock').value),
      description: document.getElementById('product-description').value,
    };

    const response = await fetch(`${apiBase}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    fetchAdminData();
    productForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

window.deleteProduct = async (productId) => {
  const token = getToken();
  await fetch(`${apiBase}/products/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchAdminData();
};

window.deleteUser = async (userId) => {
  const token = getToken();
  await fetch(`${apiBase}/admin/users/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  fetchAdminData();
};

window.updateOrderStatus = async (orderId, status) => {
  const token = getToken();
  await fetch(`${apiBase}/admin/orders/${orderId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  fetchAdminData();
};

fetchAdminData();
