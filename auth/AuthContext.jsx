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
        .keyword { color: #569cd6; }
        .function { color: #dcdcaa; }
        .string { color: #ce9178; }
        .comment { color: #6a9955; }
        .variable { color: #9cdcfe; }
        .constant { color: #4ec9b0; }
    </style>
</head>
<body class="bg-gray-900 text-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
        <h1 class="text-2xl font-bold mb-4 text-green-400">File: auth/AuthContext.jsx</h1>
        <div class="bg-gray-800 rounded-lg p-4 mb-6">
            <p class="text-gray-300 mb-2">Task: Create React context to manage authentication state, JWT token storage, and provide auth methods</p>
        </div>
        
        <div class="code-container bg-black rounded-lg p-6 overflow-x-auto">
            <pre><code>
<span class="comment">// auth/AuthContext.jsx</span>
<span class="keyword">import</span> React, { createContext, useState, useContext, useEffect, useCallback } <span class="keyword">from</span> <span class="string">'react'</span>;
<span class="keyword">import</span> PropTypes <span class="keyword">from</span> <span class="string">'prop-types'</span>;

<span class="comment">// Create the authentication context</span>
<span class="keyword">const</span> <span class="variable">AuthContext</span> = <span class="function">createContext</span>({});

<span class="comment">// Custom hook to use the auth context</span>
<span class="keyword">export const</span> <span class="function">useAuth</span> = () => {
    <span class="keyword">const</span> context = <span class="function">useContext</span>(<span class="variable">AuthContext</span>);
    <span class="keyword">if</span> (!context) {
        <span class="keyword">throw new</span> <span class="function">Error</span>(<span class="string">'useAuth must be used within an AuthProvider'</span>);
    }
    <span class="keyword">return</span> context;
};

<span class="keyword">export const</span> <span class="variable">AuthProvider</span> = ({ children }) => {
    <span class="comment">// State for authentication token and user data</span>
    <span class="keyword">const</span> [token, setToken] = <span class="function">useState</span>(<span class="function">localStorage</span>.<span class="function">getItem</span>(<span class="string">'authToken'</span>) || <span class="keyword">null</span>);
    <span class="keyword">const</span> [user, setUser] = <span class="function">useState</span>(<span class="keyword">null</span>);
    <span class="keyword">const</span> [isLoading, setIsLoading] = <span class="function">useState</span>(<span class="keyword">true</span>);

    <span class="comment">// Function to decode JWT token and extract user data</span>
    <span class="keyword">const</span> <span class="function">decodeToken</span> = <span class="function">useCallback</span>((token) => {
        <span class="keyword">if</span> (!token) <span class="keyword">return</span> <span class="keyword">null</span>;
        
        <span class="keyword">try</span> {
            <span class="keyword">const</span> base64Url = token.<span class="function">split</span>(<span class="string">'.'</span>)[1];
            <span class="keyword">const</span> base64 = base64Url.<span class="function">replace</span>(/-/g, <span class="string">'+'</span>).<span class="function">replace</span>(/_/g, <span class="string">'/'</span>);
            <span class="keyword">const</span> jsonPayload = <span class="function">decodeURIComponent</span>(
                <span class="function">atob</span>(base64)
                    .<span class="function">split</span>(<span class="string">''</span>)
                    .<span class="function">map</span>(c => <span class="string">'%'</span> + (<span class="string">'00'</span> + c.<span class="function">charCodeAt</span>(0).<span class="function">toString</span>(16)).<span class="function">slice</span>(-2))
                    .<span class="function">join</span>(<span class="string">''</span>)
            );
            <span class="keyword">return</span> <span class="function">JSON</span>.<span class="function">parse</span>(jsonPayload);
        } <span class="keyword">catch</span> (error) {
            <span class="function">console</span>.<span class="function">error</span>(<span class="string">'Error decoding token:'</span>, error);
            <span class="keyword">return</span> <span class="keyword">null</span>;
        }
    }, []);

    <span class="comment">// Initialize user data from token on mount</span>
    <span class="function">useEffect</span>(() => {
        <span class="keyword">if</span> (token) {
            <span class="keyword">const</span> decodedUser = <span class="function">decodeToken</span>(token);
            <span class="function">setUser</span>(decodedUser);
        }
        <span class="function">setIsLoading</span>(<span class="keyword">false</span>);
    }, [token, decodeToken]);

    <span class="comment">// Login function - stores token and updates state</span>
    <span class="keyword">const</span> <span class="function">login</span> = <span class="function">useCallback</span>((newToken) => {
        <span class="function">localStorage</span>.<span class="function">setItem</span>(<span class="string">'authToken'</span>, newToken);
        <span class="function">setToken</span>(newToken);
        <span class="keyword">const</span> decodedUser = <span class="function">decodeToken</span>(newToken);
        <span class="function">setUser</span>(decodedUser);
    }, [decodeToken]);

    <span class="comment">// Logout function - clears token and user data</span>
    <span class="keyword">const</span> <span class="function">logout</span> = <span class="function">useCallback</span>(() => {
        <span class="function">localStorage</span>.<span class="function">removeItem</span>(<span class="string">'authToken'</span>);
        <span class="function">setToken</span>(<span class="keyword">null</span>);
        <span class="function">setUser</span>(<span class="keyword">null</span>);
    }, []);

    <span class="comment">// Check if user is authenticated</span>
    <span class="keyword">const</span> <span class="function">isAuthenticated</span> = <span class="function">useCallback</span>(() => {
        <span class="keyword">if</span> (!token) <span class="keyword">return</span> <span class="keyword">false</span>;
        
        <span class="keyword">const</span> decodedToken = <span class="function">decodeToken</span>(token);
        <span class="keyword">if</span> (!decodedToken) <span class="keyword">return</span> <span class="keyword">false</span>;
        
        <span class="comment">// Check if token is expired</span>
        <span class="keyword">const</span> currentTime = <span class="function">Date</span>.<span class="function">now</span>() / 1000;
        <span class="keyword">return</span> decodedToken.exp > currentTime;
    }, [token, decodeToken]);

    <span class="comment">// Get authorization header for API requests</span>
    <span class="keyword">const</span> <span class="function">getAuthHeader</span> = <span class="function">useCallback</span>(() => {
        <span class="keyword">return</span> token ? { <span class="variable">Authorization</span>: <span class="string">`Bearer ${token}`</span> } : {};
    }, [token]);

    <span class="comment">// Update user data (for profile updates, etc.)</span>
    <span class="keyword">const</span> <span class="function">updateUser</span> = <span class="function">useCallback</span>((updatedUserData) => {
        <span class="function">setUser</span>(prev => ({ ...prev, ...updatedUserData }));
    }, []);

    <span class="comment">// Context value containing all auth methods and state</span>
    <span class="keyword">const</span> contextValue = {
        token,
        user,
        isLoading,
        login,
        logout,
        isAuthenticated,
        getAuthHeader,
        updateUser,
        setToken: <span class="function">useCallback</span>((newToken) => {
            <span class="function">login</span>(newToken);
        }, [login])
    };

    <span class="keyword">return</span> (
        &lt;<span class="variable">AuthContext.Provider</span> <span class="variable">value</span>={contextValue}&gt;
            {children}
        &lt;/<span class="variable">AuthContext.Provider</span>&gt;
    );
};

<span class="variable">AuthProvider</span>.<span class="variable">propTypes</span> = {
    children: <span class="variable">PropTypes</span>.<span class="variable">node</span>.<span class="variable">isRequired</span>
};

<span class="keyword">export default</span> <span class="variable">AuthContext</span>;
            </code></pre>
        </div>

        <div class="mt-8 p-4 bg-gray-800 rounded-lg">
            <h2 class="text-lg font-semibold text-green-400 mb-2">Features Included:</h2>
            <ul class="list-disc pl-5 text-gray-300 space-y-1">
                <li>JWT token storage in localStorage</li>
                <li>Token decoding and validation</li>
                <li>Login/logout functionality</li>
                <li>Authentication state management</li>
                <li>Authorization header generation</li>
                <li>User data management</li>
                <li>Loading state for async operations</li>
                <li>PropTypes validation</li>
                <li>Custom hook for easy context consumption</li>
            </ul>
        </div>
    </div>

    <script type="text/babel">
        // This is just for demonstration - in a real app, you would import the AuthContext
        console.log('AuthContext.jsx loaded successfully');
    </script>
</body>
</html>
<!-- update 1774955254.6343122 -->