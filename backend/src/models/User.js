const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    immutable: true
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false   // password not returned in queries
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },

  monthlyIncome: {
    type: Number,
    default: 0,
    min: 0
  },

  currency: {
    type: String,
    default: 'INR'
  },

  profilePic: {
    type: String,
    default: null
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  lastLogin: {
    type: Date,
    default: null
  },

  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-update updatedAt
UserSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('User', UserSchema);
