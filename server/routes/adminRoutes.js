const express = require('express');
const router = express.Router();
const { getUsers, deleteUser, getAllOrders, updateOrder } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/orders', protect, admin, getAllOrders);
router.put('/orders/:id', protect, admin, updateOrder);

module.exports = router;
