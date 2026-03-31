html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Routes Protection</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <header class="mb-10">
            <h1 class="text-3xl font-bold text-gray-800">Backend Route Protection</h1>
            <p class="text-gray-600 mt-2">Middleware implementation for securing authentication routes</p>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <!-- Code Display Section -->
            <div class="bg-gray-900 rounded-xl p-6 shadow-lg">
                <div class="flex items-center justify-between mb-4">
                    <h2 class="text-xl font-semibold text-white">authRoutes.js</h2>
                    <span class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">Node.js</span>
                </div>
                <pre class="text-gray-300 text-sm overflow-x-auto">
<code>const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.put('/reset-password/:resetToken', authController.resetPassword);

// Protected routes (require authentication)
router.use(protect); // Apply protection middleware to all routes below

router.get('/me', authController.getMe);
router.put('/updatedetails', authController.updateDetails);
router.put('/updatepassword', authController.updatePassword);
router.post('/logout', authController.logout);

// Admin-only routes (require authentication + authorization)
router.use(authorize('admin')); // Apply admin authorization middleware

router.get('/users', authController.getAllUsers);
router.get('/users/:id', authController.getUser);
router.put('/users/:id', authController.updateUser);
router.delete('/users/:id', authController.deleteUser);

module.exports = router;</code>
                </pre>
            </div>

            <!-- Middleware Explanation -->
            <div class="bg-white rounded-xl p-6 shadow-lg">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Middleware Protection</h2>
                
                <div class="space-y-6">
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="font-medium text-gray-700">Protect Middleware</h3>
                        <p class="text-gray-600 text-sm mt-1">Verifies JWT token from Authorization header and attaches user to request object.</p>
                    </div>

                    <div class="border-l-4 border-green-500 pl-4">
                        <h3 class="font-medium text-gray-700">Authorize Middleware</h3>
                        <p class="text-gray-600 text-sm mt-1">Checks user roles and permissions before granting access to specific routes.</p>
                    </div>

                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 class="font-medium text-yellow-800">Route Protection Levels</h4>
                        <ul class="text-sm text-yellow-700 mt-2 space-y-1">
                            <li>• Public: No authentication required</li>
                            <li>• Protected: Valid JWT token required</li>
                            <li>• Admin: Admin role required</li>
                        </ul>
                    </div>

                    <div class="bg-gray-100 rounded-lg p-4">
                        <h4 class="font-medium text-gray-700">Implementation Notes</h4>
                        <ul class="text-sm text-gray-600 mt-2 space-y-1">
                            <li>• Use router.use() for applying middleware to multiple routes</li>
                            <li>• Order matters - middleware executes sequentially</li>
                            <li>• Combine protect and authorize for role-based access</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Route Examples -->
        <div class="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <h2 class="text-xl font-semibold text-gray-800 mb-4">Route Examples</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <div class="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span class="font-medium text-gray-700">Public Route</span>
                    </div>
                    <p class="text-sm text-gray-600">POST /api/auth/login</p>
                    <p class="text-xs text-gray-500 mt-1">No token required</p>
                </div>

                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span class="font-medium text-gray-700">Protected Route</span>
                    </div>
                    <p class="text-sm text-gray-600">GET /api/auth/me</p>
                    <p class="text-xs text-gray-500 mt-1">Valid JWT required</p>
                </div>

                <div class="border rounded-lg p-4">
                    <div class="flex items-center mb-2">
                        <div class="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                        <span class="font-medium text-gray-700">Admin Route</span>
                    </div>
                    <p class="text-sm text-gray-600">GET /api/auth/users</p>
                    <p class="text-xs text-gray-500 mt-1">Admin role required</p>
                </div>
            </div>
        </div>

        <footer class="mt-10 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>Middleware-based route protection for secure authentication system</p>
        </footer>
    </div>
</body>
</html>
<!-- update 1774960425.3766453 -->