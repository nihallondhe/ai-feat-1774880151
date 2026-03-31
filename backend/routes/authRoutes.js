html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Routes Protection</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .code-block {
            font-family: 'Courier New', monospace;
            tab-size: 2;
        }
        .route-badge {
            font-size: 0.75rem;
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-6">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-blue-400 mb-2">
                <i class="fas fa-shield-alt mr-3"></i>Route Protection Middleware
            </h1>
            <p class="text-gray-400 text-lg">JWT-based authentication middleware for Express.js routes</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="bg-gray-800 px-3 py-1 rounded mr-3">
                    <i class="fas fa-file-code mr-1"></i> backend/routes/authRoutes.js
                </span>
                <span class="bg-gray-800 px-3 py-1 rounded">
                    <i class="fas fa-server mr-1"></i> Express.js Middleware
                </span>
            </div>
        </header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column - Code Implementation -->
            <div class="lg:col-span-2">
                <div class="bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-700">
                    <div class="bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span class="text-gray-300 ml-2 font-mono">authRoutes.js</span>
                        </div>
                        <button class="text-blue-400 hover:text-blue-300 text-sm">
                            <i class="fas fa-copy mr-1"></i> Copy Code
                        </button>
                    </div>
                    
                    <div class="p-6 overflow-x-auto">
                        <pre class="code-block text-sm"><code class="text-gray-300">
<span class="text-blue-400">const</span> express = <span class="text-yellow-400">require</span>(<span class="text-green-400">'express'</span>);
<span class="text-blue-400">const</span> router = express.<span class="text-yellow-400">Router</span>();
<span class="text-blue-400">const</span> jwt = <span class="text-yellow-400">require</span>(<span class="text-green-400">'jsonwebtoken'</span>);

<span class="text-gray-500">// =============================================</span>
<span class="text-gray-500">// AUTHENTICATION MIDDLEWARE</span>
<span class="text-gray-500">// =============================================</span>

<span class="text-blue-400">const</span> <span class="text-yellow-400">authenticateToken</span> = (req, res, next) => {
    <span class="text-gray-500">// Get token from Authorization header</span>
    <span class="text-blue-400">const</span> authHeader = req.<span class="text-yellow-400">headers</span>[<span class="text-green-400">'authorization'</span>];
    <span class="text-blue-400">const</span> token = authHeader && authHeader.<span class="text-yellow-400">split</span>(<span class="text-green-400">' '</span>)[<span class="text-purple-400">1</span>];
    
    <span class="text-blue-400">if</span> (!token) {
        <span class="text-blue-400">return</span> res.<span class="text-yellow-400">status</span>(<span class="text-purple-400">401</span>).<span class="text-yellow-400">json</span>({ 
            error: <span class="text-green-400">'Access denied. No token provided.'</span> 
        });
    }
    
    <span class="text-yellow-400">jwt.verify</span>(token, process.<span class="text-yellow-400">env</span>.<span class="text-yellow-400">JWT_SECRET</span>, (err, user) => {
        <span class="text-blue-400">if</span> (err) {
            <span class="text-blue-400">return</span> res.<span class="text-yellow-400">status</span>(<span class="text-purple-400">403</span>).<span class="text-yellow-400">json</span>({ 
                error: <span class="text-green-400">'Invalid or expired token.'</span> 
            });
        }
        
        <span class="text-gray-500">// Attach user data to request object</span>
        req.<span class="text-yellow-400">user</span> = user;
        <span class="text-yellow-400">next</span>();
    });
};

<span class="text-gray-500">// =============================================</span>
<span class="text-gray-500">// ROLE-BASED AUTHORIZATION MIDDLEWARE</span>
<span class="text-gray-500">// =============================================</span>

<span class="text-blue-400">const</span> <span class="text-yellow-400">authorizeRoles</span> = (...roles) => {
    <span class="text-blue-400">return</span> (req, res, next) => {
        <span class="text-blue-400">if</span> (!req.<span class="text-yellow-400">user</span> || !roles.<span class="text-yellow-400">includes</span>(req.<span class="text-yellow-400">user</span>.<span class="text-yellow-400">role</span>)) {
            <span class="text-blue-400">return</span> res.<span class="text-yellow-400">status</span>(<span class="text-purple-400">403</span>).<span class="text-yellow-400">json</span>({ 
                error: <span class="text-green-400">'Insufficient permissions.'</span> 
            });
        }
        <span class="text-yellow-400">next</span>();
    };
};

<span class="text-gray-500">// =============================================</span>
<span class="text-gray-500">// PROTECTED ROUTES</span>
<span class="text-gray-500">// =============================================</span>

<span class="text-gray-500">// Public route (no authentication required)</span>
router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/public'</span>, (req, res) => {
    res.<span class="text-yellow-400">json</span>({ 
        message: <span class="text-green-400">'This is a public endpoint accessible to everyone.'</span> 
    });
});

<span class="text-gray-500">// Protected route - requires valid JWT token</span>
router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/profile'</span>, <span class="text-yellow-400">authenticateToken</span>, (req, res) => {
    res.<span class="text-yellow-400">json</span>({ 
        message: <span class="text-green-400">'Welcome to your profile!'</span>,
        user: req.<span class="text-yellow-400">user</span>
    });
});

<span class="text-gray-500">// Protected route with role-based authorization</span>
router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/admin/dashboard'</span>, 
    <span class="text-yellow-400">authenticateToken</span>, 
    <span class="text-yellow-400">authorizeRoles</span>(<span class="text-green-400">'admin'</span>, <span class="text-green-400">'superadmin'</span>), 
    (req, res) => {
        res.<span class="text-yellow-400">json</span>({ 
            message: <span class="text-green-400">'Welcome to the admin dashboard!'</span>,
            user: req.<span class="text-yellow-400">user</span>
        });
    }
);

<span class="text-gray-500">// Protected route for specific user actions</span>
router.<span class="text-yellow-400">put</span>(<span class="text-green-400">'/users/:id'</span>, 
    <span class="text-yellow-400">authenticateToken</span>, 
    (req, res) => {
        <span class="text-gray-500">// Users can only update their own profile unless they're admin</span>
        <span class="text-blue-400">if</span> (req.<span class="text-yellow-400">user</span>.<span class="text-yellow-400">id</span> !== req.<span class="text-yellow-400">params</span>.<span class="text-yellow-400">id</span> && req.<span class="text-yellow-400">user</span>.<span class="text-yellow-400">role</span> !== <span class="text-green-400">'admin'</span>) {
            <span class="text-blue-400">return</span> res.<span class="text-yellow-400">status</span>(<span class="text-purple-400">403</span>).<span class="text-yellow-400">json</span>({ 
                error: <span class="text-green-400">'You can only update your own profile.'</span> 
            });
        }
        
        <span class="text-gray-500">// Update logic here...</span>
        res.<span class="text-yellow-400">json</span>({ 
            message: <span class="text-green-400">'User updated successfully.'</span> 
        });
    }
);

<span class="text-gray-500">// Protected route for authenticated users only</span>
router.<span class="text-yellow-400">get</span>(<span class="text-green-400">'/dashboard'</span>, <span class="text-yellow-400">authenticateToken</span>, (req, res) => {
    res.<span class="text-yellow-400">json</span>({ 
        message: <span class="text-green-400">'Welcome to your dashboard!'</span>,
        user: req.<span class="text-yellow-400">user</span>,
        dashboardData: {
            notifications: <span class="text-purple-400">5</span>,
            tasks: <span class="text-purple-400">12</span>,
            messages: <span class="text-purple-400">3</span>
        }
    });
});

<span class="text-blue-400">module</span>.<span class="text-yellow-400">exports</span> = router;
                        </code></pre>
                    </div>
                </div>
            </div>

            <!-- Right Column - Documentation -->
            <div class="space-y-8">
                <!-- Middleware Explanation -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-2xl font-bold text-blue-400 mb-4">
                        <i class="fas fa-cogs mr-2"></i>Middleware Functions
                    </h2>
                    
                    <div class="space-y-6">
                        <div class="bg-gray-900 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold text-green-400 mb-2">
                                <i class="fas fa-user-shield mr-2"></i>authenticateToken
                            </h3>
                            <p class="text-gray-400 text-sm mb-3">Validates JWT tokens from Authorization header.</p>
                            <div class="text-xs text-gray-500 space-y-1">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Extracts token from "Bearer {token}"
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Returns 401 if no token provided
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Returns 403 if token is invalid/expired
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Attaches user data to req.user on success
                                </div>
                            </div>
                        </div>
                        
                        <div class="bg-gray-900 p-4 rounded-lg">
                            <h3 class="text-lg font-semibold text-purple-400 mb-2">
                                <i class="fas fa-user-tag mr-2"></i>authorizeRoles
                            </h3>
                            <p class="text-gray-400 text-sm mb-3">Role-based access control middleware.</p>
                            <div class="text-xs text-gray-500 space-y-1">
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Accepts variable number of allowed roles
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                                    Returns 403 if user role not in allowed list
                                </div>
                                <div class="flex items-center">
                                    <span class="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    Must be used after authenticateToken
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Route Examples -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-2xl font-bold text-yellow-400 mb-4">
                        <i class="fas fa-route mr-2"></i>Protected Routes
                    </h2>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <div>
                                <span class="route-badge bg-green-900 text-green-300 px-2 py-1 rounded mr-2">GET</span>
                                <span class="text-gray-300">/api/auth/public</span>
                            </div>
                            <span class="text-xs text-gray-500">No auth required</span>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <div>
                                <span class="route-badge bg-blue-900 text-blue-300 px-2 py-1 rounded mr-2">GET</span>
                                <span class="text-gray-300">/api/auth/profile</span>
                            </div>
                            <span class="text-xs text-yellow-500">Token required</span>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <div>
                                <span class="route-badge bg-purple-900 text-purple-300 px-2 py-1 rounded mr-2">GET</span>
                                <span class="text-gray-300">/api/auth/admin/dashboard</span>
                            </div>
                            <span class="text-xs text-purple-500">Admin only</span>
                        </div>
                        
                        <div class="flex items-center justify-between p-3 bg-gray-900 rounded">
                            <div>
                                <span class="route-badge bg-yellow-900 text-yellow-300 px-2 py-1 rounded mr-2">PUT</span>
                                <span class="text-gray-300">/api/auth/users/:id</span>
                            </div>
                            <span class="text-xs text-blue-500">Conditional access</span>
                        </div>
                    </div>
                </div>

                <!-- Implementation Notes -->
                <div class="bg-gray-800 rounded-xl p-6 border border-gray-700">
                    <h2 class="text-2xl font-bold text-red-400 mb-4">
                        <i class="fas fa-exclamation-circle mr-2"></i>Implementation Notes
                    </h2>
                    
                    <ul class="space-y-3 text-gray-400">
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                            <span>Store JWT_SECRET in environment variables</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                            <span>Tokens should be sent in Authorization header as "Bearer {token}"</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mt-1 mr-3"></i>
                            <span>Apply middleware to routes that require authentication</span>
                        </li>
                        <li class="flex items-start">
                            <i class="fas fa-check-circle text-green-500 mt
<!-- update 1774961673.2797382 -->