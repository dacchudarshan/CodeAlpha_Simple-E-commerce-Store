const apiBase = '/api';
const defaultProductImage = '/images/placeholder.svg';

const sanitizeImagePath = (src) => {
  const value = String(src || '').trim();
  return value && !['null', 'undefined'].includes(value.toLowerCase()) ? value : defaultProductImage;
};

const cartItemsWrapper = document.getElementById('cart-items');
const cartEmptyMessage = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartItemsPrice = document.getElementById('cart-items-price');
const cartShippingPrice = document.getElementById('cart-shipping-price');
const cartTaxPrice = document.getElementById('cart-tax-price');
const cartTotalPrice = document.getElementById('cart-total-price');

const getToken = () => localStorage.getItem('token');

const fetchCart = async () => {
  try {
    const token = getToken();
    if (!token) {
      window.location.href = 'login.html';
      return;
    }

    const response = await fetch(`${apiBase}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const cart = await response.json();
    renderCart(cart.items || []);
  } catch (error) {
    cartItemsWrapper.innerHTML = `<p class="form-message">${error.message}</p>`;
  }
};

const renderCart = (items) => {
  if (!items.length) {
    cartEmptyMessage.classList.remove('hidden');
    cartSummary.classList.add('hidden');
    cartItemsWrapper.innerHTML = '';
    return;
  }

  cartEmptyMessage.classList.add('hidden');
  cartSummary.classList.remove('hidden');

  cartItemsWrapper.innerHTML = items
    .map(
      (item) => `
        <div class="cart-item">
          <img src="${sanitizeImagePath(item.product.image)}" alt="${item.product.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${defaultProductImage}'" />
          <div class="cart-item-details">
            <h3>${item.product.name}</h3>
            <p>${item.product.category}</p>
            <p>₹${item.product.price.toFixed(2)} each</p>
            <p>Subtotal: ₹${(item.product.price * item.quantity).toFixed(2)}</p>
          </div>
          <div class="cart-item-controls">
            <input type="number" min="1" value="${item.quantity}" onchange="updateCartQuantity('${item.product._id}', this.value)" />
            <button class="btn btn-secondary" onclick="removeCartItem('${item.product._id}')">Remove</button>
          </div>
        </div>
      `,
    )
    .join('');

  const itemsPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = itemsPrice > 100 ? 0 : 10;
  const tax = Number((itemsPrice * 0.08).toFixed(2));
  const total = Number((itemsPrice + shipping + tax).toFixed(2));

  cartItemsPrice.textContent = `₹${itemsPrice.toFixed(2)}`;
  cartShippingPrice.textContent = `₹${shipping.toFixed(2)}`;
  cartTaxPrice.textContent = `₹${tax.toFixed(2)}`;
  cartTotalPrice.textContent = `₹${total.toFixed(2)}`;
};

window.updateCartQuantity = async (productId, quantity) => {
  const token = getToken();
  try {
    await fetch(`${apiBase}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: Number(quantity) }),
    });
    fetchCart();
  } catch (error) {
    alert(error.message);
  }
};

window.removeCartItem = async (productId) => {
  const token = getToken();
  try {
    await fetch(`${apiBase}/cart/${productId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCart();
  } catch (error) {
    alert(error.message);
  }
};

fetchCart();
