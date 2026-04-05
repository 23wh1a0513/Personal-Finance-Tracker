const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const uri = process.env.DATABASE_URI;
console.log('Using URI:', uri);

(async () => {
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB successfully');
    const User = require('./src/models/User');
    const count = await User.countDocuments();
    console.log('User count:', count);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err.message || err);
    process.exit(1);
  }
})();
