const express = require('express');
const Budget = require('../models/Budget');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all budgets for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const budgets = await Budget.find({ userId: req.user._id }).sort({ year: -1, month: -1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
});

// Get budget by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Get budget for specific month/year
router.get('/:year/:month', auth, async (req, res) => {
  try {
    const budget = await Budget.findOne({
      userId: req.user._id,
      year: req.params.year,
      month: req.params.month
    });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
});

// Create new budget
router.post('/', auth, async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      userId: req.user._id
    });
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ error: 'Budget already exists for this month/year' });
    } else {
      res.status(500).json({ error: 'Failed to create budget' });
    }
  }
});

// Update budget
router.put('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// Delete budget
router.delete('/:id', auth, async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete budget' });
  }
});

module.exports = router;