const express = require('express');
const cors = require('cors');
const { connectDB } = require('./utils/connect');
const User = require('./models/User');
const Finance = require('./models/Finance');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB Atlas
connectDB();

// User routes
app.get('/api/users', async (req, res) => {
	try {
		const users = await User.find({}, '-password');
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch users' });
	}
});

// Finance routes
app.get('/api/finances', async (req, res) => {
	try {
		const finances = await Finance.find({}).populate('userId', 'name email');
		res.json(finances);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch finances' });
	}
});

// Add more CRUD routes as needed

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server listening at port ${PORT}`);
});