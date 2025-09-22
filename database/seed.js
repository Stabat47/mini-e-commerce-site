const mongoose = require('mongoose');
const Product = require('../backend/models/Product');
const User = require('../backend/models/User');
const Order = require('../backend/models/Order');

const products = [
    {
        name: 'Product 1',
        description: 'Description for Product 1',
        price: 29.99,
        image: '/assets/images/product1.jpg',
        stock: 100
    },
    {
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 39.99,
        image: '/assets/images/product2.jpg',
        stock: 50
    },
    {
        name: 'Product 3',
        description: 'Description for Product 3',
        price: 19.99,
        image: '/assets/images/product3.jpg',
        stock: 200
    }
];

const users = [
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123'
    },
    {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123'
    }
];

const orders = [
    {
        user: 'John Doe',
        products: [
            { product: 'Product 1', quantity: 2 },
            { product: 'Product 2', quantity: 1 }
        ],
        total: 99.97
    },
    {
        user: 'Jane Smith',
        products: [
            { product: 'Product 3', quantity: 3 }
        ],
        total: 59.97
    }
];

const seedDatabase = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/codealpha', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        await Product.insertMany(products);
        await User.insertMany(users);
        await Order.insertMany(orders);

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();