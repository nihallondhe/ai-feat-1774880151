html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AuthContext.jsx</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        .code-container {
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            line-height: 1.5;
        }
        .comment { color: #6a9955; }
        .keyword { color: #569cd6; }
        .function { color: #dcdcaa; }
        .string { color: #ce9178; }
        .variable { color: #9cdcfe; }
        .constant { color: #4ec9b0; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-6">
    <div class="max-w-4xl mx-auto">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-blue-400">frontend/context/AuthContext.jsx</h1>
            <p class="text-gray-400 mt-2">React context to manage authentication state and provide login/logout functions</p>
        </div>

        <div class="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div class="bg-gray-900 px-4 py-3 border-b border-gray-700 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-red-500"></div>
                    <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div class="w-3 h-3 rounded-full bg-green-500"></div>
                    <span class="ml-4 text-sm font-medium text-gray-300">AuthContext.jsx</span>
                </div>
                <div class="text-xs text-gray-500">React Context</div>
            </div>
            
            <pre class="code-container p-6 overflow-x-auto"><code>
<span class="comment">// frontend/context/AuthContext.jsx</span>
<span class="comment">// Authentication context for managing user authentication state</span>

<span class="keyword">import</span> React, { createContext, useState, useContext, useEffect } <span class="keyword">from</span> <span class="string">'react'</span>;
<span class="keyword">import</span> PropTypes <span class="keyword">from</span> <span class="string">'prop-types'</span>;

<span class="comment">// Create the authentication context</span>
<span class="keyword">const</span> <span class="variable">AuthContext</span> = <span class="function">createContext</span>({});

<span class="comment">/**
 * Custom hook to use the authentication context
 * @returns {Object} Authentication context value
 */</span>
<span class="keyword">export const</span> <span class="function">useAuth</span> = () => {
    <span class="keyword">const</span> context = <span class="function">useContext</span>(<span class="variable">AuthContext</span>);
    <span class="keyword">if</span> (!context) {
        <span class="keyword">throw new</span> <span class="function">Error</span>(<span class="string">'useAuth must be used within an AuthProvider'</span>);
    }
    <span class="keyword">return</span> context;
};

<span class="comment">/**
 * Authentication provider component
 * Manages authentication state and provides login/logout functionality
 */</span>
<span class="keyword">export const</span> <span class="variable">AuthProvider</span> = ({ children }) => {
    <span class="comment">// State for user authentication</span>
    <span class="keyword">const</span> [user, setUser] = useState(<span class="keyword">null</span>);
    <span class="keyword">const</span> [loading, setLoading] = useState(<span class="keyword">true</span>);
    <span class="keyword">const</span> [error, setError] = useState(<span class="keyword">null</span>);

    <span class="comment">// Check for existing authentication on initial load</span>
    <span class="function">useEffect</span>(() => {
        <span class="function">checkExistingAuth</span>();
    }, []);

    <span class="comment">/**
     * Check for existing authentication token/session
     */</span>
    <span class="keyword">const</span> <span class="function">checkExistingAuth</span> = <span class="function">async</span> () => {
        <span class="keyword">try</span> {
            <span class="comment">// Check localStorage for existing token</span>
            <span class="keyword">const</span> token = localStorage.<span class="function">getItem</span>(<span class="string">'authToken'</span>);
            <span class="keyword">const</span> storedUser = localStorage.<span class="function">getItem</span>(<span class="string">'user'</span>);
            
            <span class="keyword">if</span> (token && storedUser) {
                <span class="comment">// Validate token with backend (simplified example)</span>
                <span class="keyword">const</span> isValid = <span class="function">await</span> <span class="function">validateToken</span>(token);
                
                <span class="keyword">if</span> (isValid) {
                    <span class="function">setUser</span>(<span class="function">JSON</span>.<span class="function">parse</span>(storedUser));
                } <span class="keyword">else</span> {
                    <span class="function">clearLocalAuth</span>();
                }
            }
        } <span class="keyword">catch</span> (err) {
            <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Auth check failed:'</span>, err);
            <span class="function">clearLocalAuth</span>();
        } <span class="keyword">finally</span> {
            <span class="function">setLoading</span>(<span class="keyword">false</span>);
        }
    };

    <span class="comment">/**
     * Validate authentication token with backend
     * @param {string} token - Authentication token
     * @returns {Promise<boolean>} Token validity
     */</span>
    <span class="keyword">const</span> <span class="function">validateToken</span> = <span class="function">async</span> (token) => {
        <span class="comment">// In a real app, this would make an API call to validate the token</span>
        <span class="keyword">return</span> <span class="function">new</span> <span class="function">Promise</span>((resolve) => {
            <span class="function">setTimeout</span>(() => {
                <span class="comment">// Simulate token validation</span>
                resolve(token && token.length > 10);
            }, 100);
        });
    };

    <span class="comment">/**
     * Login function
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} Login result
     */</span>
    <span class="keyword">const</span> <span class="function">login</span> = <span class="function">async</span> (email, password) => {
        <span class="function">setLoading</span>(<span class="keyword">true</span>);
        <span class="function">setError</span>(<span class="keyword">null</span>);

        <span class="keyword">try</span> {
            <span class="comment">// Simulate API call to login endpoint</span>
            <span class="keyword">const</span> response = <span class="function">await</span> <span class="function">mockLoginAPI</span>(email, password);
            
            <span class="keyword">if</span> (response.success) {
                <span class="keyword">const</span> userData = {
                    id: response.user.id,
                    email: response.user.email,
                    name: response.user.name,
                    role: response.user.role,
                };
                
                <span class="comment">// Store authentication data</span>
                localStorage.<span class="function">setItem</span>(<span class="string">'authToken'</span>, response.token);
                localStorage.<span class="function">setItem</span>(<span class="string">'user'</span>, <span class="function">JSON</span>.<span class="function">stringify</span>(userData));
                
                <span class="function">setUser</span>(userData);
                <span class="keyword">return</span> { success: <span class="keyword">true</span>, user: userData };
            } <span class="keyword">else</span> {
                <span class="function">setError</span>(response.message || <span class="string">'Login failed'</span>);
                <span class="keyword">return</span> { success: <span class="keyword">false</span>, error: response.message };
            }
        } <span class="keyword">catch</span> (err) {
            <span class="keyword">const</span> errorMsg = err.message || <span class="string">'An error occurred during login'</span>;
            <span class="function">setError</span>(errorMsg);
            <span class="keyword">return</span> { success: <span class="keyword">false</span>, error: errorMsg };
        } <span class="keyword">finally</span> {
            <span class="function">setLoading</span>(<span class="keyword">false</span>);
        }
    };

    <span class="comment">/**
     * Logout function
     * Clears authentication state and local storage
     */</span>
    <span class="keyword">const</span> <span class="function">logout</span> = () => {
        <span class="function">clearLocalAuth</span>();
        <span class="function">setUser</span>(<span class="keyword">null</span>);
        <span class="function">setError</span>(<span class="keyword">null</span>);
        
        <span class="comment">// In a real app, you might want to call a logout API endpoint</span>
        <span class="function">console</span>.<span class="function">log</span>(<span class="string">'User logged out'</span>);
    };

    <span class="comment">/**
     * Clear authentication data from local storage
     */</span>
    <span class="keyword">const</span> <span class="function">clearLocalAuth</span> = () => {
        localStorage.<span class="function">removeItem</span>(<span class="string">'authToken'</span>);
        localStorage.<span class="function">removeItem</span>(<span class="string">'user'</span>);
    };

    <span class="comment">/**
     * Mock login API function (replace with actual API call)
     */</span>
    <span class="keyword">const</span> <span class="function">mockLoginAPI</span> = <span class="function">async</span> (email, password) => {
        <span class="comment">// Simulate API delay</span>
        <span class="function">await new</span> <span class="function">Promise</span>(resolve => <span class="function">setTimeout</span>(resolve, 500));
        
        <span class="comment">// Mock validation</span>
        <span class="keyword">if</span> (email && password && password.length >= 6) {
            <span class="keyword">return</span> {
                success: <span class="keyword">true</span>,
                token: <span class="string">'mock-jwt-token-1234567890'</span>,
                user: {
                    id: <span class="string">'user-123'</span>,
                    email: email,
                    name: <span class="string">'John Doe'</span>,
                    role: <span class="string">'user'</span>,
                }
            };
        }
        
        <span class="keyword">return</span> {
            success: <span class="keyword">false</span>,
            message: <span class="string">'Invalid email or password'</span>
        };
    };

    <span class="comment">/**
     * Update user profile information
     * @param {Object} updates - User data updates
     */</span>
    <span class="keyword">const</span> <span class="function">updateUser</span> = (updates) => {
        <span class="keyword">if</span> (user) {
            <span class="keyword">const</span> updatedUser = { ...user, ...updates };
            <span class="function">setUser</span>(updatedUser);
            localStorage.<span class="function">setItem</span>(<span class="string">'user'</span>, <span class="function">JSON</span>.<span class="function">stringify</span>(updatedUser));
        }
    };

    <span class="comment">// Context value to be provided</span>
    <span class="keyword">const</span> contextValue = {
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user,
    };

    <span class="keyword">return</span> (
        &lt;<span class="variable">AuthContext.Provider</span> value={contextValue}&gt;
            {children}
        &lt;/<span class="variable">AuthContext.Provider</span>&gt;
    );
};

<span class="comment">// PropTypes validation</span>
<span class="variable">AuthProvider</span>.propTypes = {
    children: PropTypes.node.isRequired,
};

<span class="comment">// Export the context and provider</span>
<span class="keyword">export</span> <span class="keyword">default</span> <span class="variable">AuthContext</span>;
            </code></pre>
        </div>

        <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-green-400 mb-2">Features Included</h3>
                <ul class="space-y-2 text-sm text-gray-300">
                    <li class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        User authentication state management
                    </li>
                    <li class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Login/logout functionality
                    </li>
                    <li class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Persistent auth with localStorage
                    </li>
                    <li class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Loading and error states
                    </li>
                    <li class="flex items-center">
                        <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Custom hook (useAuth) for easy consumption
                    </li>
                </ul>
            </div>
            
            <div class="bg-gray-800 p-4 rounded-lg">
                <h3 class="text-lg font-semibold text-blue-400 mb-2">Usage Example</h3>
                <div class="text-sm text-gray-300 space-y-2">
                    <p>Wrap your app with AuthProvider:</p>
                    <pre class="bg-gray-900 p-2 rounded text-xs">
// index.jsx or App.jsx
&lt;AuthProvider&gt;
    &lt;App /&gt;
&lt;/AuthProvider&gt;</pre>
                    <p>Use in components:</p>
                    <pre class="bg-gray-900 p-2 rounded text-xs">
const { user, login, logout } = useAuth();</pre>
                </div>
            </div>
        </div>
    </div>

    <script type="text/babel">
        // This is just for demonstration - the actual React code is in the code block above
        console.log('AuthContext.jsx loaded for demonstration');
    </script>
</body>
</html>