html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Controller Implementation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Auth Controller Implementation</h1>
        <p class="text-gray-600 mb-6">File: backend/controllers/authController.js</p>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Task: Implement controller logic for login, including user validation and JWT generation</h2>
            
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code class="language-javascript">
// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check if user exists
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

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Create JWT payload
        const payload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        // Generate JWT token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '24h' }
        );

        // Set cookie if using cookies
        if (process.env.USE_COOKIES === 'true') {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });
        }

        // Return success response with token
        return res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token: process.env.USE_COOKIES === 'true' ? undefined : token,
                user: {
                    id: user._id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
const logout = (req, res) => {
    try {
        // Clear cookie if using cookies
        if (process.env.USE_COOKIES === 'true') {
            res.clearCookie('token');
        }

        return res.status(200).json({
            success: true,
            message: 'Logout successful'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

/**
 * @desc    Validate token
 * @route   GET /api/auth/validate
 * @access  Private
 */
const validateToken = (req, res) => {
    try {
        // If middleware passed, token is valid
        return res.status(200).json({
            success: true,
            message: 'Token is valid',
            data: {
                user: req.user
            }
        });
    } catch (error) {
        console.error('Token validation error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = {
    login,
    logout,
    validateToken
};
                </code></pre>
            </div>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h3 class="text-lg font-semibold text-gray-700 mb-3">Key Features Implemented:</h3>
            <ul class="list-disc pl-5 text-gray-600 space-y-2">
                <li>Input validation for email and password</li>
                <li>User existence check</li>
                <li>Password validation using bcrypt</li>
                <li>User active status check</li>
                <li>JWT token generation with configurable expiration</li>
                <li>Cookie-based authentication option</li>
                <li>Proper error handling and responses</li>
                <li>Logout functionality</li>
                <li>Token validation endpoint</li>
                <li>Security best practices (httpOnly cookies, environment variables)</li>
            </ul>
        </div>
    </div>
</body>
</html>