const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    
    if (!uri) {
      console.error("MONGO_URI not set in environment variables");
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected to Atlas");
  } catch (error) {
    console.error("MongoDB connection failed", error);
    process.exit(1);
  }
};

module.exports = connectDB;