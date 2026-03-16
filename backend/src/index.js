const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utils/connect');

// Import routes
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const budgetRoutes = require('./routes/budget');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/finances', financeRoutes);
app.use('/api/budgets', budgetRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening at port ${PORT}`);
});