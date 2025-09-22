const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true,
                default: 1
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0
    },
    orderStatus: {
        type: String,
        enum: ['Cart', 'Pending', 'Paid', 'Shipped', 'Completed', 'Cancelled'],
        default: 'Cart'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Auto-calc totalAmount before saving
orderSchema.pre('save', async function (next) {
    if (this.products && this.products.length > 0) {
        // populate product prices
        await this.populate('products.product');
        this.totalAmount = this.products.reduce(
            (sum, item) => sum + (item.product.price * item.quantity),
            0
        );
    } else {
        this.totalAmount = 0;
    }
    next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
