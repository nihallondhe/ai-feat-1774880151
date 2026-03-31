html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - Dashboard</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <div id="root"></div>

    <script type="text/babel">
        const { useState, useEffect } = React;

        // LoginForm Component
        const LoginForm = ({ onLoginSuccess }) => {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [error, setError] = useState('');
            const [loading, setLoading] = useState(false);

            const handleSubmit = async (e) => {
                e.preventDefault();
                setError('');
                setLoading(true);

                // Simulate API call
                setTimeout(() => {
                    if (email === 'admin@example.com' && password === 'password123') {
                        localStorage.setItem('isAuthenticated', 'true');
                        localStorage.setItem('userEmail', email);
                        onLoginSuccess();
                    } else {
                        setError('Invalid email or password');
                    }
                    setLoading(false);
                }, 1000);
            };

            return (
                <div className="max-w-md w-full mx-auto p-6">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login to Dashboard</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : 'Sign In'}
                            </button>
                        </form>
                        
                        <div className="mt-6 text-center text-sm text-gray-600">
                            <p>Demo credentials:</p>
                            <p className="font-mono mt-1">admin@example.com / password123</p>
                        </div>
                    </div>
                </div>
            );
        };

        // Dashboard Component
        const Dashboard = ({ onLogout }) => {
            const [userEmail, setUserEmail] = useState('');

            useEffect(() => {
                const email = localStorage.getItem('userEmail');
                if (email) {
                    setUserEmail(email);
                }
            }, []);

            return (
                <div className="min-h-screen bg-gray-50">
                    <nav className="bg-white shadow-md">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex items-center">
                                    <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-600">{userEmail}</span>
                                    <button
                                        onClick={onLogout}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                    
                    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                        <div className="px-4 py-6 sm:px-0">
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to your Dashboard!</h2>
                                <p className="text-gray-600">
                                    You have successfully logged in. This is your main dashboard where you can manage your account and access all features.
                                </p>
                                
                                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
                                        <h3 className="font-bold text-blue-800 mb-2">Analytics</h3>
                                        <p className="text-blue-600">View your performance metrics and statistics</p>
                                    </div>
                                    <div className="bg-green-50 p-6 rounded-lg border border-green-100">
                                        <h3 className="font-bold text-green-800 mb-2">Reports</h3>
                                        <p className="text-green-600">Generate and download detailed reports</p>
                                    </div>
                                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
                                        <h3 className="font-bold text-purple-800 mb-2">Settings</h3>
                                        <p className="text-purple-600">Configure your account preferences</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            );
        };

        // Main LoginPage Component
        const LoginPage = () => {
            const [isAuthenticated, setIsAuthenticated] = useState(false);

            useEffect(() => {
                // Check if user is already logged in
                const authStatus = localStorage.getItem('isAuthenticated');
                if (authStatus === 'true') {
                    setIsAuthenticated(true);
                }
            }, []);

            const handleLoginSuccess = () => {
                setIsAuthenticated(true);
            };

            const handleLogout = () => {
                localStorage.removeItem('isAuthenticated');
                localStorage.removeItem('userEmail');
                setIsAuthenticated(false);
            };

            return (
                <div>
                    {isAuthenticated ? (
                        <Dashboard onLogout={handleLogout} />
                    ) : (
                        <div className="min-h-screen flex items-center justify-center">
                            <LoginForm onLoginSuccess={handleLoginSuccess} />
                        </div>
                    )}
                </div>
            );
        };

        // Render the app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<LoginPage />);
    </script>
</body>
</html>