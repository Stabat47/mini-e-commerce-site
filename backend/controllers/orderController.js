const Order = require('../models/Order');

//  Create a new order (checkout the cart)
const createOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    // Find the user's pending cart
    let order = await Order.findOne({ user: req.user._id, orderStatus: 'Pending' });

    if (!order || order.products.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    order.shippingAddress = shippingAddress;
    order.paymentMethod = paymentMethod;
    order.totalAmount = order.products.reduce(
      (acc, item) => acc + item.product.price * item.quantity,
      0
    );
    order.orderStatus = 'Placed';

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//  Get order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('products.product');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order to paid
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged in user's orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('products.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  try {
    let order = await Order.findOne({ user: req.user._id, orderStatus: 'Pending' });

    if (!order) {
      order = new Order({
        user: req.user._id,
        products: [],
        totalAmount: 0,
        orderStatus: 'Pending'
      });
    }

    const existingItem = order.products.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      order.products.push({ product: productId, quantity });
    }

    // recalc total
    order.totalAmount = order.products.reduce(
      (acc, item) => acc + item.quantity, // price can be populated later
      0
    );

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get cart
const getCart = async (req, res) => {
  try {
    let order = await Order.findOne({ user: req.user._id, orderStatus: 'Pending' })
      .populate('products.product');

    if (!order) {
      order = await Order.create({
        user: req.user._id,
        products: [],
        totalAmount: 0,
        orderStatus: 'Pending'
      });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  Remove from cart
const removeFromCart = async (req, res) => {
  try {
    let order = await Order.findOne({ user: req.user._id, orderStatus: 'Pending' });
    if (!order) return res.status(404).json({ message: 'Cart not found' });

    order.products = order.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  deleteOrder,
  addToCart,
  getCart,
  removeFromCart
};
