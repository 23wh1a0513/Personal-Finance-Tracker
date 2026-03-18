const express = require('express');
const Finance = require('../models/Finance');
const auth = require('../middleware/auth');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Log to file helper
function logToFile(message) {
  const logPath = path.join(__dirname, '../../logs.txt');
  const timestamp = new Date().toISOString();
  fs.appendFileSync(logPath, `[${timestamp}] ${message}\n`);
}

logToFile('Finance routes initialized');

// DEBUG TEST ENDPOINT
router.post('/debug/test', auth, async (req, res) => {
  try {
    console.log('=== DEBUG TEST ===');
    console.log('User:', req.user);
    console.log('User ID:', req.user._id);
    
    const testData = {
      userId: req.user._id,
      title: 'Test Income',
      description: 'Test Description',
      type: 'income',
      category: 'salary',
      amount: 50000,
      transactionDate: new Date('2026-03-17'),
      recurring: false,
      recurrenceEndDate: null
    };
    
    console.log('Test data:', testData);
    const finance = new Finance(testData);
    console.log('Finance object created');
    
    const saved = await finance.save();
    console.log('Finance saved successfully:', saved._id);
    res.json({ message: 'Success', data: saved });
  } catch (error) {
    console.error('Error in test endpoint:', error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new finance record
router.post('/', auth, async (req, res) => {
  try {
    console.log('\n=== POST /api/finances ===');
    console.log('User ID:', req.user?._id);
    console.log('Raw body:', JSON.stringify(req.body));
    
    const { type, category, amount, transactionDate, recurring, recurrenceEndDate, description, title } = req.body;

    // Simple validation
    console.log(`Validating: type=${type}, category=${category}, amount=${amount}, transactionDate=${transactionDate}`);
    
    if (!type) {
      console.log('VALIDATION FAILED: type is missing');
      return res.status(400).json({ error: 'type is required' });
    }
    if (!category) {
      console.log('VALIDATION FAILED: category is missing');
      return res.status(400).json({ error: 'category is required' });
    }
    if (!amount) {
      console.log('VALIDATION FAILED: amount is missing');
      return res.status(400).json({ error: 'amount is required' });
    }
    if (!transactionDate) {
      console.log('VALIDATION FAILED: transactionDate is missing');
      return res.status(400).json({ error: 'transactionDate is required' });
    }

    const parsedAmount = parseFloat(amount);
    console.log(`Parsed amount: ${parsedAmount} (typeof: ${typeof parsedAmount})`);
    
    const parsedDate = new Date(transactionDate);
    console.log(`Parsed date: ${parsedDate} (valid: ${!isNaN(parsedDate.getTime())})`);

    const financeData = {
      userId: req.user._id,
      title: title || `${category.charAt(0).toUpperCase() + category.slice(1)} ${type}`,
      description: description || '',
      type,
      category,
      amount: parsedAmount,
      transactionDate: parsedDate,
      recurring: recurring ? true : false,
      recurrenceEndDate: recurrenceEndDate ? new Date(recurrenceEndDate) : null
    };

    console.log(`Finance data before save: ${JSON.stringify(financeData)}`);

    const finance = new Finance(financeData);
    console.log('Finance model instance created');
    
    console.log('About to save...');
    const saved = await finance.save();
    console.log(`✓ Finance saved successfully: ${saved._id}`);
    
    res.status(201).json(saved);
    
  } catch (error) {
    console.log('\n✗ ERROR creating finance:');
    console.log(`Message: ${error.message}`);
    console.log(`Name: ${error.name}`);
    
    if (error.errors) {
      console.log('Mongoose Validation errors:');
      Object.keys(error.errors).forEach(field => {
        const err = error.errors[field];
        console.log(`  - ${field}: ${err.message}`);
      });
    }
    
    console.log(`Stack: ${error.stack}`);
    
    if (error.errors) {
      const messages = Object.keys(error.errors)
        .map(k => `${k}: ${error.errors[k].message}`)
        .join('; ');
      return res.status(400).json({ error: messages });
    }
    
    res.status(500).json({ error: error.message || 'Failed to create transaction' });
  }
});

// Get all finances for the authenticated user
// Supports optional month/year query params to include recurring entries for that month
router.get('/', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user._id;

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);

      // Transactions recorded in the requested month
      const baseFinances = await Finance.find({
        userId,
        transactionDate: { $gte: startDate, $lt: endDate }
      }).sort({ transactionDate: -1 });

      // Recurring transactions that should apply to this month
      const recurringFinances = await Finance.find({
        userId,
        recurring: true,
        transactionDate: { $lt: endDate },
        $or: [
          { recurrenceEndDate: null },
          { recurrenceEndDate: { $gte: startDate } }
        ]
      });

      const recurringInstances = recurringFinances.map((recurring) => ({
        ...recurring.toObject(),
        transactionDate: startDate,
        isRecurringInstance: true,
        instanceId: `${recurring._id}-${year}-${month}`
      }));

      const finances = [...baseFinances, ...recurringInstances].sort(
        (a, b) => new Date(b.transactionDate) - new Date(a.transactionDate)
      );

      return res.json(finances);
    }

    const finances = await Finance.find({ userId }).sort({ transactionDate: -1 });
    res.json(finances);
  } catch (error) {
    console.error('Error fetching finances:', error);
    res.status(500).json({ error: 'Failed to fetch finances' });
  }
});

// Get monthly summary - MUST be before /:id route
router.get('/summary/monthly', auth, async (req, res) => {
  try {
    const { month, year } = req.query;
    
    if (!month || !year) {
      return res.status(400).json({ error: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    // Include base transactions for the month
    const baseFinances = await Finance.find({
      userId: req.user._id,
      transactionDate: { $gte: startDate, $lt: endDate }
    });

    // Include recurring transactions for the month
    const recurringFinances = await Finance.find({
      userId: req.user._id,
      recurring: true,
      transactionDate: { $lt: endDate },
      $or: [
        { recurrenceEndDate: null },
        { recurrenceEndDate: { $gte: startDate } }
      ]
    });

    const summary = {
      totalIncome: 0,
      totalExpense: 0,
      netSavings: 0,
      transactions: baseFinances.length + recurringFinances.length
    };

    baseFinances.forEach((finance) => {
      if (finance.type === 'income') {
        summary.totalIncome += finance.amount;
      } else {
        summary.totalExpense += finance.amount;
      }
    });

    recurringFinances.forEach((finance) => {
      if (finance.type === 'income') {
        summary.totalIncome += finance.amount;
      } else {
        summary.totalExpense += finance.amount;
      }
    });

    summary.netSavings = summary.totalIncome - summary.totalExpense;

    res.json(summary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
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

// Update finance record
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Update request for ID:', req.params.id);
    console.log('Update body:', req.body);

    // Validate required fields
    if (!req.body.type || !req.body.category || !req.body.amount || !req.body.transactionDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Parse and validate data
    const amount = parseFloat(req.body.amount);
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a valid positive number' });
    }

    // Handle date string (YYYY-MM-DD format from date input)
    let transactionDate = req.body.transactionDate;
    if (typeof transactionDate === 'string') {
      if (transactionDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        transactionDate = new Date(transactionDate + 'T00:00:00Z');
      } else {
        transactionDate = new Date(transactionDate);
      }
    } else {
      transactionDate = new Date(transactionDate);
    }
    
    if (isNaN(transactionDate.getTime())) {
      return res.status(400).json({ error: 'Invalid transaction date format' });
    }

    let recurrenceEndDate = null;
    if (req.body.recurrenceEndDate) {
      let endDate = req.body.recurrenceEndDate;
      if (typeof endDate === 'string') {
        if (endDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          endDate = new Date(endDate + 'T00:00:00Z');
        } else {
          endDate = new Date(endDate);
        }
      } else {
        endDate = new Date(endDate);
      }
      
      if (!isNaN(endDate.getTime())) {
        recurrenceEndDate = endDate;
      }
    }

    // Generate title
    const title = req.body.title || `${req.body.category.charAt(0).toUpperCase() + req.body.category.slice(1)} ${req.body.type}`;

    const updateData = {
      title: title,
      description: req.body.description || '',
      type: req.body.type,
      category: req.body.category,
      amount: amount,
      transactionDate: transactionDate,
      recurring: req.body.recurring === true || req.body.recurring === 'true',
      recurrenceEndDate: recurrenceEndDate
    };

    const finance = await Finance.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!finance) {
      return res.status(404).json({ error: 'Finance record not found' });
    }
    
    console.log('Finance updated successfully:', finance._id);
    res.json(finance);
  } catch (error) {
    console.error('Error updating finance record:');
    console.error('  Message:', error.message);
    if (error.errors) {
      console.error('  Validation errors:', Object.keys(error.errors).map(k => `${k}: ${error.errors[k].message}`));
    }
    console.error('  Stack:', error.stack);
    
    if (error.errors) {
      const messages = Object.keys(error.errors).map(k => error.errors[k].message).join('; ');
      res.status(400).json({ error: `Validation failed: ${messages}` });
    } else {
      res.status(500).json({ error: error.message || 'Failed to update finance record' });
    }
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

module.exports = router;