import mongoose from "mongoose";

const uri = "mongodb+srv://podpeople100:Vision123@fitnessdatabase.yb9vzyw.mongodb.net/?retryWrites=true&w=majority";

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      dbName: "fitnessDatabase",  
    });

    console.log("MongoDB connected!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    process.exit(1); // stop server if DB fails
  }
};
