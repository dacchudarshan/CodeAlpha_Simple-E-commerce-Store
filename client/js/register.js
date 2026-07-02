const apiBase = '/api';

const registerForm = document.getElementById('register-form');
const registerMessage = document.getElementById('register-message');

const setToken = (token) => localStorage.setItem('token', token);
const setUser = (user) => localStorage.setItem('user', JSON.stringify(user));

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  registerMessage.textContent = '';

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch(`${apiBase}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json().catch(() => ({ message: response.statusText }));
    if (!response.ok) throw new Error(data.message || 'Registration failed');

    setToken(data.token);
    setUser({ name: data.name, email: data.email, role: data.role });
    window.location.href = 'products.html';
  } catch (error) {
    registerMessage.textContent = error.message;
  }
});
