html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Utils Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
</head>
<body class="bg-gray-50 text-gray-800">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-10">
            <h1 class="text-4xl font-bold text-gray-900 mb-2">JWT Utilities Documentation</h1>
            <p class="text-gray-600">Utility functions for JWT token generation, verification, and refresh</p>
            <div class="mt-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p class="text-sm text-blue-800"><strong>File:</strong> utils/jwtUtils.js</p>
            </div>
        </header>

        <main class="space-y-12">
            <!-- Overview Section -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold mb-4 text-gray-900">Overview</h2>
                <p class="text-gray-700 mb-4">This module provides comprehensive JWT (JSON Web Token) utilities for authentication systems. It includes functions for token generation, verification, and refresh token management.</p>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    <div class="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 class="font-bold text-green-800 mb-2">Token Generation</h3>
                        <p class="text-sm text-green-700">Create secure JWT tokens with customizable payloads and expiration</p>
                    </div>
                    <div class="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h3 class="font-bold text-yellow-800 mb-2">Token Verification</h3>
                        <p class="text-sm text-yellow-700">Validate tokens and extract payload data with error handling</p>
                    </div>
                    <div class="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 class="font-bold text-purple-800 mb-2">Refresh Tokens</h3>
                        <p class="text-sm text-purple-700">Manage refresh tokens for extended session management</p>
                    </div>
                </div>
            </section>

            <!-- Code Implementation -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-900">Implementation</h2>
                
                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Dependencies & Configuration</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
// utils/jwtUtils.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Configuration
const JWT_CONFIG = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret-key-change-in-production',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-production',
    accessTokenExpiry: '15m', // 15 minutes
    refreshTokenExpiry: '7d', // 7 days
    issuer: 'your-app-name',
    algorithm: 'HS256'
};

// Token blacklist (in production, use Redis or database)
const tokenBlacklist = new Set();
                    </code></pre>
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Token Generation Functions</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
/**
 * Generate access token
 * @param {Object} payload - Token payload (user data)
 * @returns {String} JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: 'access'
        },
        JWT_CONFIG.accessTokenSecret,
        {
            expiresIn: JWT_CONFIG.accessTokenExpiry,
            issuer: JWT_CONFIG.issuer,
            algorithm: JWT_CONFIG.algorithm
        }
    );
};

/**
 * Generate refresh token
 * @param {Object} payload - Token payload (user data)
 * @returns {String} JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(
        {
            ...payload,
            type: 'refresh'
        },
        JWT_CONFIG.refreshTokenSecret,
        {
            expiresIn: JWT_CONFIG.refreshTokenExpiry,
            issuer: JWT_CONFIG.issuer,
            algorithm: JWT_CONFIG.algorithm
        }
    );
};

/**
 * Generate both access and refresh tokens
 * @param {Object} userData - User data to include in tokens
 * @returns {Object} Object containing accessToken and refreshToken
 */
const generateTokenPair = (userData) => {
    const accessToken = generateAccessToken(userData);
    const refreshToken = generateRefreshToken(userData);
    
    return {
        accessToken,
        refreshToken,
        expiresIn: 900 // 15 minutes in seconds
    };
};
                    </code></pre>
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Token Verification Functions</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
/**
 * Verify access token
 * @param {String} token - JWT access token
 * @returns {Object} Decoded token payload or error
 */
const verifyAccessToken = (token) => {
    try {
        // Check if token is blacklisted
        if (tokenBlacklist.has(token)) {
            throw new Error('Token has been revoked');
        }
        
        return jwt.verify(token, JWT_CONFIG.accessTokenSecret, {
            issuer: JWT_CONFIG.issuer,
            algorithms: [JWT_CONFIG.algorithm]
        });
    } catch (error) {
        throw new Error(`Token verification failed: ${error.message}`);
    }
};

/**
 * Verify refresh token
 * @param {String} token - JWT refresh token
 * @returns {Object} Decoded token payload or error
 */
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, JWT_CONFIG.refreshTokenSecret, {
            issuer: JWT_CONFIG.issuer,
            algorithms: [JWT_CONFIG.algorithm]
        });
    } catch (error) {
        throw new Error(`Refresh token verification failed: ${error.message}`);
    }
};

/**
 * Decode token without verification (for inspection)
 * @param {String} token - JWT token
 * @returns {Object} Decoded token header and payload
 */
const decodeToken = (token) => {
    return jwt.decode(token, { complete: true });
};
                    </code></pre>
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Token Refresh & Management</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
/**
 * Refresh access token using refresh token
 * @param {String} refreshToken - Valid refresh token
 * @returns {Object} New token pair
 */
const refreshAccessToken = (refreshToken) => {
    try {
        // Verify the refresh token
        const decoded = verifyRefreshToken(refreshToken);
        
        // Remove token type from payload
        const { type, iat, exp, ...userData } = decoded;
        
        // Generate new token pair
        return generateTokenPair(userData);
    } catch (error) {
        throw new Error(`Token refresh failed: ${error.message}`);
    }
};

/**
 * Revoke/blacklist a token
 * @param {String} token - Token to revoke
 */
const revokeToken = (token) => {
    tokenBlacklist.add(token);
    
    // In production, you might want to set an expiration on the blacklist entry
    // based on the token's remaining validity
    const decoded = decodeToken(token);
    if (decoded && decoded.payload.exp) {
        const expiresIn = decoded.payload.exp - Math.floor(Date.now() / 1000);
        if (expiresIn > 0) {
            // Auto-remove from blacklist after token expires
            setTimeout(() => {
                tokenBlacklist.delete(token);
            }, expiresIn * 1000);
        }
    }
};

/**
 * Clear expired tokens from blacklist
 */
const cleanupBlacklist = () => {
    const now = Math.floor(Date.now() / 1000);
    for (const token of tokenBlacklist) {
        const decoded = decodeToken(token);
        if (decoded && decoded.payload.exp && decoded.payload.exp < now) {
            tokenBlacklist.delete(token);
        }
    }
};
                    </code></pre>
                </div>

                <div class="mb-8">
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Middleware & Helper Functions</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
/**
 * Express middleware for JWT authentication
 * @param {Boolean} requireAuth - Whether authentication is required
 * @returns {Function} Express middleware function
 */
const authenticateToken = (requireAuth = true) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            if (requireAuth) {
                return res.status(401).json({ error: 'Access token required' });
            }
            req.user = null;
            return next();
        }
        
        try {
            const decoded = verifyAccessToken(token);
            req.user = decoded;
            req.token = token;
            next();
        } catch (error) {
            if (requireAuth) {
                return res.status(403).json({ error: 'Invalid or expired token' });
            }
            req.user = null;
            next();
        }
    };
};

/**
 * Extract user ID from token
 * @param {String} token - JWT token
 * @returns {String|null} User ID or null
 */
const getUserIdFromToken = (token) => {
    try {
        const decoded = verifyAccessToken(token);
        return decoded.userId || decoded.id || decoded.sub || null;
    } catch (error) {
        return null;
    }
};

/**
 * Check if token is about to expire (within threshold)
 * @param {String} token - JWT token
 * @param {Number} thresholdSeconds - Threshold in seconds (default: 300 = 5 minutes)
 * @returns {Boolean} True if token is about to expire
 */
const isTokenExpiringSoon = (token, thresholdSeconds = 300) => {
    try {
        const decoded = decodeToken(token);
        if (!decoded || !decoded.payload.exp) return false;
        
        const now = Math.floor(Date.now() / 1000);
        const timeUntilExpiry = decoded.payload.exp - now;
        
        return timeUntilExpiry <= thresholdSeconds;
    } catch (error) {
        return false;
    }
};
                    </code></pre>
                </div>

                <div>
                    <h3 class="text-xl font-semibold mb-3 text-gray-800">Module Exports</h3>
                    <pre class="rounded-lg overflow-hidden"><code class="language-javascript">
// Export all functions
module.exports = {
    // Configuration
    JWT_CONFIG,
    
    // Generation
    generateAccessToken,
    generateRefreshToken,
    generateTokenPair,
    
    // Verification
    verifyAccessToken,
    verifyRefreshToken,
    decodeToken,
    
    // Refresh & Management
    refreshAccessToken,
    revokeToken,
    cleanupBlacklist,
    
    // Middleware & Helpers
    authenticateToken,
    getUserIdFromToken,
    isTokenExpiringSoon,
    
    // Blacklist (for testing/admin purposes)
    tokenBlacklist
};
                    </code></pre>
                </div>
            </section>

            <!-- Usage Examples -->
            <section class="bg-white rounded-xl shadow-md p-6">
                <h2 class="text-2xl font-bold mb-6 text-gray-900">Usage Examples</h2>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="font-bold text-lg mb-3 text-gray-800">Login Controller</h3>
                        <pre class="rounded-lg overflow-hidden text-sm"><code class="language-javascript">
// In your auth controller
const jwtUtils = require('../utils/jwtUtils');

async function loginController(req, res) {
    const { email, password } = req.body;
    
    // Validate user credentials
    const user = await User.findOne({ email });
    if (!user || !await user.comparePassword(password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate tokens
    const tokenPair = jwtUtils.generateTokenPair({
        userId: user._id,
        email: user.email,
        role: user.role
    });
    
    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', tokenPair.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({
        accessToken: tokenPair.accessToken,
        expiresIn: tokenPair.expiresIn,
        user: {
            id: user._id,
            email: user.email,
            role: user.role
        }
    });
}
                        </code></pre>
                    </div>
                    
                    <div class="bg-gray-50 p-5 rounded-lg">
                        <h3 class="font-bold text-lg mb-3 text-gray-800">Protected Route</h3>
                        <pre class="rounded-lg overflow-hidden text-sm"><code class="language-javascript">
// In your routes
const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwtUtils');

// Apply authentication middleware
router.get('/profile', 
    jwtUtils.authenticateToken(), 
    (req, res) => {
        res.json({
            user: req.user,
            message: 'Protected data accessed successfully'
        });
    }
);

// Optional authentication route
router.get('/public-data',
    jwtUtils.authenticateToken(false),
    (req, res) => {
        const response = { data: 'Public information' };
        if (req.user) {
            response.user = req.user;
            response.message = 'Authenticated user';
        }
        res.json(response);
    }
);
                        </code></pre>
                    </div>
                </div>
            </section>

            <!-- Security Notes -->
            <section class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h2 class="text-2xl font-bold mb-4 text-yellow-900">⚠️ Security Considerations</h2>
                <ul class="space-y-3 text-yellow-800">
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Always use strong, randomly generated secrets (min 32 characters)</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Store secrets in environment variables, never in code</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Use HTTPS in production to prevent token interception</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Implement proper token revocation for logout/security incidents</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Consider using Redis or database for token blacklist in production</span>
                    </li>
                    <li class="flex items-start">
                        <span class="font-bold mr-2">•</span>
                        <span>Regularly rotate your JWT secrets</span>
                    </li>
                </ul>
            </section>
        </main>

        <footer class="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
            <p>JWT Utilities Module • Created with security best practices in mind</p>
            <p class="mt-2">Remember to implement proper error handling and logging in production</p>
        </footer>
    </div>

    <script>
        // Add copy functionality to code blocks
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelectorAll('pre code').forEach((block) => {
                const pre = block.parentElement;
                const button = document.createElement('button');
                button.className = 'absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity';
                button.textContent = 'Copy';
                button.onclick = () => {
                    navigator.clipboard.writeText(block.textContent);
                    button.textContent = 'Copied!';
                    setTimeout(() => button.textContent = 'Copy', 2000);
                };
                
                const wrapper = document.createElement('div');
                wrapper.className = 'relative group';
                pre.parentNode.insertBefore(wrapper, pre);
                wrapper.appendChild(pre);
                wrapper.appendChild(button);
            });
        });
    </script>
</body>
</html>
<!-- update 1774955257.7896953 -->