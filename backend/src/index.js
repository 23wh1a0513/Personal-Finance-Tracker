const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables from backend/.env if present
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { connectDB } = require('./utils/connect');

// Create logs directory
const logsDir = path.join(__dirname, '..');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Import routes
const authRoutes = require('./routes/auth');
const financeRoutes = require('./routes/finance');
const budgetRoutes = require('./routes/budget');

const app = express();
app.use(express.json());
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  const message = `[${new Date().toISOString()}] ${req.method} ${req.path}\n`;
  process.stderr.write(message);
  fs.appendFileSync(path.join(logsDir, 'api.log'), message);
  next();
});

// Connect to MongoDB Atlas
connectDB().catch(err => {
  console.error('Failed to connect to database:', err);
  process.exit(1);
});

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