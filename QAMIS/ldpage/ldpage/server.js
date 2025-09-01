const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
module.exports = app; // Export the app for serverless functions
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'YOUR_MONGODB_CONNECTION_STRING_HERE';
let db;

async function connectToDatabase() {
    if (!MONGODB_URI || MONGODB_URI === 'YOUR_MONGODB_CONNECTION_STRING_HERE' || MONGODB_URI.includes('username:password')) {
        console.warn('⚠️  MONGODB_URI is not set or using placeholder values. Running without database connection.');
        console.log('✅ Server is running in demo mode with sample data.');
        return; // Continue without database for testing
    }

    console.log('Attempting to connect to MongoDB...');
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db('qamis-shop');
        console.log('✅ Connected to MongoDB successfully!');
        
        // Ensure collections exist
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(c => c.name);
        
        if (!collectionNames.includes('users')) {
            await db.createCollection('users');
            console.log('Created "users" collection.');
        }
        if (!collectionNames.includes('products')) {
            await db.createCollection('products');
            console.log('Created "products" collection.');
        }
        if (!collectionNames.includes('orders')) {
            await db.createCollection('orders');
            console.log('Created "orders" collection.');
        }
        
        console.log('✅ Database collections verified!');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        process.exit(1); // Exit on connection failure
    }
}

// JWT Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

// API Routes

// Email/Password Registration
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            authType: 'email'
        };
        
        const result = await db.collection('users').insertOne(user);
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: result.insertedId, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'User registered successfully',
            token,
            user: {
                id: result.insertedId,
                name,
                email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
});

// Email/Password Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = await db.collection('users').findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        
        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});
app.get('/api/products', async (req, res) => {
    try {
        if (!db) {
            // Return sample products if no database connection
            const sampleProducts = [
                {
                    id: 1,
                    name: "قميص",
                    description: "قميص عالي الجودة مع مميزات رائعة",
                    price: "2500DA",
                    category: "clothing",
                    image: "https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=قميص"
                }
            ];
            return res.json(sampleProducts);
        }
        const products = await db.collection('products').find({}).toArray();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Add new product
app.post('/api/products', async (req, res) => {
    try {
        const result = await db.collection('products').insertOne(req.body);
        res.json({ id: result.insertedId, message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add product' });
    }
});

// Get user by Google ID
app.get('/api/users/:googleId', async (req, res) => {
    try {
        const user = await db.collection('users').findOne({ googleId: req.params.googleId });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user' });
    }
});

// Create or update user
app.post('/api/users', async (req, res) => {
    try {
        const { googleId, name, email, picture } = req.body;
        const result = await db.collection('users').updateOne(
            { googleId },
            { 
                $set: { 
                    name, 
                    email, 
                    picture, 
                    lastLogin: new Date() 
                } 
            },
            { upsert: true }
        );
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// Create order
app.post('/api/orders', async (req, res) => {
    try {
        const order = {
            ...req.body,
            createdAt: new Date(),
            status: 'pending'
        };
        const result = await db.collection('orders').insertOne(order);
        res.json({ id: result.insertedId, message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    await connectToDatabase();
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down server...');
    process.exit(0);
});