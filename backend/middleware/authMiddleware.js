html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Middleware Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500;600&display=swap" rel="stylesheet">
    <style>
        .code-font {
            font-family: 'Fira Code', monospace;
        }
        .scrollbar-thin {
            scrollbar-width: thin;
            scrollbar-color: #4B5563 #1F2937;
        }
        .scrollbar-thin::-webkit-scrollbar {
            width: 8px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
            background: #1F2937;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #4B5563;
            border-radius: 4px;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-blue-400 mb-2">
                <i class="fas fa-shield-alt mr-3"></i>JWT Authentication Middleware
            </h1>
            <p class="text-gray-400 text-lg">Middleware to verify JWT tokens for protected routes in Node.js/Express applications</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="mr-4"><i class="fas fa-folder mr-1"></i> backend/middleware/authMiddleware.js</span>
                <span><i class="fas fa-code mr-1"></i> Node.js / Express</span>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Main Content -->
            <div class="lg:col-span-2">
                <!-- Code Block -->
                <div class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-2xl mb-8">
                    <div class="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span class="text-gray-300 ml-2 code-font">authMiddleware.js</span>
                        </div>
                        <button id="copyBtn" class="text-gray-400 hover:text-blue-400 transition">
                            <i class="far fa-copy mr-1"></i> Copy
                        </button>
                    </div>
                    <div class="p-6 overflow-x-auto scrollbar-thin">
                        <pre id="codeBlock" class="code-font text-sm text-gray-300 leading-relaxed">
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication Middleware
 * Verifies JWT tokens for protected routes
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
const authMiddleware = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.header('Authorization');
        
        // Check if token exists
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        // Extract token from header
        const token = authHeader.replace('Bearer ', '');

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Find user by ID from decoded token
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Token is invalid.'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is deactivated.'
            });
        }

        // Attach user to request object
        req.user = user;
        req.token = token;

        // Proceed to next middleware/route handler
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);

        // Handle specific JWT errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired.'
            });
        }

        // Generic error response
        return res.status(500).json({
            success: false,
            message: 'Authentication failed.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

/**
 * Optional: Role-based authorization middleware
 * Use after authMiddleware to check user roles
 * 
 * @param {...String} roles - Allowed roles
 * @returns {Function} Middleware function
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated.'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Role ${req.user.role} is not authorized to access this resource.`
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };</pre>
                    </div>
                </div>

                <!-- Usage Example -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 class="text-2xl font-bold text-green-400 mb-4">
                        <i class="fas fa-code mr-2"></i>Usage Example
                    </h2>
                    <div class="bg-gray-900 rounded-lg p-4 mb-4 code-font text-sm">
                        <p class="text-gray-400">// In your route files (e.g., routes/userRoutes.js)</p>
                        <p class="text-blue-400">const</p> <span class="text-gray-300">{ authMiddleware, authorize }</span> <span class="text-blue-400">= require</span><span class="text-gray-300">(</span><span class="text-yellow-300">'../middleware/authMiddleware'</span><span class="text-gray-300">);</span><br><br>
                        
                        <p class="text-gray-400">// Apply to individual routes</p>
                        <p class="text-gray-300">router.</p><span class="text-yellow-300">get</span><span class="text-gray-300">(</span><span class="text-yellow-300">'/profile'</span><span class="text-gray-300">, authMiddleware, getUserProfile);</span><br><br>
                        
                        <p class="text-gray-400">// Apply to multiple routes</p>
                        <p class="text-gray-300">router.</p><span class="text-yellow-300">use</span><span class="text-gray-300">(authMiddleware);</span><br>
                        <p class="text-gray-300">router.</p><span class="text-yellow-300">get</span><span class="text-gray-300">(</span><span class="text-yellow-300">'/dashboard'</span><span class="text-gray-300">, getDashboard);</span><br><br>
                        
                        <p class="text-gray-400">// Role-based authorization</p>
                        <p class="text-gray-300">router.</p><span class="text-yellow-300">get</span><span class="text-gray-300">(</span><span class="text-yellow-300">'/admin'</span><span class="text-gray-300">, authMiddleware, authorize(</span><span class="text-yellow-300">'admin'</span><span class="text-gray-300">, </span><span class="text-yellow-300">'superadmin'</span><span class="text-gray-300">), getAdminData);</span>
                    </div>
                </div>
            </div>

            <!-- Sidebar -->
            <div class="lg:col-span-1">
                <!-- Features -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h3 class="text-xl font-bold text-purple-400 mb-4">
                        <i class="fas fa-star mr-2"></i>Features
                    </h3>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>JWT token verification</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>Bearer token extraction</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>User validation from database</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>Error handling for expired/invalid tokens</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>Role-based authorization (optional)</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check text-green-400 mt-1 mr-3"></i>
                            <span>User status checking (active/inactive)</span>
                        </li>
                    </ul>
                </div>

                <!-- Dependencies -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
                    <h3 class="text-xl font-bold text-yellow-400 mb-4">
                        <i class="fas fa-box mr-2"></i>Dependencies
                    </h3>
                    <div class="space-y-2">
                        <div class="flex justify-between items-center p-3 bg-gray-900 rounded">
                            <span class="code-font">jsonwebtoken</span>
                            <span class="text-green-400 text-sm">^9.0.0</span>
                        </div>
                        <div class="flex justify-between items-center p-3 bg-gray-900 rounded">
                            <span class="code-font">User Model</span>
                            <span class="text-blue-400 text-sm">../models/User</span>
                        </div>
                    </div>
                </div>

                <!-- Environment Variables -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h3 class="text-xl font-bold text-red-400 mb-4">
                        <i class="fas fa-cog mr-2"></i>Environment Variables
                    </h3>
                    <div class="space-y-3">
                        <div class="p-3 bg-gray-900 rounded code-font">
                            <p class="text-gray-400 text-sm">JWT_SECRET=</p>
                            <p class="text-yellow-300">your-super-secret-jwt-key-change-this</p>
                        </div>
                        <p class="text-gray-400 text-sm">Set a strong secret key in your .env file for production</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>Middleware for Express.js applications | JWT Authentication | Protected Routes</p>
            <p class="mt-2">Ensure you have proper error handling and logging in production</p>
        </footer>
    </div>

    <script>
        // Copy code functionality
        document.getElementById('copyBtn').addEventListener('click', function() {
            const code = document.getElementById('codeBlock').textContent;
            navigator.clipboard.writeText(code).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
                this.classList.add('text-green-400');
                
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('text-green-400');
                }, 2000);
            });
        });

        // Syntax highlighting simulation
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlock = document.getElementById('codeBlock');
            const lines = codeBlock.innerHTML.split('\n');
            
            // Simple syntax highlighting simulation
            codeBlock.innerHTML = lines.map(line => {
                if (line.includes('//')) {
                    const parts = line.split('//');
                    return `${parts[0]}<span class="text-gray-500">//${parts[1]}</span>`;
                }
                return line;
            }).join('\n');
        });
    </script>
</body>
</html>