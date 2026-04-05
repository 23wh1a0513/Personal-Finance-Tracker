const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true
  },

  title: {
    type: String,
    required: false,
    trim: true,
    default: null
  },

  description: {
    type: String,
    trim: true,
    default: null
  },

  type: {
    type: String,
    required: true,
    enum: ['income', 'expense']
  },

  category: {
    type: String,
    required: true,
    enum: [
      'salary',
      'business',
      'food',
      'transport',
      'shopping',
      'rent',
      'bills',
      'entertainment',
      'health',
      'education',
      'others'
    ]
  },

  amount: {
    type: Number,
    required: true,
    min: 0
  },

  recurring: {
    type: Boolean,
    default: false
  },

  recurrence: {
    type: String,
    enum: ['monthly'],
    default: 'monthly'
  },

  recurrenceEndDate: {
    type: Date,
    default: null
  },

  paymentMethod: {
    type: String,
    enum: ['cash', 'upi', 'card', 'netbanking'],
    default: 'upi'
  },

  transactionDate: {
    type: Date,
    required: true
  },

  financeStatus: {
    type: String,
    enum: ['recorded', 'reviewed', 'flagged'],
    default: 'recorded'
  },

  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    notes: {
      type: String,
      trim: true,
      default: null
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    }
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

}, {
  timestamps: false
});

// auto-update updatedAt
FinanceSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

module.exports = mongoose.model('Finance', FinanceSchema);
