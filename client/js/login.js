const apiBase = '/api';

const loginForm = document.getElementById('login-form');
const loginMessage = document.getElementById('login-message');

const setToken = (token) => localStorage.setItem('token', token);
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginMessage.textContent = '';

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${apiBase}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json().catch(() => ({ message: response.statusText }));
    if (!response.ok) throw new Error(data.message || 'Login failed');

    setToken(data.token);
    setUser({ name: data.name, email: data.email, role: data.role });
    window.location.href = 'products.html';
  } catch (error) {
    loginMessage.textContent = error.message;
  }
});
