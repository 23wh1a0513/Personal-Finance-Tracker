const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    immutable: true
  },

  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },

  year: {
    type: Number,
    required: true,
    min: 2020
  },

  totalBudget: {
    type: Number,
    required: true,
    min: 0
  },

  categories: [{
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
    }
  }],

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
BudgetSchema.pre('save', async function () {
  this.updatedAt = Date.now();
});

// Ensure unique budget per user per month/year
BudgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', BudgetSchema);