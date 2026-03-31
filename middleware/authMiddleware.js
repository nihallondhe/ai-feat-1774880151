html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Auth Middleware</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;600&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Source Code Pro', monospace; }
        .code-block { font-family: 'Source Code Pro', monospace; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="mb-8">
            <h1 class="text-3xl md:text-4xl font-bold text-blue-400 mb-2">
                <i class="fas fa-shield-alt mr-3"></i>JWT Authentication Middleware
            </h1>
            <p class="text-gray-400">Middleware to verify JWT tokens on protected API routes</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="bg-gray-800 px-3 py-1 rounded mr-3">
                    <i class="fas fa-file mr-1"></i>middleware/authMiddleware.js
                </span>
                <span class="bg-gray-800 px-3 py-1 rounded">
                    <i class="fas fa-server mr-1"></i>Node.js/Express
                </span>
            </div>
        </header>

        <!-- Main Content -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Code Section -->
            <div class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-xl font-semibold text-green-400">
                        <i class="fas fa-code mr-2"></i>Middleware Implementation
                    </h2>
                    <button onclick="copyCode()" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition">
                        <i class="fas fa-copy mr-1"></i>Copy Code
                    </button>
                </div>
                
                <div class="bg-black rounded-lg p-4 overflow-x-auto">
                    <pre id="code" class="code-block text-sm text-gray-300">
// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Verifies JWT tokens on protected API routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.',
            error: 'MISSING_TOKEN'
        });
    }

    // Extract token from header
    const token = authHeader.split(' ')[1];

    try {
        // Verify token using secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user data to request object
        req.user = decoded;
        
        // Proceed to next middleware/route handler
        next();
    } catch (error) {
        // Handle different JWT errors
        let errorMessage = 'Invalid token';
        let errorType = 'INVALID_TOKEN';
        
        if (error.name === 'TokenExpiredError') {
            errorMessage = 'Token has expired';
            errorType = 'TOKEN_EXPIRED';
        } else if (error.name === 'JsonWebTokenError') {
            errorMessage = 'Malformed token';
            errorType = 'MALFORMED_TOKEN';
        }

        return res.status(401).json({
            success: false,
            message: errorMessage,
            error: errorType,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Optional: Role-based authorization middleware
 * @param {Array} allowedRoles - Array of roles permitted to access the route
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
                message: 'Insufficient permissions to access this resource',
                userRole: req.user.role,
                requiredRoles: allowedRoles
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorizeRoles };</pre>
                </div>
                
                <div class="mt-6 p-4 bg-gray-700 rounded-lg">
                    <h3 class="text-lg font-semibold text-yellow-400 mb-2">
                        <i class="fas fa-info-circle mr-2"></i>Usage Example
                    </h3>
                    <pre class="text-sm text-gray-300">
// In your route file (e.g., routes/protected.js)
const express = require('express');
const router = express.Router();
const { authMiddleware, authorizeRoles } = require('../middleware/authMiddleware');

// Apply to single route
router.get('/profile', authMiddleware, (req, res) => {
    res.json({
        success: true,
        user: req.user,
        message: 'Protected route accessed successfully'
    });
});

// Apply to multiple routes
router.use('/admin', authMiddleware, authorizeRoles('admin', 'superadmin'));

// Apply to all routes in this router
router.use(authMiddleware);</pre>
                </div>
            </div>

            <!-- Documentation Section -->
            <div class="space-y-6">
                <!-- Features Card -->
                <div class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                    <h2 class="text-xl font-semibold text-purple-400 mb-4">
                        <i class="fas fa-star mr-2"></i>Key Features
                    </h2>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span><strong>Token Validation:</strong> Verifies JWT signature and expiration</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span><strong>Error Handling:</strong> Differentiates between expired, malformed, and missing tokens</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span><strong>Role-Based Authorization:</strong> Optional middleware for role-based access control</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span><strong>Environment Aware:</strong> Shows error details only in development mode</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span><strong>Standard Compliant:</strong> Uses Bearer token format (Authorization: Bearer &lt;token&gt;)</span>
                        </li>
                    </ul>
                </div>

                <!-- Installation Card -->
                <div class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                    <h2 class="text-xl font-semibold text-red-400 mb-4">
                        <i class="fas fa-download mr-2"></i>Prerequisites
                    </h2>
                    <div class="space-y-4">
                        <div>
                            <h3 class="font-semibold text-gray-300 mb-2">Required Packages:</h3>
                            <pre class="bg-black p-3 rounded text-sm text-gray-300">
npm install jsonwebtoken express</pre>
                        </div>
                        <div>
                            <h3 class="font-semibold text-gray-300 mb-2">Environment Variables (.env):</h3>
                            <pre class="bg-black p-3 rounded text-sm text-gray-300">
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development</pre>
                        </div>
                    </div>
                </div>

                <!-- Error Types Card -->
                <div class="bg-gray-800 rounded-xl p-6 shadow-2xl">
                    <h2 class="text-xl font-semibold text-orange-400 mb-4">
                        <i class="fas fa-exclamation-triangle mr-2"></i>Error Responses
                    </h2>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-700 rounded">
                            <span class="font-semibold text-red-400">401 - MISSING_TOKEN</span>
                            <p class="text-sm text-gray-400">When Authorization header is missing or doesn't start with "Bearer "</p>
                        </div>
                        <div class="p-3 bg-gray-700 rounded">
                            <span class="font-semibold text-red-400">401 - TOKEN_EXPIRED</span>
                            <p class="text-sm text-gray-400">When JWT token has expired</p>
                        </div>
                        <div class="p-3 bg-gray-700 rounded">
                            <span class="font-semibold text-red-400">401 - MALFORMED_TOKEN</span>
                            <p class="text-sm text-gray-400">When token is invalid or tampered with</p>
                        </div>
                        <div class="p-3 bg-gray-700 rounded">
                            <span class="font-semibold text-red-400">403 - INSUFFICIENT_PERMISSIONS</span>
                            <p class="text-sm text-gray-400">When user role doesn't match required roles (authorizeRoles middleware)</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>JWT Authentication Middleware for Express.js | Secure your API endpoints with token-based authentication</p>
            <p class="mt-2">Middleware attaches user data to <code class="bg-gray-800 px-2 py-1 rounded">req.user</code> for use in subsequent route handlers</p>
        </footer>
    </div>

    <script>
        function copyCode() {
            const codeElement = document.getElementById('code');
            const textArea = document.createElement('textarea');
            textArea.value = codeElement.textContent;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            // Visual feedback
            const button = event.currentTarget;
            const originalHTML = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check mr-1"></i>Copied!';
            button.classList.remove('bg-blue-600');
            button.classList.add('bg-green-600');
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.classList.remove('bg-green-600');
                button.classList.add('bg-blue-600');
            }, 2000);
        }
    </script>
</body>
</html>
<!-- update 1774955256.8095682 -->