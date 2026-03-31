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
        <!-- Header -->
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
                <i class="fas fa-code text-blue-600 mr-3"></i>
                backend/controllers/authController.js
            </h1>
            <p class="text-gray-600">Update login flow with JWT authentication</p>
            <div class="flex items-center mt-4 space-x-4">
                <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    <i class="fas fa-shield-alt mr-1"></i> Authentication
                </span>
                <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    <i class="fas fa-lock mr-1"></i> JWT
                </span>
                <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    <i class="fas fa-server mr-1"></i> Backend
                </span>
            </div>
        </header>

        <!-- Main Content -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <!-- File Header -->
            <div class="bg-gray-900 text-gray-300 px-6 py-4 border-b border-gray-800">
                <div class="flex justify-between items-center">
                    <div class="flex items-center">
                        <i class="fab fa-js-square text-yellow-400 text-xl mr-3"></i>
                        <span class="font-mono">authController.js</span>
                    </div>
                    <div class="text-sm">
                        <i class="far fa-clock mr-1"></i>
                        Updated: JWT Implementation
                    </div>
                </div>
            </div>

            <!-- Code Content -->
            <div class="p-0">
                <pre class="m-0 p-6 font-mono text-sm leading-relaxed overflow-x-auto">
<span class="comment">/**
 * Authentication Controller
 * Handles user authentication with JWT implementation
 * Updated login flow with token generation and validation
 */</span>

<span class="keyword">const</span> <span class="variable">User</span> = <span class="function">require</span>(<span class="string">'../models/User'</span>);
<span class="keyword">const</span> <span class="variable">jwt</span> = <span class="function">require</span>(<span class="string">'jsonwebtoken'</span>);
<span class="keyword">const</span> <span class="variable">bcrypt</span> = <span class="function">require</span>(<span class="string">'bcryptjs'</span>);

<span class="comment">// Generate JWT Token</span>
<span class="keyword">const</span> <span class="function">generateToken</span> = (<span class="variable">id</span>) => {
    <span class="keyword">return</span> <span class="variable">jwt</span>.<span class="function">sign</span>({ <span class="variable">id</span> }, <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">JWT_SECRET</span>, {
        <span class="variable">expiresIn</span>: <span class="string">'30d'</span>
    });
};

<span class="comment">/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */</span>
<span class="keyword">exports</span>.<span class="variable">loginUser</span> = <span class="keyword">async</span> (<span class="variable">req</span>, <span class="variable">res</span>) => {
    <span class="keyword">try</span> {
        <span class="keyword">const</span> { <span class="variable">email</span>, <span class="variable">password</span> } = <span class="variable">req</span>.<span class="variable">body</span>;

        <span class="comment">// Validate input</span>
        <span class="keyword">if</span> (!<span class="variable">email</span> || !<span class="variable">password</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">400</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Please provide email and password'</span>
            });
        }

        <span class="comment">// Check for user</span>
        <span class="keyword">const</span> <span class="variable">user</span> = <span class="keyword">await</span> <span class="variable">User</span>.<span class="function">findOne</span>({ <span class="variable">email</span> }).<span class="function">select</span>(<span class="string">'+password'</span>);

        <span class="keyword">if</span> (!<span class="variable">user</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Invalid credentials'</span>
            });
        }

        <span class="comment">// Check password</span>
        <span class="keyword">const</span> <span class="variable">isPasswordMatch</span> = <span class="keyword">await</span> <span class="variable">bcrypt</span>.<span class="function">compare</span>(<span class="variable">password</span>, <span class="variable">user</span>.<span class="variable">password</span>);

        <span class="keyword">if</span> (!<span class="variable">isPasswordMatch</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'Invalid credentials'</span>
            });
        }

        <span class="comment">// Generate JWT token</span>
        <span class="keyword">const</span> <span class="variable">token</span> = <span class="function">generateToken</span>(<span class="variable">user</span>.<span class="variable">_id</span>);

        <span class="comment">// Set cookie with token</span>
        <span class="variable">res</span>.<span class="function">cookie</span>(<span class="string">'token'</span>, <span class="variable">token</span>, {
            <span class="variable">httpOnly</span>: <span class="keyword">true</span>,
            <span class="variable">secure</span>: <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">NODE_ENV</span> === <span class="string">'production'</span>,
            <span class="variable">sameSite</span>: <span class="string">'strict'</span>,
            <span class="variable">maxAge</span>: <span class="number">30</span> * <span class="number">24</span> * <span class="number">60</span> * <span class="number">60</span> * <span class="number">1000</span> <span class="comment">// 30 days</span>
        });

        <span class="comment">// Return user data and token</span>
        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">200</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">true</span>,
            <span class="variable">token</span>,
            <span class="variable">user</span>: {
                <span class="variable">id</span>: <span class="variable">user</span>.<span class="variable">_id</span>,
                <span class="variable">name</span>: <span class="variable">user</span>.<span class="variable">name</span>,
                <span class="variable">email</span>: <span class="variable">user</span>.<span class="variable">email</span>,
                <span class="variable">role</span>: <span class="variable">user</span>.<span class="variable">role</span>
            }
        });

    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="variable">console</span>.<span class="function">error</span>(<span class="string">'Login error:'</span>, <span class="variable">error</span>);
        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">false</span>,
            <span class="variable">message</span>: <span class="string">'Server error during authentication'</span>
        });
    }
};

<span class="comment">/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */</span>
<span class="keyword">exports</span>.<span class="variable">getMe</span> = <span class="keyword">async</span> (<span class="variable">req</span>, <span class="variable">res</span>) => {
    <span class="keyword">try</span> {
        <span class="keyword">const</span> <span class="variable">user</span> = <span class="keyword">await</span> <span class="variable">User</span>.<span class="function">findById</span>(<span class="variable">req</span>.<span class="variable">user</span>.<span class="variable">id</span>);

        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">200</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">true</span>,
            <span class="variable">user</span>
        });
    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="variable">console</span>.<span class="function">error</span>(<span class="string">'Get user error:'</span>, <span class="variable">error</span>);
        <span class="variable">res</span>.<span class="function">status</span>(<span class="number">500</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">false</span>,
            <span class="variable">message</span>: <span class="string">'Server error'</span>
        });
    }
};

<span class="comment">/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */</span>
<span class="keyword">exports</span>.<span class="variable">logoutUser</span> = (<span class="variable">req</span>, <span class="variable">res</span>) => {
    <span class="variable">res</span>.<span class="function">cookie</span>(<span class="string">'token'</span>, <span class="string">''</span>, {
        <span class="variable">httpOnly</span>: <span class="keyword">true</span>,
        <span class="variable">expires</span>: <span class="keyword">new</span> <span class="function">Date</span>(<span class="number">0</span>)
    });

    <span class="variable">res</span>.<span class="function">status</span>(<span class="number">200</span>).<span class="function">json</span>({
        <span class="variable">success</span>: <span class="keyword">true</span>,
        <span class="variable">message</span>: <span class="string">'Logged out successfully'</span>
    });
};

<span class="comment">// Middleware to protect routes</span>
<span class="keyword">exports</span>.<span class="variable">protect</span> = <span class="keyword">async</span> (<span class="variable">req</span>, <span class="variable">res</span>, <span class="variable">next</span>) => {
    <span class="keyword">let</span> <span class="variable">token</span>;

    <span class="comment">// Check for token in cookies or Authorization header</span>
    <span class="keyword">if</span> (<span class="variable">req</span>.<span class="variable">cookies</span>.<span class="variable">token</span>) {
        <span class="variable">token</span> = <span class="variable">req</span>.<span class="variable">cookies</span>.<span class="variable">token</span>;
    } <span class="keyword">else</span> <span class="keyword">if</span> (
        <span class="variable">req</span>.<span class="variable">headers</span>.<span class="variable">authorization</span> &&
        <span class="variable">req</span>.<span class="variable">headers</span>.<span class="variable">authorization</span>.<span class="function">startsWith</span>(<span class="string">'Bearer'</span>)
    ) {
        <span class="variable">token</span> = <span class="variable">req</span>.<span class="variable">headers</span>.<span class="variable">authorization</span>.<span class="function">split</span>(<span class="string">' '</span>)[<span class="number">1</span>];
    }

    <span class="keyword">if</span> (!<span class="variable">token</span>) {
        <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
            <span class="variable">success</span>: <span class="keyword">false</span>,
            <span class="variable">message</span>: <span class="string">'Not authorized to access this route'</span>
        });
    }

    <span class="keyword">try</span> {
        <span class="comment">// Verify token</span>
        <span class="keyword">const</span> <span class="variable">decoded</span> = <span class="variable">jwt</span>.<span class="function">verify</span>(<span class="variable">token</span>, <span class="variable">process</span>.<span class="variable">env</span>.<span class="variable">JWT_SECRET</span>);

        <span class="comment">// Get user from token</span>
        <span class="variable">req</span>.<span class="variable">user</span> = <span class="keyword">await</span> <span class="variable">User</span>.<span class="function">findById</span>(<span class="variable">decoded</span>.<span class="variable">id</span>);

        <span class="keyword">if</span> (!<span class="variable">req</span>.<span class="variable">user</span>) {
            <span class="keyword">return</span> <span class="variable">res</span>.<span class="function">status</span>(<span class="number">401</span>).<span class="function">json</span>({
                <span class="variable">success</span>: <span class="keyword">false</span>,
                <span class="variable">message</span>: <span class="string">'User not found'</span>
            });
        }

        <span class="variable">next</span>();
    } <span class="keyword">catch</span> (<span class="variable">error</span>) {
        <span class="keyword">return</span> <span class="variable">res</
<!-- update 1774960426.0112488 -->