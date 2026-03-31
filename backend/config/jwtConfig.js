html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>JWT Configuration</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">JWT Configuration Setup</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">File: backend/config/jwtConfig.js</h2>
            <p class="text-gray-600 mb-6">JWT configuration including secret key and token expiration settings.</p>
            
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre class="text-gray-200 text-sm font-mono">
<code>/**
 * JWT Configuration Module
 * Handles JSON Web Token setup for authentication
 */

const jwtConfig = {
    // Secret key for signing JWT tokens
    // In production, use environment variable: process.env.JWT_SECRET
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    
    // Token expiration settings
    expiresIn: {
        // Access token expiration (short-lived for security)
        accessToken: '15m', // 15 minutes
        
        // Refresh token expiration (longer-lived for session persistence)
        refreshToken: '7d', // 7 days
        
        // Password reset token expiration
        resetToken: '1h', // 1 hour
        
        // Email verification token expiration
        verifyToken: '24h' // 24 hours
    },
    
    // Token issuer and audience for additional security
    issuer: 'your-app-name',
    audience: 'your-app-client',
    
    // Algorithm for signing tokens (HS256 is recommended)
    algorithm: 'HS256',
    
    // Cookie settings for token storage (if using cookies)
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    },
    
    // Token validation options
    validation: {
        // Require expiration claim
        requireExpiration: true,
        
        // Clock tolerance for expiration validation (in seconds)
        clockTolerance: 30,
        
        // Validate issuer
        validateIssuer: true,
        
        // Validate audience
        validateAudience: true
    },
    
    // Token generation helper methods
    generateAccessToken: (payload) => {
        const jwt = require('jsonwebtoken');
        return jwt.sign(
            payload,
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn.accessToken,
                issuer: jwtConfig.issuer,
                audience: jwtConfig.audience,
                algorithm: jwtConfig.algorithm
            }
        );
    },
    
    generateRefreshToken: (payload) => {
        const jwt = require('jsonwebtoken');
        return jwt.sign(
            payload,
            jwtConfig.secret,
            {
                expiresIn: jwtConfig.expiresIn.refreshToken,
                issuer: jwtConfig.issuer,
                audience: jwtConfig.audience,
                algorithm: jwtConfig.algorithm
            }
        );
    },
    
    // Token verification helper method
    verifyToken: (token) => {
        const jwt = require('jsonwebtoken');
        return jwt.verify(
            token,
            jwtConfig.secret,
            {
                issuer: jwtConfig.issuer,
                audience: jwtConfig.audience,
                algorithms: [jwtConfig.algorithm],
                clockTolerance: jwtConfig.validation.clockTolerance
            }
        );
    },
    
    // Token decoding helper method (without verification)
    decodeToken: (token) => {
        const jwt = require('jsonwebtoken');
        return jwt.decode(token);
    },
    
    // Check if token is expired
    isTokenExpired: (token) => {
        try {
            const decoded = jwtConfig.decodeToken(token);
            if (!decoded || !decoded.exp) return true;
            
            const currentTime = Math.floor(Date.now() / 1000);
            return decoded.exp < currentTime;
        } catch (error) {
            return true;
        }
    },
    
    // Get remaining time until token expiration (in seconds)
    getTokenRemainingTime: (token) => {
        try {
            const decoded = jwtConfig.decodeToken(token);
            if (!decoded || !decoded.exp) return 0;
            
            const currentTime = Math.floor(Date.now() / 1000);
            return Math.max(0, decoded.exp - currentTime);
        } catch (error) {
            return 0;
        }
    }
};

// Export the configuration
module.exports = jwtConfig;</code>
                </pre>
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 class="font-semibold text-blue-800 mb-2">Important Notes:</h3>
                <ul class="text-blue-700 text-sm space-y-1">
                    <li>• Always use environment variables for secret keys in production</li>
                    <li>• Store refresh tokens securely (database or encrypted cookies)</li>
                    <li>• Implement proper token refresh mechanisms</li>
                    <li>• Consider using asymmetric encryption (RS256) for microservices</li>
                    <li>• Regularly rotate secret keys for enhanced security</li>
                </ul>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Usage Example</h2>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre class="text-gray-200 text-sm font-mono">
<code>// In your authentication middleware or controller
const jwtConfig = require('./config/jwtConfig');

// Generate tokens
const userPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
};

const accessToken = jwtConfig.generateAccessToken(userPayload);
const refreshToken = jwtConfig.generateRefreshToken(userPayload);

// Verify token
try {
    const decoded = jwtConfig.verifyToken(accessToken);
    console.log('Token is valid:', decoded);
} catch (error) {
    console.error('Token verification failed:', error.message);
}

// Check token expiration
if (jwtConfig.isTokenExpired(accessToken)) {
    console.log('Token has expired');
} else {
    const remainingTime = jwtConfig.getTokenRemainingTime(accessToken);
    console.log(`Token expires in ${remainingTime} seconds`);
}</code>
                </pre>
            </div>
        </div>
    </div>
</body>
</html>