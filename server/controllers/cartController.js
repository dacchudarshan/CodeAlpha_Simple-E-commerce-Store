const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  res.json(cart || { items: [] });
});

const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = new Cart({ user: req.user._id, items: [] });
  }

  const existingIndex = cart.items.findIndex((item) => item.product.toString() === productId);
  if (existingIndex >= 0) {
    cart.items[existingIndex].quantity = Math.min(product.countInStock, cart.items[existingIndex].quantity + quantity);
  } else {
    cart.items.push({ product: productId, quantity });
  }

  const updatedCart = await cart.save();
  res.status(201).json(updatedCart);
});

const updateCartItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  const item = cart.items.find((item) => item.product.toString() === productId);
  if (!item) {
    res.status(404);
    throw new Error('Item not found in cart');
  }

  item.quantity = quantity;
  const updatedCart = await cart.save();
  res.json(updatedCart);
});

const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }

  cart.items = cart.items.filter((item) => item.product.toString() !== productId);
  const updatedCart = await cart.save();
  res.json(updatedCart);
});

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
