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
            <h1 class="text-3xl font-bold text-blue-400">Token Validation Middleware</h1>
            <p class="text-gray-400 mt-2">Backend authentication middleware for JWT validation</p>
        </header>

        <div class="bg-gray-800 rounded-lg shadow-xl overflow-hidden mb-8">
            <div class="bg-gray-700 px-4 py-3 border-b border-gray-600">
                <div class="flex items-center">
                    <div class="flex space-x-2 mr-4">
                        <div class="w-3 h-3 rounded-full bg-red-500"></div>
                        <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <span class="text-sm font-mono text-gray-300">backend/middleware/authMiddleware.js</span>
                </div>
            </div>
            
            <div class="p-0">
                <pre class="text-sm font-mono overflow-x-auto p-6">
<code class="text-gray-300"><span class="text-blue-400">const</span> jwt = <span class="text-yellow-400">require</span>(<span class="text-green-400">'jsonwebtoken'</span>);
<span class="text-blue-400">const</span> User = <span class="text-yellow-400">require</span>(<span class="text-green-400">'../models/User'</span>);

<span class="text-gray-500">/**
 * Token validation middleware
 * Verifies JWT tokens from Authorization header
 */</span>
<span class="text-blue-400">const</span> authMiddleware = <span class="text-yellow-400">async</span> (req, res, next) => {
    <span class="text-blue-400">try</span> {
        <span class="text-gray-500">// Get token from Authorization header</span>
        <span class="text-blue-400">const</span> authHeader = req.headers.authorization;
        
        <span class="text-blue-400">if</span> (!authHeader || !authHeader.startsWith(<span class="text-green-400">'Bearer '</span>)) {
            <span class="text-blue-400">return</span> res.status(<span class="text-purple-400">401</span>).json({
                success: <span class="text-blue-400">false</span>,
                message: <span class="text-green-400">'No token provided or invalid format'</span>
            });
        }

        <span class="text-blue-400">const</span> token = authHeader.split(<span class="text-green-400">' '</span>)[<span class="text-purple-400">1</span>];

        <span class="text-gray-500">// Verify token</span>
        <span class="text-blue-400">const</span> decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        <span class="text-gray-500">// Find user by ID from token payload</span>
        <span class="text-blue-400">const</span> user = <span class="text-yellow-400">await</span> User.findById(decoded.userId).select(<span class="text-green-400">'-password'</span>);
        
        <span class="text-blue-400">if</span> (!user) {
            <span class="text-blue-400">return</span> res.status(<span class="text-purple-400">401</span>).json({
                success: <span class="text-blue-400">false</span>,
                message: <span class="text-green-400">'User not found'</span>
            });
        }

        <span class="text-gray-500">// Check if user is active</span>
        <span class="text-blue-400">if</span> (!user.isActive) {
            <span class="text-blue-400">return</span> res.status(<span class="text-purple-400">403</span>).json({
                success: <span class="text-blue-400">false</span>,
                message: <span class="text-green-400">'Account is deactivated'</span>
            });
        }

        <span class="text-gray-500">// Attach user to request object</span>
        req.user = user;
        
        <span class="text-gray-500">// Proceed to next middleware/route handler</span>
        next();
        
    } <span class="text-blue-400">catch</span> (error) {
        <span class="text-blue-400">let</span> message = <span class="text-green-400">'Authentication failed'</span>;
        <span class="text-blue-400">let</span> statusCode = <span class="text-purple-400">401</span>;

        <span class="text-blue-400">if</span> (error.name === <span class="text-green-400">'JsonWebTokenError'</span>) {
            message = <span class="text-green-400">'Invalid token'</span>;
        } <span class="text-blue-400">else</span> <span class="text-blue-400">if</span> (error.name === <span class="text-green-400">'TokenExpiredError'</span>) {
            message = <span class="text-green-400">'Token has expired'</span>;
            statusCode = <span class="text-purple-400">403</span>;
        } <span class="text-blue-400">else</span> <span class="text-blue-400">if</span> (error.name === <span class="text-green-400">'NotBeforeError'</span>) {
            message = <span class="text-green-400">'Token not yet active'</span>;
        }

        <span class="text-blue-400">return</span> res.status(statusCode).json({
            success: <span class="text-blue-400">false</span>,
            message,
            error: process.env.NODE_ENV === <span class="text-green-400">'development'</span> ? error.message : <span class="text-blue-400">undefined</span>
        });
    }
};

<span class="text-gray-500">/**
 * Optional: Role-based access control middleware
 * @param {...string} allowedRoles - Roles permitted to access the route
 */</span>
<span class="text-blue-400">const</span> authorize = (...allowedRoles) => {
    <span class="text-blue-400">return</span> (req, res, next) => {
        <span class="text-blue-400">if</span> (!req.user) {
            <span class="text-blue-400">return</span> res.status(<span class="text-purple-400">401</span>).json({
                success: <span class="text-blue-400">false</span>,
                message: <span class="text-green-400">'User not authenticated'</span>
            });
        }

        <span class="text-blue-400">if</span> (!allowedRoles.includes(req.user.role)) {
            <span class="text-blue-400">return</span> res.status(<span class="text-purple-400">403</span>).json({
                success: <span class="text-blue-400">false</span>,
                message: <span class="text-green-400">'Insufficient permissions'</span>
            });
        }

        next();
    };
};

module.exports = { authMiddleware, authorize };</code>
                </pre>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-blue-400 mb-4">Middleware Features</h2>
                <ul class="space-y-3">
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>Bearer token extraction from Authorization header</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>JWT verification with secret key</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>User lookup and validation</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>Account active status check</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>Comprehensive error handling</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-400 mr-2">✓</span>
                        <span>Role-based authorization helper</span>
                    </li>
                </ul>
            </div>

            <div class="bg-gray-800 rounded-lg p-6">
                <h2 class="text-xl font-bold text-blue-400 mb-4">Usage Example</h2>
                <pre class="text-sm font-mono bg-gray-900 p-4 rounded overflow-x-auto">
<span class="text-gray-500">// In your routes file:</span>
<span class="text-blue-400">const</span> { authMiddleware, authorize } = <span class="text-yellow-400">require</span>(<span class="text-green-400">'./middleware/authMiddleware'</span>);

<span class="text-gray-500">// Protected route</span>
router.get(<span class="text-green-400">'/profile'</span>, authMiddleware, getUserProfile);

<span class="text-gray-500">// Admin-only route</span>
router.get(<span class="text-green-400">'/admin/users'</span>, 
    authMiddleware, 
    authorize(<span class="text-green-400">'admin'</span>, <span class="text-green-400">'superadmin'</span>), 
    getUsers
);</pre>
            </div>
        </div>

        <footer class="mt-8 pt-6 border-t border-gray-700 text-center text-gray-500 text-sm">
            <p>Token Validation Middleware • Backend Authentication • JWT Security</p>
        </footer>
    </div>
</body>
</html>
<!-- update 1774961672.6726418 -->