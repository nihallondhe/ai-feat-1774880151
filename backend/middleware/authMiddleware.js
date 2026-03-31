html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Token Validation Middleware</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-blue-400 mb-2">Token Validation Middleware</h1>
            <p class="text-gray-400">Middleware for validating JWT tokens in Express.js backend</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- File Structure -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-green-400 mb-4">File Structure</h2>
                <div class="space-y-2">
                    <div class="flex items-center text-gray-300">
                        <span class="mr-2">📁</span>
                        <span>backend/</span>
                    </div>
                    <div class="flex items-center text-gray-300 ml-4">
                        <span class="mr-2">📁</span>
                        <span>middleware/</span>
                    </div>
                    <div class="flex items-center text-gray-300 ml-8">
                        <span class="mr-2">📄</span>
                        <span class="text-blue-300">authMiddleware.js</span>
                    </div>
                </div>
            </div>

            <!-- Middleware Info -->
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-semibold text-yellow-400 mb-4">Middleware Purpose</h2>
                <ul class="space-y-2 text-gray-300">
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        Validates JWT tokens from Authorization header
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        Protects routes from unauthorized access
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        Attaches user data to request object
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        Handles token expiration and errors
                    </li>
                </ul>
            </div>
        </div>

        <!-- Code Implementation -->
        <div class="mt-6 bg-gray-800 rounded-lg overflow-hidden">
            <div class="bg-gray-900 px-6 py-3 border-b border-gray-700">
                <div class="flex items-center">
                    <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span class="text-gray-400 ml-2">backend/middleware/authMiddleware.js</span>
                </div>
            </div>
            <pre class="p-6 overflow-x-auto text-sm">
<code class="text-gray-300">
const jwt = require('jsonwebtoken');

/**
 * Token validation middleware for Express.js
 * Validates JWT tokens from Authorization header
 */
const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'No token provided or invalid format'
        });
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.split(' ')[1];

    try {
        // Verify token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        
        // Attach user data to request object
        req.user = decoded;
        
        // Continue to next middleware/route handler
        next();
    } catch (error) {
        // Handle different JWT errors
        let message = 'Invalid token';
        let statusCode = 401;

        if (error.name === 'TokenExpiredError') {
            message = 'Token has expired';
            statusCode = 401;
        } else if (error.name === 'JsonWebTokenError') {
            message = 'Invalid token signature';
            statusCode = 403;
        }

        return res.status(statusCode).json({
            success: false,
            message: message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Optional: Role-based authorization middleware
 * @param {Array} allowedRoles - Array of allowed roles
 */
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient permissions'
            });
        }

        next();
    };
};

module.exports = {
    authMiddleware,
    authorizeRoles
};
</code>
            </pre>
        </div>

        <!-- Usage Example -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-purple-400 mb-4">Usage Example</h2>
            <pre class="bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
<code class="text-gray-300">
// In your Express route file (e.g., routes/protected.js)
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Apply middleware to all routes in this router
router.use(authMiddleware);

// Protected route - requires valid token
router.get('/profile', (req, res) => {
    res.json({
        success: true,
        user: req.user
    });
});

// Route with role-based authorization
router.get('/admin', 
    authorizeRoles('admin', 'superadmin'),
    (req, res) => {
        res.json({
            success: true,
            message: 'Welcome admin!'
        });
    }
);

module.exports = router;
</code>
            </pre>
        </div>

        <!-- Dependencies -->
        <div class="mt-6 bg-gray-800 rounded-lg p-6">
            <h2 class="text-xl font-semibold text-orange-400 mb-4">Required Dependencies</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="font-semibold text-blue-300 mb-2">jsonwebtoken</h3>
                    <p class="text-gray-400 text-sm">For creating and verifying JWT tokens</p>
                    <code class="text-green-400 text-sm">npm install jsonwebtoken</code>
                </div>
                <div class="bg-gray-900 p-4 rounded-lg">
                    <h3 class="font-semibold text-blue-300 mb-2">dotenv (optional)</h3>
                    <p class="text-gray-400 text-sm">For environment variables</p>
                    <code class="text-green-400 text-sm">npm install dotenv</code>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
<!-- update 1774960424.4742005 -->