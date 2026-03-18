const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const redactUri = (uri) => {
    if (!uri) return uri;
    // hide credentials for logging purposes
    return uri.replace(/(mongodb\+srv:\/\/)([^@]+)@/, '$1****@');
};

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/personal-finance';
        console.log(`Connecting to MongoDB: ${redactUri(uri)}`);
        await mongoose.connect(uri);
        console.log('Database connected successfully');
        return mongoose;
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Database disconnected successfully');
    } catch (error) {
        console.error('Database disconnection error:', error);
    }
}

module.exports = { connectDB, disconnectDB };