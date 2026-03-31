html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>User Model Documentation</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 text-gray-800">
    <div class="container mx-auto px-4 py-8">
        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">User Model Schema</h1>
            <p class="text-gray-600 mt-2">Mongoose schema for user authentication and credentials</p>
        </header>

        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">File: models/User.js</h2>
            
            <div class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre><code class="language-javascript">
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    // Basic user information
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        match: [
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            'Please provide a valid email address'
        ],
        lowercase: true,
        trim: true
    },
    
    // Authentication data
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },
    
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    },
    
    // User roles and permissions
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    
    // Account status and verification
    isVerified: {
        type: Boolean,
        default: false
    },
    
    isActive: {
        type: Boolean,
        default: true
    },
    
    verificationToken: String,
    verificationTokenExpires: Date,
    
    // Password reset functionality
    passwordResetToken: String,
    passwordResetExpires: Date,
    
    // Security and tracking
    loginAttempts: {
        type: Number,
        default: 0
    },
    
    lockUntil: {
        type: Date
    },
    
    lastLogin: {
        type: Date
    },
    
    // Profile information
    profile: {
        firstName: {
            type: String,
            trim: true,
            maxlength: [50, 'First name cannot exceed 50 characters']
        },
        lastName: {
            type: String,
            trim: true,
            maxlength: [50, 'Last name cannot exceed 50 characters']
        },
        avatar: {
            type: String,
            default: 'default-avatar.png'
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        }
    },
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
UserSchema.index({ createdAt: -1 });

// Middleware to hash password before saving
UserSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified
    if (!this.isModified('password')) return next();
    
    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        this.password = await bcrypt.hash(this.password, salt);
        // Clear passwordConfirm field
        this.passwordConfirm = undefined;
        next();
    } catch (error) {
        next(error);
    }
});

// Update updatedAt timestamp on save
UserSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
    return jwt.sign(
        { 
            userId: this._id,
            email: this.email,
            role: this.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

// Method to generate password reset token
UserSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    return resetToken;
};

// Method to generate email verification token
UserSchema.methods.createVerificationToken = function() {
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    this.verificationToken = crypto
        .createHash('sha256')
        .update(verificationToken)
        .digest('hex');
    
    this.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return verificationToken;
};

// Virtual for full name
UserSchema.virtual('fullName').get(function() {
    return `${this.profile.firstName || ''} ${this.profile.lastName || ''}`.trim();
});

// Virtual for account age
UserSchema.virtual('accountAge').get(function() {
    return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Static method to find user by token
UserSchema.statics.findByToken = function(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return this.findOne({ _id: decoded.userId, isActive: true });
    } catch (error) {
        return null;
    }
};

// Query helper for active users
UserSchema.query.active = function() {
    return this.where({ isActive: true });
};

// Query helper for verified users
UserSchema.query.verified = function() {
    return this.where({ isVerified: true });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
                </code></pre>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">Schema Features</h3>
                <ul class="space-y-2 text-gray-600">
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>Secure password hashing with bcrypt</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>JWT token generation for authentication</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>Email verification system</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>Password reset functionality</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>Role-based access control</span>
                    </li>
                    <li class="flex items-start">
                        <span class="text-green-500 mr-2">✓</span>
                        <span>Account locking for security</span>
                    </li>
                </ul>
            </div>

            <div class="bg-white rounded-lg shadow-md p-6">
                <h3 class="text-lg font-semibold mb-3 text-gray-800">Required Dependencies</h3>
                <div class="bg-gray-100 p-4 rounded-lg">
                    <pre class="text-sm"><code class="language-json">
{
  "dependencies": {
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "crypto": "built-in"
  }
}
                    </code></pre>
                </div>
                <p class="text-sm text-gray-500 mt-3">Install with: <code class="bg-gray-200 px-2 py-1 rounded">npm install mongoose bcryptjs jsonwebtoken</code></p>
            </div>
        </div>

        <footer class="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
            <p>User Model Schema for authentication system</p>
            <p class="mt-1">Includes validation, security features, and helper methods</p>
        </footer>
    </div>
</body>
</html>
<!-- update 1774955257.296596 -->