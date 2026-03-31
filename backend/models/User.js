html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Model Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800 p-6">
    <div class="max-w-4xl mx-auto">
        <h1 class="text-3xl font-bold mb-6 text-blue-600">User Model Implementation</h1>
        
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-2xl font-semibold mb-4">File: backend/models/User.js</h2>
            <p class="mb-4 text-gray-600">This file defines the User model with email and hashed password fields for authentication.</p>
            
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code class="language-javascript">
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON response
UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', UserSchema);
                </code></pre>
            </div>
            
            <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 class="text-lg font-semibold mb-2 text-blue-700">Key Features:</h3>
                <ul class="list-disc pl-5 space-y-1">
                    <li>Email validation and normalization</li>
                    <li>Password hashing using bcrypt</li>
                    <li>Password comparison method</li>
                    <li>Automatic password removal from JSON responses</li>
                    <li>Timestamps for user creation</li>
                </ul>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-md p-6">
            <h2 class="text-xl font-semibold mb-3">Dependencies Required:</h2>
            <div class="bg-gray-100 p-3 rounded">
                <code class="text-gray-700">npm install mongoose bcryptjs</code>
            </div>
        </div>
    </div>
</body>
</html>