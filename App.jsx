html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>React App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://unpkg.com/react-router-dom@6/dist/react-router-dom.development.js"></script>
</head>
<body class="bg-gray-50 min-h-screen">
    <div id="root" class="min-h-screen"></div>

    <script type="text/babel">
        const { useState, useEffect, createContext, useContext } = React;
        const { BrowserRouter, Routes, Route, Navigate, Outlet } = ReactRouterDOM;

        // Auth Context
        const AuthContext = createContext();

        const AuthProvider = ({ children }) => {
            const [user, setUser] = useState(null);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                // Check for stored auth token on initial load
                const token = localStorage.getItem('authToken');
                if (token) {
                    // In a real app, you would validate the token with your backend
                    setUser({ id: 1, name: 'John Doe', email: 'john@example.com' });
                }
                setLoading(false);
            }, []);

            const login = (email, password) => {
                // Simulate API call
                return new Promise((resolve) => {
                    setTimeout(() => {
                        const userData = { id: 1, name: 'John Doe', email };
                        setUser(userData);
                        localStorage.setItem('authToken', 'fake-jwt-token');
                        resolve(userData);
                    }, 500);
                });
            };

            const logout = () => {
                setUser(null);
                localStorage.removeItem('authToken');
            };

            const value = {
                user,
                loading,
                login,
                logout
            };

            return (
                <AuthContext.Provider value={value}>
                    {children}
                </AuthContext.Provider>
            );
        };

        const useAuth = () => {
            return useContext(AuthContext);
        };

        // Protected Route Component
        const ProtectedRoute = ({ children }) => {
            const { user, loading } = useAuth();

            if (loading) {
                return (
                    <div className="flex items-center justify-center min-h-screen">
                        <div className="text-lg">Loading...</div>
                    </div>
                );
            }

            if (!user) {
                return <Navigate to="/login" replace />;
            }

            return children;
        };

        // Layout Components
        const MainLayout = () => {
            const { user, logout } = useAuth();

            return (
                <div className="min-h-screen flex flex-col">
                    <nav className="bg-white shadow-md">
                        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                            <div className="text-xl font-bold text-blue-600">MyApp</div>
                            <div className="flex items-center space-x-4">
                                {user ? (
                                    <>
                                        <span className="text-gray-700">Welcome, {user.name}</span>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <a href="/login" className="text-blue-600 hover:text-blue-800">
                                        Login
                                    </a>
                                )}
                            </div>
                        </div>
                    </nav>
                    <main className="flex-grow container mx-auto px-4 py-8">
                        <Outlet />
                    </main>
                </div>
            );
        };

        // Page Components
        const HomePage = () => (
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome Home</h1>
                <p className="text-gray-600">This is the public home page.</p>
            </div>
        );

        const DashboardPage = () => {
            const { user } = useAuth();
            
            return (
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">User Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {user?.name}</p>
                            <p><span className="font-medium">Email:</span> {user?.email}</p>
                            <p><span className="font-medium">ID:</span> {user?.id}</p>
                        </div>
                        <div className="mt-6 p-4 bg-blue-50 rounded">
                            <p className="text-blue-700">This is a protected route. Only authenticated users can see this content.</p>
                        </div>
                    </div>
                </div>
            );
        };

        const LoginPage = () => {
            const [email, setEmail] = useState('');
            const [password, setPassword] = useState('');
            const [error, setError] = useState('');
            const [isLoading, setIsLoading] = useState(false);
            const { login, user } = useAuth();

            useEffect(() => {
                if (user) {
                    window.location.href = '/dashboard';
                }
            }, [user]);

            const handleSubmit = async (e) => {
                e.preventDefault();
                setError('');
                setIsLoading(true);

                try {
                    await login(email, password);
                    // Navigation is handled by the useEffect above
                } catch (err) {
                    setError('Invalid credentials. Try: john@example.com / any password');
                } finally {
                    setIsLoading(false);
                }
            };

            if (user) {
                return null; // Will redirect via useEffect
            }

            return (
                <div className="max-w-md mx-auto">
                    <div className="bg-white rounded-lg shadow-md p-8">
                        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login</h1>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Any password works"
                                    required
                                />
                            </div>
                            {error && (
                                <div className="p-3 bg-red-50 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <div className="mt-6 text-center text-gray-600">
                            <p>Demo credentials:</p>
                            <p className="font-mono">Email: john@example.com</p>
                            <p className="font-mono">Password: any</p>
                        </div>
                    </div>
                </div>
            );
        };

        const SettingsPage = () => (
            <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Settings</h1>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-gray-600">This is another protected route for settings management.</p>
                </div>
            </div>
        );

        const NotFoundPage = () => (
            <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
                <p className="text-gray-600">The page you're looking for doesn't exist.</p>
                <a href="/" className="inline-block mt-6 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Go Home
                </a>
            </div>
        );

        // Main App Component
        const App = () => {
            return (
                <AuthProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<HomePage />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="dashboard" element={
                                    <ProtectedRoute>
                                        <DashboardPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="settings" element={
                                    <ProtectedRoute>
                                        <SettingsPage />
                                    </ProtectedRoute>
                                } />
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </AuthProvider>
            );
        };

        // Render the app
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
<!-- update 1774955258.3850281 -->