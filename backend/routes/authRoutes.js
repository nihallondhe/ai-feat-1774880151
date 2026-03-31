html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Routes Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-blue-700">Express Auth Routes Implementation</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-4">File: backend/routes/authRoutes.js</h2>
            <p class="mb-4 text-gray-600">This file defines Express routes for authentication, including a login endpoint that validates credentials and returns a JWT token.</p>
            
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code class="language-javascript">
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Assuming you have a User model

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Return success response with token
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error during authentication' 
        });
    }
});

// Optional: Token verification endpoint
router.post('/verify', (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'your-secret-key'
        );
        
        res.status(200).json({
            success: true,
            message: 'Token is valid',
            user: decoded
        });
    } catch (error) {
        res.status(401).json({ 
            success: false, 
            message: 'Invalid or expired token' 
        });
    }
});

module.exports = router;
                </code></pre>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-xl font-semibold mb-3">Implementation Notes:</h3>
            <ul class="list-disc pl-5 space-y-2 text-gray-600">
                <li>Requires <code class="bg-gray-100 px-1 rounded">jsonwebtoken</code>, <code class="bg-gray-100 px-1 rounded">bcryptjs</code>, and <code class="bg-gray-100 px-1 rounded">express</code> packages</li>
                <li>Assumes a User model with email, password (hashed), name, and role fields</li>
                <li>Uses environment variable <code class="bg-gray-100 px-1 rounded">JWT_SECRET</code> for token signing</li>
                <li>Includes input validation and error handling</li>
                <li>Returns user information (excluding password) in the response</li>
                <li>Token expires in 24 hours (configurable)</li>
            </ul>
        </div>
    </div>
</body>
</html>