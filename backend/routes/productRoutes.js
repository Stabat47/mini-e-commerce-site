const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');
const  protect  = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getAllProducts)
    .post(protect, createProduct);

router.route('/:id')
    .get(getProductById)
    .put(protect, updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;