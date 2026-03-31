html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Auth Service</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Authentication Service</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">authService.js</h2>
            <pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
<code>/**
 * Authentication Service
 * Handles API calls for login, token refresh, and logout
 */

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

class AuthService {
    constructor() {
        this.token = localStorage.getItem('authToken');
        this.refreshToken = localStorage.getItem('refreshToken');
        this.user = JSON.parse(localStorage.getItem('user') || 'null');
    }

    /**
     * Login user with credentials
     * @param {string} email - User email
     * @param {string} password - User password
     * @returns {Promise<Object>} - User data and tokens
     */
    async login(email, password) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const data = await response.json();
            
            // Store tokens and user data
            this.setTokens(data.accessToken, data.refreshToken);
            this.setUser(data.user);
            
            return data;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Refresh access token using refresh token
     * @returns {Promise<Object>} - New access token
     */
    async refreshAccessToken() {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.refreshToken}`
                },
            });

            if (!response.ok) {
                // If refresh fails, clear tokens and redirect to login
                this.clearTokens();
                window.location.href = '/login';
                throw new Error('Session expired. Please login again.');
            }

            const data = await response.json();
            this.setTokens(data.accessToken, this.refreshToken);
            
            return data;
        } catch (error) {
            console.error('Token refresh error:', error);
            throw error;
        }
    }

    /**
     * Logout user and clear all stored data
     * @returns {Promise<void>}
     */
    async logout() {
        try {
            // Call logout endpoint if token exists
            if (this.token) {
                await fetch(`${API_BASE_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clear local storage regardless of API call success
            this.clearTokens();
            this.clearUser();
            
            // Redirect to login page
            window.location.href = '/login';
        }
    }

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    /**
     * Get current user
     * @returns {Object|null}
     */
    getCurrentUser() {
        return this.user;
    }

    /**
     * Get authorization header for API requests
     * @returns {Object}
     */
    getAuthHeader() {
        return {
            'Authorization': `Bearer ${this.token}`
        };
    }

    /**
     * Store tokens in localStorage and service instance
     * @param {string} accessToken - Access token
     * @param {string} refreshToken - Refresh token
     */
    setTokens(accessToken, refreshToken) {
        this.token = accessToken;
        this.refreshToken = refreshToken;
        
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    /**
     * Store user data in localStorage and service instance
     * @param {Object} user - User object
     */
    setUser(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    }

    /**
     * Clear all tokens from localStorage and service instance
     */
    clearTokens() {
        this.token = null;
        this.refreshToken = null;
        
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
    }

    /**
     * Clear user data from localStorage and service instance
     */
    clearUser() {
        this.user = null;
        localStorage.removeItem('user');
    }

    /**
     * Interceptor for API requests to handle token refresh
     * @param {Function} requestFunction - Original request function
     * @returns {Promise} - Response from request
     */
    async withAuth(requestFunction) {
        try {
            return await requestFunction();
        } catch (error) {
            if (error.status === 401 && this.refreshToken) {
                // Token expired, try to refresh
                await this.refreshAccessToken();
                // Retry original request with new token
                return await requestFunction();
            }
            throw error;
        }
    }
}

// Create singleton instance
const authService = new AuthService();

// Export singleton instance
export default authService;</code>
            </pre>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">Usage Example</h2>
            <pre class="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
<code>import authService from './services/authService';

// Example 1: Login
async function handleLogin(email, password) {
    try {
        const result = await authService.login(email, password);
        console.log('Login successful:', result.user);
        // Redirect to dashboard
        window.location.href = '/dashboard';
    } catch (error) {
        console.error('Login failed:', error.message);
    }
}

// Example 2: Making authenticated API call
async function fetchUserData() {
    const request = async () => {
        const response = await fetch('/api/user/profile', {
            headers: {
                'Content-Type': 'application/json',
                ...authService.getAuthHeader()
            }
        });
        return response.json();
    };

    try {
        const data = await authService.withAuth(request);
        console.log('User data:', data);
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

// Example 3: Check authentication status
if (authService.isAuthenticated()) {
    console.log('User is logged in:', authService.getCurrentUser());
} else {
    console.log('User is not logged in');
}

// Example 4: Logout
function handleLogout() {
    authService.logout();
}</code>
            </pre>
        </div>
    </div>
</body>
</html>
<!-- update 1774955255.1604762 -->