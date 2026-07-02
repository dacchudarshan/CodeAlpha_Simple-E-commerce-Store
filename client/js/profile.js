const apiBase = '/api';
const profileForm = document.getElementById('profile-form');
const profileMessage = document.getElementById('profile-message');
const orderHistory = document.getElementById('order-history');
const logoutButton = document.getElementById('logout-btn');

const getToken = () => localStorage.getItem('token');
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

const fetchProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${apiBase}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const user = await response.json();
    if (!response.ok) throw new Error(user.message || 'Unable to load profile');

    document.getElementById('name').value = user.name;
    document.getElementById('email').value = user.email;
    document.getElementById('address').value = user.address || '';
    document.getElementById('phone').value = user.phone || '';
    localStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    profileMessage.textContent = error.message;
  }
};

const fetchOrders = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const response = await fetch(`${apiBase}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Unable to load orders');
    renderOrders(data);
  } catch (error) {
    orderHistory.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
};

const renderOrders = (orders) => {
  if (!orders.length) {
    orderHistory.innerHTML = '<p>No orders found.</p>';
    return;
  }

  orderHistory.innerHTML = orders
    .map(
      (order) => `
      <div class="order-card">
        <h3>Order #${order._id.slice(-6)}</h3>
        <p>Status: <strong>${order.status}</strong></p>
        <p>Total: ₹${order.totalPrice.toFixed(2)}</p>
        <p>Placed: ${new Date(order.createdAt).toLocaleDateString()}</p>
      </div>
    `,
    )
    .join('');
};

profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  profileMessage.textContent = '';

  try {
    const token = getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${apiBase}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        password: document.getElementById('password').value,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Update failed');

    localStorage.setItem('user', JSON.stringify(data));
    profileMessage.textContent = 'Profile updated successfully.';
  } catch (error) {
    profileMessage.textContent = error.message;
  }
});

logoutButton.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
});

fetchProfile();
fetchOrders();
