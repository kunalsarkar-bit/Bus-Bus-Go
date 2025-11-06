const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Add these options for better connection handling
      serverSelectionTimeoutMS: 5000,  // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
      maxPoolSize: 10                 // Maintain up to 10 socket connections
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;