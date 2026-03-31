html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ProtectedRoute Component</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body class="bg-gray-100 min-h-screen p-8">
    <div id="root" class="max-w-4xl mx-auto"></div>

    <script type="text/babel">
        const { useState, useEffect, useContext, createContext } = React;

        // Create Auth Context
        const AuthContext = createContext();

        // Mock Auth Provider Component
        const AuthProvider = ({ children }) => {
            const [user, setUser] = useState(null);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                // Simulate authentication check
                const timer = setTimeout(() => {
                    const mockUser = localStorage.getItem('user');
                    if (mockUser) {
                        setUser(JSON.parse(mockUser));
                    }
                    setLoading(false);
                }, 500);

                return () => clearTimeout(timer);
            }, []);

            const login = (userData) => {
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData));
            };

            const logout = () => {
                setUser(null);
                localStorage.removeItem('user');
            };

            return (
                <AuthContext.Provider value={{ user, loading, login, logout }}>
                    {children}
                </AuthContext.Provider>
            );
        };

        // ProtectedRoute Component
        const ProtectedRoute = ({ children, redirectTo = "/login" }) => {
            const { user, loading } = useContext(AuthContext);
            const [shouldRedirect, setShouldRedirect] = useState(false);

            useEffect(() => {
                if (!loading && !user) {
                    setShouldRedirect(true);
                }
            }, [user, loading]);

            if (loading) {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Checking authentication...</p>
                        </div>
                    </div>
                );
            }

            if (shouldRedirect) {
                // In a real app, you would use react-router's Navigate component
                // For this demo, we'll show a message and simulate redirection
                return (
                    <div className="text-center p-8">
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
                            <p className="font-bold">Authentication Required</p>
                            <p>Redirecting to login page...</p>
                        </div>
                        <button 
                            onClick={() => window.location.href = redirectTo}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Go to Login
                        </button>
                    </div>
                );
            }

            return children;
        };

        // Example Dashboard Component
        const Dashboard = () => {
            const { user, logout } = useContext(AuthContext);

            return (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Logout
                        </button>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h2 className="text-lg font-semibold text-blue-800 mb-2">Welcome, {user?.name}!</h2>
                        <p className="text-blue-700">This is a protected route that only authenticated users can access.</p>
                        <p className="text-blue-700 mt-2">Your email: {user?.email}</p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700">Profile</h3>
                            <p className="text-gray-600 text-sm mt-1">View and edit your profile information</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700">Settings</h3>
                            <p className="text-gray-600 text-sm mt-1">Configure your account settings</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-700">Activity</h3>
                            <p className="text-gray-600 text-sm mt-1">View your recent activity</p>
                        </div>
                    </div>
                </div>
            );
        };

        // Example Login Component
        const Login = () => {
            const { login } = useContext(AuthContext);
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');

            const handleSubmit = (e) => {
                e.preventDefault();
                // Mock login
                login({
                    id: 1,
                    name: 'John Doe',
                    email: email || 'john@example.com',
                    role: 'user'
                });
                window.location.href = '/dashboard';
            };

            return (
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Enter your password"
                            />
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                            >
                                Sign In
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                Demo credentials: Any email/password will work
                            </p>
                        </div>
                    </form>
                </div>
            );
        };

        // Demo App Component
        const App = () => {
            const [currentRoute, setCurrentRoute] = useState('/dashboard');

            return (
                <AuthProvider>
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-gray-800 text-white p-4">
                            <h1 className="text-2xl font-bold">ProtectedRoute Demo</h1>
                            <p className="text-gray-300">React component for protecting authenticated routes</p>
                        </div>
                        
                        <div className="p-4 border-b">
                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setCurrentRoute('/dashboard')}
                                    className={`px-4 py-2 rounded ${currentRoute === '/dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={() => setCurrentRoute('/login')}
                                    className={`px-4 py-2 rounded ${currentRoute === '/login' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => {
                                        localStorage.removeItem('user');
                                        window.location.reload();
                                    }}
                                    className="px-4 py-2 rounded bg-red-600 text-white"
                                >
                                    Clear Auth
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {currentRoute === '/dashboard' ? (
                                <ProtectedRoute redirectTo="/login">
                                    <Dashboard />
                                </ProtectedRoute>
                            ) : (
                                <Login />
                            )}
                        </div>

                        <div className="bg-gray-50 p-6 border-t">
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">ProtectedRoute Features:</h2>
                            <ul className="list-disc pl-5 text-gray-600 space-y-1">
                                <li>Checks authentication status using context</li>
                                <li>Shows loading state while checking auth</li>
                                <li>Redirects to login if user is not authenticated</li>
                                <li>Renders children only when authenticated</li>
                                <li>Customizable redirect path</li>
                            </ul>
                        </div>
                    </div>
                </AuthProvider>
            );
        };

        ReactDOM.render(<App />, document.getElementById('root'));
    </script>
</body>
</html>
<!-- update 1774955255.7131064 -->