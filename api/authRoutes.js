html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Routes Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .code-block {
            font-family: 'Courier New', monospace;
            background-color: #1e293b;
            border-radius: 0.5rem;
            overflow-x: auto;
        }
        .endpoint-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
        }
        .method-get { background-color: #10b981; }
        .method-post { background-color: #3b82f6; }
        .method-delete { background-color: #ef4444; }
        pre {
            margin: 0;
            padding: 1rem;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .copy-btn {
            transition: all 0.2s ease;
        }
        .copy-btn:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-4 md:p-8">
    <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-blue-400 mb-2">
                <i class="fas fa-key mr-3"></i>Authentication Routes API
            </h1>
            <p class="text-gray-400 text-lg">Express.js routes for user authentication, token validation, and logout functionality</p>
            <div class="mt-4 p-4 bg-gray-800 rounded-lg border-l-4 border-blue-500">
                <p class="text-sm"><span class="font-semibold">File:</span> <code class="bg-gray-700 px-2 py-1 rounded">api/authRoutes.js</code></p>
                <p class="text-sm mt-1"><span class="font-semibold">Framework:</span> Express.js with JWT authentication</p>
            </div>
        </header>

        <!-- Main Content -->
        <main>
            <!-- Routes Overview -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">
                    <i class="fas fa-route mr-2"></i>Available Routes
                </h2>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Login Route -->
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-colors">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-bold text-white">Login</h3>
                            <span class="endpoint-badge method-post text-white font-bold">POST</span>
                        </div>
                        <p class="text-gray-300 mb-4">Authenticate user credentials and return a JWT token.</p>
                        <div class="mb-4">
                            <span class="text-sm font-semibold text-gray-400">Endpoint:</span>
                            <code class="ml-2 text-blue-300">/api/auth/login</code>
                        </div>
                        <div class="text-sm text-gray-400">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>Email & password validation
                        </div>
                        <div class="text-sm text-gray-400 mt-1">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>JWT token generation
                        </div>
                    </div>
                    
                    <!-- Validate Token Route -->
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500 transition-colors">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-bold text-white">Validate Token</h3>
                            <span class="endpoint-badge method-get text-white font-bold">GET</span>
                        </div>
                        <p class="text-gray-300 mb-4">Verify the validity of a JWT token and return user data.</p>
                        <div class="mb-4">
                            <span class="text-sm font-semibold text-gray-400">Endpoint:</span>
                            <code class="ml-2 text-blue-300">/api/auth/validate</code>
                        </div>
                        <div class="text-sm text-gray-400">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>Token verification
                        </div>
                        <div class="text-sm text-gray-400 mt-1">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>User data extraction
                        </div>
                    </div>
                    
                    <!-- Logout Route -->
                    <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500 transition-colors">
                        <div class="flex items-center justify-between mb-4">
                            <h3 class="text-xl font-bold text-white">Logout</h3>
                            <span class="endpoint-badge method-delete text-white font-bold">DELETE</span>
                        </div>
                        <p class="text-gray-300 mb-4">Invalidate user token and clear authentication state.</p>
                        <div class="mb-4">
                            <span class="text-sm font-semibold text-gray-400">Endpoint:</span>
                            <code class="ml-2 text-blue-300">/api/auth/logout</code>
                        </div>
                        <div class="text-sm text-gray-400">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>Token blacklisting
                        </div>
                        <div class="text-sm text-gray-400 mt-1">
                            <i class="fas fa-check-circle text-green-400 mr-2"></i>Session cleanup
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Code Implementation -->
            <section class="mb-12">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold text-white pb-2 border-b border-gray-700">
                        <i class="fas fa-code mr-2"></i>Route Implementation
                    </h2>
                    <button id="copyAllBtn" class="copy-btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center">
                        <i class="fas fa-copy mr-2"></i> Copy All Code
                    </button>
                </div>
                
                <div class="code-block mb-8">
                    <div class="flex justify-between items-center bg-gray-800 px-4 py-3 rounded-t-lg">
                        <div class="flex items-center">
                            <div class="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                            <span class="text-gray-300 font-medium">api/authRoutes.js</span>
                        </div>
                        <button id="copyCodeBtn" class="copy-btn text-gray-400 hover:text-white">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <pre id="codeContent" class="text-gray-200 text-sm md:text-base">
// api/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock user database (in production, use a real database)
const users = [
    {
        id: 1,
        email: 'user@example.com',
        // Password: "password123" (hashed)
        password: '$2a$10$XyZABc7dR1O2H3I4jK5lM.6N7O8P9Q0R1S2T3U4V5W6X7Y8Z9A0B1C2D3E4F',
        name: 'John Doe',
        role: 'user'
    }
];

// JWT secret (in production, use environment variable)
const JWT_SECRET = 'your-super-secret-jwt-key-change-this-in-production';
const tokenBlacklist = new Set();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
        return res.status(401).json({ error: 'Token has been invalidated' });
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// POST /api/auth/login - User login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ 
                error: 'Email and password are required' 
            });
        }
        
        // Find user by email
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ 
                error: 'Invalid credentials' 
            });
        }
        
        // Create JWT token
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email, 
                name: user.name,
                role: user.role 
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        // Return success response with token
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            error: 'Internal server error during authentication' 
        });
    }
});

// GET /api/auth/validate - Validate token
router.get('/validate', authenticateToken, (req, res) => {
    try {
        // Token is already validated by middleware
        // Return user information from the token
        res.json({
            valid: true,
            user: req.user,
            message: 'Token is valid'
        });
    } catch (error) {
        console.error('Token validation error:', error);
        res.status(500).json({ 
            error: 'Internal server error during token validation' 
        });
    }
});

// DELETE /api/auth/logout - User logout
router.delete('/logout', authenticateToken, (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        if (token) {
            // Add token to blacklist
            tokenBlacklist.add(token);
            
            // Optional: Set expiration for blacklist entry (e.g., 24 hours)
            setTimeout(() => {
                tokenBlacklist.delete(token);
            }, 24 * 60 * 60 * 1000);
        }
        
        res.json({
            message: 'Logout successful',
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            error: 'Internal server error during logout' 
        });
    }
});

module.exports = router;</pre>
                </div>
                
                <!-- Installation & Usage -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div class="bg-gray-800 p-6 rounded-xl">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-box-open mr-2"></i>Required Dependencies
                        </h3>
                        <div class="code-block">
                            <pre class="text-green-400">
npm install express jsonwebtoken bcryptjs</pre>
                        </div>
                        <p class="text-gray-400 mt-4 text-sm">Install these packages before using the auth routes.</p>
                    </div>
                    
                    <div class="bg-gray-800 p-6 rounded-xl">
                        <h3 class="text-xl font-bold text-white mb-4">
                            <i class="fas fa-cogs mr-2"></i>Server Integration
                        </h3>
                        <div class="code-block">
                            <pre class="text-blue-300">
// In your main server file (e.g., server.js)
const authRoutes = require('./api/authRoutes');
app.use('/api/auth', authRoutes);</pre>
                        </div>
                        <p class="text-gray-400 mt-4 text-sm">Mount the auth routes under the '/api/auth' path.</p>
                    </div>
                </div>
            </section>
            
            <!-- API Testing -->
            <section class="mb-12">
                <h2 class="text-2xl font-bold text-white mb-6 pb-2 border-b border-gray-700">
                    <i class="fas fa-vial mr-2"></i>API Testing Examples
                </h2>
                
                <div class="space-y-6">
                    <!-- Login Example -->
                    <div class="bg-gray-800 p-6 rounded-xl">
                        <h3 class="text-lg font-bold text-white mb-3">Login Request Example</h3>
                        <div class="code-block mb-4">
                            <pre class="text-gray-200">
POST /api/auth/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}</pre>
                        </div>
                        <div class="code-block">
                            <pre class="text-green-300">
Response (200 OK):
{
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user"
    }
}</pre>
                        </div>
                    </div>
                    
                    <!-- Validate Example -->
                    <div class="bg-gray-800 p-6 rounded-xl">
                        <h3 class="text-lg font-bold text-white mb-3">Token Validation Example</h3>
                        <div class="code-block mb-4">
                            <pre class="text-gray-200">
GET /api/auth/validate
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</pre>
                        </div>
                        <div class="code-block">
                            <pre class="text-green-300">
Response (200 OK):
{
    "valid": true,
    "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "John Doe",
        "role": "user",
        "iat": 1625097600,
        "exp": 1625184000
    },
    "message": "Token is valid"
}</pre>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        <!-- Footer -->
        <footer class="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>Authentication Routes API &copy; 2023 - Express.js JWT Implementation</p>
            <p class="mt-2">Remember to store JWT_SECRET in environment variables in production</p>
        </footer>
    </div>

    <script>
        // Copy code functionality
        document.getElementById('copyCodeBtn').addEventListener('click', function() {
            const codeContent = document.getElementById('codeContent').textContent;
            copyToClipboard(codeContent);
            showCopyFeedback(this);
        });
        
        document.getElementById('copyAllBtn').addEventListener('click', function() {
            const codeContent = document.getElementById('codeContent').textContent;
            copyToClipboard(codeContent);
            showCopyFeedback(this, 'All code copied to clipboard!');
        });
        
        function copyToClipboard(text) {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        
        function showCopyFeedback(button, customMessage) {
            const originalHTML = button.innerHTML;
            const originalText = button.textContent;
            
            button.innerHTML = '<i class="fas fa-check mr-2"></i> Copied!';
            button.style.backgroundColor = '#10b981';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.textContent = originalText;
                button.style.backgroundColor = '';
            }, 2000);
        }
        
        // Syntax highlighting simulation
        document.addEventListener('DOMContentLoaded', function() {
            const codeBlocks = document.querySelectorAll('pre');
            codeBlocks.forEach(block => {
                const text = block.textContent;
                // Simple keyword highlighting
                const highlighted = text
                    .replace(/\b(const|let|var|function|return|if|else|try|catch|async|await)\b/g, '<span class="text-purple-400">$1</span>')
                    .replace(/\b(require|module\.exports|router\.|res\.
<!-- update 1774955256.2862165 -->