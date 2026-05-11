const mongoose = require('mongoose');

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri) {
        console.error("MongoDB Connection Error: No URI found in environment variables.");
        return;
    }

    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB Connection Error: ${error.message}`);
    }
};

module.exports = connectDB;
