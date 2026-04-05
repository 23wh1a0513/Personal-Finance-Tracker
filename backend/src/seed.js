const { connectDB, disconnectDB } = require('./utils/connect');
const User = require('./models/User');
const Finance = require('./models/Finance');

const seedDatabase = async (isStandalone = false) => {
  try {
    // Only connect if called as standalone script
    if (isStandalone) {
      await connectDB();
      console.log('Connected to the database');
    }

    // Clear existing data
    await User.deleteMany({});
    await Finance.deleteMany({});

    // Seed Users
    const users = [];
    const userData = [
      {
        name: 'Alice User',
        email: 'alice@gmail.com',
        password: 'password123',
        role: 'user',
        monthlyIncome: 30000,
        currency: 'INR'
      },
      {
        name: 'Bob User',
        email: 'bob@gmail.com',
        password: 'password123',
        role: 'user',
        monthlyIncome: 45000,
        currency: 'INR'
      }
    ];

    for (const user of userData) {
      const newUser = new User(user);
      await newUser.save();
      users.push(newUser);
    }

    // Seed Finance Records
    await Finance.create([
      {
        userId: users[0]._id,
        title: 'January Salary',
        description: 'Monthly salary credited',
        type: 'income',
        category: 'salary',
        amount: 30000,
        paymentMethod: 'netbanking',
        transactionDate: new Date('2024-01-01')
      },
      {
        userId: users[0]._id,
        title: 'Grocery Shopping',
        description: 'Monthly groceries',
        type: 'expense',
        category: 'food',
        amount: 2500,
        paymentMethod: 'upi',
        transactionDate: new Date('2024-01-05')
      },
      {
        userId: users[1]._id,
        title: 'Freelance Payment',
        description: 'Website development project',
        type: 'income',
        category: 'business',
        amount: 15000,
        paymentMethod: 'netbanking',
        transactionDate: new Date('2024-01-03')
      },
      {
        userId: users[1]._id,
        title: 'House Rent',
        description: 'Monthly house rent',
        type: 'expense',
        category: 'rent',
        amount: 12000,
        recurring: true,
        recurrenceEndDate: null,
        paymentMethod: 'upi',
        transactionDate: new Date('2024-01-02')
      }
    ]);

    console.log('Database seeded successfully');
    
    // Only disconnect if called as standalone script
    if (isStandalone) {
      await disconnectDB();
    }
  } catch (err) {
    console.error('Database seeding error:', err);
    if (isStandalone) {
      process.exit(1);
    }
  }
};

module.exports = { seedDatabase };
