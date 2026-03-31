html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Form Component</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div id="root" class="w-full max-w-md"></div>

    <script type="text/babel">
        const { useState } = React;

        const LoginForm = () => {
            const [formData, setFormData] = useState({
                email: '',
                password: ''
            });
            const [errors, setErrors] = useState({});
            const [isSubmitting, setIsSubmitting] = useState(false);
            const [submitError, setSubmitError] = useState('');

            const validateForm = () => {
                const newErrors = {};
                
                if (!formData.email.trim()) {
                    newErrors.email = 'Email is required';
                } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                    newErrors.email = 'Email is invalid';
                }
                
                if (!formData.password) {
                    newErrors.password = 'Password is required';
                } else if (formData.password.length < 6) {
                    newErrors.password = 'Password must be at least 6 characters';
                }
                
                return newErrors;
            };

            const handleChange = (e) => {
                const { name, value } = e.target;
                setFormData(prev => ({
                    ...prev,
                    [name]: value
                }));
                // Clear error when user starts typing
                if (errors[name]) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: ''
                    }));
                }
            };

            const handleSubmit = async (e) => {
                e.preventDefault();
                setSubmitError('');
                
                const validationErrors = validateForm();
                if (Object.keys(validationErrors).length > 0) {
                    setErrors(validationErrors);
                    return;
                }
                
                setIsSubmitting(true);
                
                try {
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // For demo purposes - simulate successful login
                    console.log('Login attempt with:', {
                        email: formData.email,
                        password: '***' // Never log actual passwords
                    });
                    
                    alert(`Login successful for ${formData.email}`);
                    // Reset form on success
                    setFormData({ email: '', password: '' });
                    setErrors({});
                } catch (error) {
                    setSubmitError('Login failed. Please check your credentials and try again.');
                    console.error('Login error:', error);
                } finally {
                    setIsSubmitting(false);
                }
            };

            return (
                <div className="bg-white rounded-lg shadow-lg p-8 w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h2>
                    
                    {submitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
                            {submitError}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="you@example.com"
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                }`}
                                placeholder="••••••••"
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                    Remember me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                                Forgot password?
                            </a>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full py-3 px-4 rounded-md font-medium text-white transition ${
                                isSubmitting 
                                    ? 'bg-blue-400 cursor-not-allowed' 
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            );
        };

        const App = () => (
            <div className="container mx-auto px-4">
                <LoginForm />
            </div>
        );

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>