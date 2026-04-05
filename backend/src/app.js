const { seedDatabase } = require('./seed');
const { connectDB, disconnectDB } = require('./utils/connect');

const User = require('./models/User');
const Finance = require('./models/Finance');

const displayMessage = async () => {
  console.log("✅ Database seeding completed successfully.\n");

  try {
    await connectDB();

    console.log("👤 The users are:");
    const users = await User.find({});
    users.forEach(user => {
      console.log(`Name: ${user.name}, Email: ${user.email}, Role: ${user.role}`);
    });

    console.log("\n💰 The finance records are:");
    const finances = await Finance.find({})
      .populate('userId', 'name email');

    finances.forEach(finance => {
      console.log(
        `Title: ${finance.title}, ` +
        `User: ${finance.userId.name}, ` +
        `Type: ${finance.type}, ` +
        `Amount: ₹${finance.amount}, ` +
        `Category: ${finance.category}`
      );
    });

    await disconnectDB();
  } catch (error) {
    console.error('❌ Error connecting to the database:', error);
    await disconnectDB();
  }
};

const startApp = async () => {
  await seedDatabase();
  await displayMessage();
};

startApp();
