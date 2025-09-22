const express = require('express');
const { createOrder, getOrderById, updateOrderToPaid, deleteOrder, addToCart, getCart, removeFromCart } = require('../controllers/orderController');
const  protect  = require('../middleware/authMiddleware');

const router = express.Router();

// Create new order
router.post('/', protect, createOrder);

// Cart routes 
router.post('/cart', protect, addToCart);
router.get('/cart', protect, getCart);
router.delete('/cart/:productId', protect, removeFromCart);

// Order by ID 
router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrderToPaid)
  .delete(protect, deleteOrder);
  
module.exports = router;