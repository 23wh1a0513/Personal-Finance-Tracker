const express = require('express');
const Finance = require('../models/Finance');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all finances for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const finances = await Finance.find({ userId: req.user._id }).sort({ transactionDate: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

// Get finance by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const finance = await Finance.findOne({ _id: req.params.id, userId: req.user._id });
    if (!finance) {
      return res.status(404).json({ error: 'Finance record not found' });
    }
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finance' });
  }
});

// Create new finance record
router.post('/', auth, async (req, res) => {
  try {
    const finance = new Finance({
      ...req.body,
      userId: req.user._id
    });
    await finance.save();
    res.status(201).json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create finance record' });
  }
});

// Update finance record
router.put('/:id', auth, async (req, res) => {
  try {
    const finance = await Finance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!finance) {
      return res.status(404).json({ error: 'Finance record not found' });
    }
    res.json(finance);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update finance record' });
  }
});

// Delete finance record
router.delete('/:id', auth, async (req, res) => {
  try {
    const finance = await Finance.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!finance) {
      return res.status(404).json({ error: 'Finance record not found' });
    }
    res.json({ message: 'Finance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete finance record' });
  }
});

// Get finances by type (income/expense)
router.get('/type/:type', auth, async (req, res) => {
  try {
    const finances = await Finance.find({
      userId: req.user._id,
      type: req.params.type
    }).sort({ transactionDate: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

// Get finances by category
router.get('/category/:category', auth, async (req, res) => {
  try {
    const finances = await Finance.find({
      userId: req.user._id,
      category: req.params.category
    }).sort({ transactionDate: -1 });
    res.json(finances);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

// Get monthly summary
router.get('/summary/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const finances = await Finance.find({
      userId: req.user._id,
      transactionDate: { $gte: startDate, $lt: endDate }
    });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      netSavings: 0,
      transactions: finances.length
    };

    finances.forEach(finance => {
      if (finance.type === 'income') {
        summary.totalIncome += finance.amount;
      } else {
        summary.totalExpense += finance.amount;
      }
    });

    summary.netSavings = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

module.exports = router;