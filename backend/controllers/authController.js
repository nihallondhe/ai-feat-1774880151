html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Controller Update</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        .code-line:hover {
            background-color: #f7fafc;
        }
        .comment {
            color: #6b7280;
        }
        .string {
            color: #059669;
        }
        .keyword {
            color: #dc2626;
        }
        .function {
            color: #2563eb;
        }
        .variable {
            color: #7c3aed;
        }
    </style>
</head>
<body class="bg-gray-50 text-gray-800 p-6">
    <div class="max-w-6xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-code text-blue-600 mr-3"></i>Backend Auth Controller Update
            </h1>
            <p class="text-gray-600">Updating login flow with JWT authentication</p>
            <div class="flex items-center mt-4 text-sm text-gray-500">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-3">
                    <i class="fas fa-file-code mr-1"></i> backend/controllers/authController.js
                </span>
                <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full">
                    <i class="fas fa-tasks mr-1"></i> JWT Implementation
                </span>
            </div>
        </header>

        <div class="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            <div class="bg-gray-900 text-gray-300 px-6 py-4 flex justify-between items-center">
                <div class="flex items-center">
                    <i class="fas fa-js-square text-yellow-400 text-xl mr-3"></i>
                    <span class="font-mono">authController.js</span>
                </div>
                <div class="text-sm">
                    <span class="bg-gray-800 px-3 py-1 rounded">Updated</span>
                </div>
            </div>
            
            <div class="p-0">
                <pre class="m-0"><code class="font-mono text-sm leading-relaxed">
<span class="comment">/**
 * Authentication Controller
 * Handles user authentication with JWT implementation
 * Updated: Added JWT token generation and refresh token flow
 */</span>

<span class="keyword">const</span> <span class="variable">jwt</span> = <span class="function">require</span>(<span class="string">'jsonwebtoken'</span>);
<span class="keyword">const</span> <span class="variable">bcrypt</span> = <span class="function">require</span>(<span class="string">'bcryptjs'</span>);
<span class="keyword">const</span> <span class="variable">User</span> = <span class="function">require</span>(<span class="string">'../models/User'</span>);
<span class="keyword">const</span> { <span class="variable">validationResult</span> } = <span class="function">require</span>(<span class="string">'express-validator'</span>);

<span class="comment">// JWT configuration</span>
<span class="keyword">const</span> <span class="variable">JWT_SECRET</span> = <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">JWT_SECRET</span> || <span class="string">'your-secret-key-change-in-production'</span>;
<span class="keyword">const</span> <span class="variable">JWT_EXPIRES_IN</span> = <span class="string">'1h'</span>;
<span class="keyword">const</span> <span class="variable">REFRESH_TOKEN_EXPIRES_IN</span> = <span class="string">'7d'</span>;

<span class="comment">/**
 * Generate JWT token
 * @param {Object} user - User object
 * @returns {String} JWT token
 */</span>
<span class="keyword">const</span> <span class="function">generateToken</span> = (<span class="variable">user</span>) => {
    <span class="keyword">return</span> <span class="variable">jwt</span>.<span class="function">sign</span>(
        {
            <span class="variable">id</span>: <span class="variable">user</span>.<span class="variable">_id</span>,
            <span class="variable">email</span>: <span class="variable">user</span>.<span class="variable">email</span>,
            <span class="variable">role</span>: <span class="variable">user</span>.<span class="variable">role</span>
        },
        <span class="variable">JWT_SECRET</span>,
        { <span class="variable">expiresIn</span>: <span class="variable">JWT_EXPIRES_IN</span> }
    );
};

<span class="comment">/**
 * Generate refresh token
 * @param {Object} user - User object
 * @returns {String} Refresh token
 */</span>
<span class="keyword">const</span> <span class="function">generateRefreshToken</span> = (<span class="variable">user</span>) => {
    <span class="keyword">return</span> <span class="variable">jwt</span>.<span class="function">sign</span>(
        { <span class="variable">id</span>: <span class="variable">user</span>.<span class="variable">_id</span> },
        <span class="variable">JWT_SECRET</span> + <span class="variable">user</span>.<span class="variable">password</span>, <span class="comment">// Include password hash to invalidate on password change</span>
        { <span class="variable">expiresIn</span>: <span class="variable">REFRESH_TOKEN_EXPIRES_IN</span> }
    );
};

<span class="comment">/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get JWT token
 * @access  Public
 */</span>
<span class="keyword">exports</span>.<span class="variable">login</span> = <span class="keyword">async</span> (<span class="variable">req</span>, <span class="variable">res</span>) => {
    <span class="keyword">try</span> {
        <span class="comment">// Validate request</span>
        <span class="keyword">const</span> <span class="variable">errors</span> = <span class="function">validationResult</span>(<span class="variable">req</span>);
        <span class="keyword">if</span> (!<span class="variable">errors</span>.<span class="function">isEmpty</span>()) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">400</span>).<span class="function">json</span>({ <span class="variable">errors</span>: <span class="variable">errors</span>.<span class="function">array</span>() });
        }

        <span class="keyword">const</span> { <span class="variable">email</span>, <span class="variable">password</span> } = <span class="variable">req</span>.<span class="variable">body</span>;

        <span class="comment">// Check if user exists</span>
        <span class="keyword">const</span> <span class="variable">user</span> = <span class="keyword">await</span> <span class="variable">User</span>.<span class="function">findOne</span>({ <span class="variable">email</span> }).<span class="function">select</span>(<span class="string">'+password'</span>);
        
        <span class="keyword">if</span> (!<span class="variable">user</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Invalid credentials'</span>
            });
        }

        <span class="comment">// Verify password</span>
        <span class="keyword">const</span> <span class="variable">isPasswordValid</span> = <span class="keyword">await</span> <span class="variable">bcrypt</span>.<span class="function">compare</span>(<span class="variable">password</span>, <span class="variable">user</span>.<span class="variable">password</span>);
        
        <span class="keyword">if</span> (!<span class="variable">isPasswordValid</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Invalid credentials'</span>
            });
        }

        <span class="comment">// Generate tokens</span>
        <span class="keyword">const</span> <span class="variable">token</span> = <span class="function">generateToken</span>(<span class="variable">user</span>);
        <span class="keyword">const</span> <span class="variable">refreshToken</span> = <span class="function">generateRefreshToken</span>(<span class="variable">user</span>);

        <span class="comment">// Update user's refresh token in database</span>
        <span class="variable">user</span>.<span class="variable">refreshToken</span> = <span class="variable">refreshToken</span>;
        <span class="keyword">await</span> <span class="variable">user</span>.<span class="function">save</span>();

        <span class="comment">// Remove password from response</span>
        <span class="variable">user</span>.<span class="variable">password</span> = <span class="keyword">undefined</span>;

        <span class="comment">// Set HTTP-only cookie for refresh token</span>
        <span class="variable">res</span>.<span class="function">cookie</span>(<span class="string">'refreshToken'</span>, <span class="variable">refreshToken</span>, {
            <span class="variable">httpOnly</span>: <span class="keyword">true</span>,
            <span class="variable">secure</span>: <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">NODE_ENV</span> === <span class="string">'production'</span>,
            <span class="variable">sameSite</span>: <span class="string">'strict'</span>,
            <span class="variable">maxAge</span>: <span class="number">7</span> * <span class="number">24</span> * <span class="number">60</span> * <span class="number">60</span> * <span class="number">1000</span> <span class="comment">// 7 days</span>
        });

        <span class="comment">// Send response</span>
        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">200</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">true</span>,
            <span class="variable">message</span>: <span class="string">'Login successful'</span>,
            <span class="variable">data</span>: {
                <span class="variable">user</span>,
                <span class="variable">token</span>,
                <span class="variable">expiresIn</span>: <span class="number">3600</span> <span class="comment">// 1 hour in seconds</span>
            }
        });

    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="variable">console</span>.<span class="function">error</span>(<span class="string">'Login error:'</span>, <span class="variable">error</span>);
        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">false</span>,
            <span class="variable">message</span>: <span class="string">'Server error during authentication'</span>,
            <span class="variable">error</span>: <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">NODE_ENV</span> === <span class="string">'development'</span> ? <span class="variable">error</span>.<span class="variable">message</span> : <span class="keyword">undefined</span>
        });
    }
};

<span class="comment">/**
 * @route   POST /api/auth/refresh-token
 * @desc    Refresh JWT token using refresh token
 * @access  Public
 */</span>
<span class="keyword">exports</span>.<span class="variable">refreshToken</span> = <span class="keyword">async</span> (<span class="variable">req</span>, <span class="variable">res</span>) => {
    <span class="keyword">try</span> {
        <span class="keyword">const</span> <span class="variable">refreshToken</span> = <span class="variable">req</span>.<span class="variable">cookies</span>.<span class="variable">refreshToken</span> || <span class="variable">req</span>.<span class="variable">body</span>.<span class="variable">refreshToken</span>;
        
        <span class="keyword">if</span> (!<span class="variable">refreshToken</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Refresh token required'</span>
            });
        }

        <span class="comment">// Find user with this refresh token</span>
        <span class="keyword">const</span> <span class="variable">user</span> = <span class="keyword">await</span> <span class="variable">User</span>.<span class="function">findOne</span>({ <span class="variable">refreshToken</span> });
        
        <span class="keyword">if</span> (!<span class="variable">user</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">403</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Invalid refresh token'</span>
            });
        }

        <span class="comment">// Verify refresh token</span>
        <span class="keyword">try</span> {
            <span class="variable">jwt</span>.<span class="function">verify</span>(<span class="variable">refreshToken</span>, <span class="variable">JWT_SECRET</span> + <span class="variable">user</span>.<span class="variable">password</span>);
        } <span class="keyword">catch</span> (<span class="variable">error</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">403</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Refresh token expired or invalid'</span>
            });
        }

        <span class="comment">// Generate new access token</span>
        <span class="keyword">const</span> <span class="variable">newToken</span> = <span class="function">generateToken</span>(<span class="variable">user</span>);

        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">200</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">true</span>,
            <span class="variable">token</span>: <span class="variable">newToken</span>,
            <span class="variable">expiresIn</span>: <span class="number">3600</span>
        });

    } <span class="keyword">catch</span
<!-- update 1774961673.8199413 -->