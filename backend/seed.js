require('dotenv').config();

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
        imageUrl: '/assets/images/product1.jpg', 
        category: 'Electronics',
        stock: 100
    },
    {
        name: 'Product 2',
        description: 'Description for Product 2',
        price: 39.99,
        image: '/assets/images/product2.jpg',
        imageUrl: '/assets/images/product2.jpg', 
        category: 'Electronics',
        stock: 50
    },
    {
        name: 'Product 3',
        description: 'Description for Product 3',
        price: 19.99,
        image: '/assets/images/product3.jpg',
        imageUrl: '/assets/images/product3.jpg', 
        category: 'Electronics',
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

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        await Product.deleteMany({});
        await User.deleteMany({});
        await Order.deleteMany({});

        const createdProducts = await Product.insertMany(products);
        const createdUsers = await User.insertMany(users);

        // Map product names to their ObjectIds
        const productMap = {};
        createdProducts.forEach(p => { productMap[p.name] = p._id; });
        // Map user emails to their ObjectIds
        const userMap = {};
        createdUsers.forEach(u => { userMap[u.email] = u._id; });

        const orders = [
            {
                user: userMap['john@example.com'],
                products: [
                    { product: productMap['Product 1'], quantity: 2 },
                    { product: productMap['Product 2'], quantity: 1 }
                ],
                totalAmount: 29.99 * 2 + 39.99 * 1
            },
            {
                user: userMap['jane@example.com'],
                products: [
                    { product: productMap['Product 3'], quantity: 3 }
                ],
                totalAmount: 19.99 * 3
            }
        ];

        await Order.insertMany(orders);

        console.log('Database seeded successfully!');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        mongoose.connection.close();
    }
};

seedDatabase();