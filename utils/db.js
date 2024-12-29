const mongoose = require('mongoose');
const config = require('../src/config/config');

const connectDB = async () => {
    try {
        await mongoose.connect(config.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
