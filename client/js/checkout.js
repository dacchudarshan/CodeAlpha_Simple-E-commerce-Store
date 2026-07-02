const apiBase = '/api';
const checkoutItems = document.getElementById('checkout-items');
const checkoutForm = document.getElementById('checkout-form');
const checkoutMessage = document.getElementById('checkout-message');
const checkoutItemsPrice = document.getElementById('checkout-items-price');
const checkoutShippingPrice = document.getElementById('checkout-shipping-price');
const checkoutTaxPrice = document.getElementById('checkout-tax-price');
const checkoutTotalPrice = document.getElementById('checkout-total-price');

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
    renderCheckout(cart.items || []);
  } catch (error) {
    checkoutMessage.textContent = error.message;
  }
};

const renderCheckout = (items) => {
  if (!items.length) {
    checkoutItems.innerHTML = '<p>Your cart is empty. Add items before checkout.</p>';
    checkoutForm.querySelector('button').disabled = true;
    return;
  }

  checkoutItems.innerHTML = items
    .map(
      (item) => `
      <div class="checkout-item">
        <div class="checkout-item-details">
          <h3>${item.product.name}</h3>
          <p>${item.product.category}</p>
          <p>₹${item.product.price.toFixed(2)} x ${item.quantity}</p>
        </div>
      </div>
    `,
    )
    .join('');

  const itemsPrice = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = itemsPrice > 100 ? 0 : 10;
  const tax = Number((itemsPrice * 0.08).toFixed(2));
  const total = Number((itemsPrice + shipping + tax).toFixed(2));

  checkoutItemsPrice.textContent = `₹${itemsPrice.toFixed(2)}`;
  checkoutShippingPrice.textContent = `₹${shipping.toFixed(2)}`;
  checkoutTaxPrice.textContent = `₹${tax.toFixed(2)}`;
  checkoutTotalPrice.textContent = `₹${total.toFixed(2)}`;
};

checkoutForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  checkoutMessage.textContent = '';

  try {
    const token = getToken();
    const response = await fetch(`${apiBase}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        shippingAddress: document.getElementById('shippingAddress').value,
        paymentMethod: document.getElementById('paymentMethod').value,
      }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Checkout failed');

    checkoutMessage.textContent = 'Order placed successfully!';
    checkoutForm.reset();
    fetchCart();
  } catch (error) {
    checkoutMessage.textContent = error.message;
  }
});

fetchCart();
