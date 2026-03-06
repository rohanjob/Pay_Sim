const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.MONGODB_URI || 'mongodb://mongo:27017/payment_gateway',
            {
                // Mongoose 8 defaults are fine
            }
        );
        console.log(`  ✓ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`  ✗ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
