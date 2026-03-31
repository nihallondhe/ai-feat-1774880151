html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server.js Update</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-gray-100 min-h-screen p-6">
    <div class="max-w-4xl mx-auto">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-blue-400">backend/server.js</h1>
            <p class="text-gray-400 mt-2">Update main server file to include auth routes and middleware</p>
        </header>

        <main class="bg-gray-800 rounded-lg p-6 font-mono text-sm">
            <div class="mb-4 text-green-400">// backend/server.js - Updated version</div>
            
            <div class="text-cyan-300">const express = require('express');</div>
            <div class="text-cyan-300">const mongoose = require('mongoose');</div>
            <div class="text-cyan-300">const cors = require('cors');</div>
            <div class="text-cyan-300">const dotenv = require('dotenv');</div>
            <div class="mb-4"></div>
            
            <div class="text-cyan-300">// Import auth middleware</div>
            <div class="text-cyan-300">const { authenticateToken } = require('./middleware/authMiddleware');</div>
            <div class="mb-4"></div>
            
            <div class="text-cyan-300">// Import route files</div>
            <div class="text-cyan-300">const authRoutes = require('./routes/authRoutes');</div>
            <div class="text-cyan-300">const userRoutes = require('./routes/userRoutes');</div>
            <div class="text-cyan-300">const apiRoutes = require('./routes/apiRoutes');</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">dotenv.config();</div>
            <div class="mb-4"></div>
            
            <div class="text-cyan-300">const app = express();</div>
            <div class="text-cyan-300">const PORT = process.env.PORT || 5000;</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// Middleware</div>
            <div class="text-cyan-300">app.use(cors());</div>
            <div class="text-cyan-300">app.use(express.json());</div>
            <div class="text-cyan-300">app.use(express.urlencoded({ extended: true }));</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// Database connection</div>
            <div class="text-cyan-300">mongoose.connect(process.env.MONGODB_URI, {</div>
            <div class="text-cyan-300 ml-4">useNewUrlParser: true,</div>
            <div class="text-cyan-300 ml-4">useUnifiedTopology: true</div>
            <div class="text-cyan-300">})</div>
            <div class="text-cyan-300">.then(() => console.log('MongoDB connected'))</div>
            <div class="text-cyan-300">.catch(err => console.log('MongoDB connection error:', err));</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// Routes</div>
            <div class="text-cyan-300">app.use('/api/auth', authRoutes);</div>
            <div class="text-cyan-300">app.use('/api/users', authenticateToken, userRoutes);</div>
            <div class="text-cyan-300">app.use('/api', authenticateToken, apiRoutes);</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// Public routes (no authentication required)</div>
            <div class="text-cyan-300">app.get('/api/public', (req, res) => {</div>
            <div class="text-cyan-300 ml-4">res.json({ message: 'Public endpoint - no auth required' });</div>
            <div class="text-cyan-300">});</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// Error handling middleware</div>
            <div class="text-cyan-300">app.use((err, req, res, next) => {</div>
            <div class="text-cyan-300 ml-4">console.error(err.stack);</div>
            <div class="text-cyan-300 ml-4">res.status(err.status || 500).json({</div>
            <div class="text-cyan-300 ml-8">error: err.message || 'Internal Server Error'</div>
            <div class="text-cyan-300 ml-4">});</div>
            <div class="text-cyan-300">});</div>
            <div class="mb-4"></div>
            
            <div class="text-green-400">// 404 handler</div>
            <div class="text-cyan-300">app.use('*', (req, res) => {</div>
            <div class="text-cyan-300 ml-4">res.status(404).json({ error: 'Endpoint not found' });</div>
            <div class="text-cyan-300">});</div>
            <div class="mb-4"></div>
            
            <div class="text-cyan-300">app.listen(PORT, () => {</div>
            <div class="text-cyan-300 ml-4">console.log(`Server running on port ${PORT}`);</div>
            <div class="text-cyan-300">});</div>
        </main>

        <footer class="mt-8 text-gray-500 text-sm">
            <div class="flex flex-wrap gap-4">
                <div class="bg-gray-800 px-3 py-1 rounded">
                    <span class="text-green-400">✓</span> Auth routes integrated
                </div>
                <div class="bg-gray-800 px-3 py-1 rounded">
                    <span class="text-green-400">✓</span> Middleware applied
                </div>
                <div class="bg-gray-800 px-3 py-1 rounded">
                    <span class="text-green-400">✓</span> Error handling added
                </div>
            </div>
        </footer>
    </div>
</body>
</html>