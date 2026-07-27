import mongoose from "mongoose";
import { env } from "./env.js";
import {
  instrumentMongoosePerformance,
} from "./mongoosePerformance.js";

export const connectDB = async () => {
  try {
    instrumentMongoosePerformance();

    const connectionInstance = await mongoose.connect(
      env.mongoUri,
      {
        serverSelectionTimeoutMS: 8000,
      }
    );

    console.log(
      `✅ MongoDB Connected: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.error(
      "❌ MongoDB Connection Failed:",
      error.message
    );

    process.exit(1);
  }
};
