import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'البريد الإلكتروني مطلوب'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'البريد الإلكتروني غير صحيح']
  },
  password: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    minlength: [6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'],
    select: false // Don't return password by default
  },
  role: {
    type: String,
    enum: ['owner', 'admin'],
    default: 'admin'
  },
  mustChangePassword: {
    type: Boolean,
    default: false
  },
  inviteToken: {
    type: String,
    select: false
  },
  inviteTokenExpiry: {
    type: Date,
    select: false
  },
  lastSignInAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('خطأ في مقارنة كلمة المرور');
  }
};

// Method to generate invite token
userSchema.methods.generateInviteToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.inviteToken = crypto.createHash('sha256').update(token).digest('hex');
  this.inviteTokenExpiry = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days
  
  return token;
};

// Remove sensitive data when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.inviteToken;
  delete user.inviteTokenExpiry;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;
