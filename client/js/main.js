const apiBase = '/api';

const getToken = () => localStorage.getItem('token');
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null');

const fetchWithAuth = async (url, options = {}) => {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'Request failed');
  }
  return response.json();
};

const redirectIfNotAuthenticated = () => {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
};

const renderNav = () => {
  const user = getUser();
  const nav = document.querySelector('.main-nav');
  const adminButton = document.getElementById('admin-dashboard-button');
  if (!nav || !user) return;

  const profileLink = document.createElement('a');
  profileLink.href = 'profile.html';
  profileLink.textContent = user.name;
  nav.appendChild(profileLink);

  if (user.role === 'admin') {
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.textContent = 'Admin';
    nav.appendChild(adminLink);
    if (adminButton) {
      adminButton.classList.remove('hidden');
    }
  }
};

window.addEventListener('DOMContentLoaded', () => {
  renderNav();
});
