import "dotenv/config";
import mongoose from "mongoose";

import {connectDB} from "../config/database.js";
import State from "../models/State.model.js";

const states = [
  {
    name: "Odisha",
    slug: "odisha",
    code: "ODISHA",
    description: "CSIR SMART Village projects in Odisha.",
    sortOrder: 1,
    isPublished: true,
  },
  {
    name: "Assam",
    slug: "assam",
    code: "ASSAM",
    description: "CSIR SMART Village projects in Assam.",
    sortOrder: 2,
    isPublished: true,
  },
  {
    name: "Rajasthan",
    slug: "rajasthan",
    code: "RAJASTHAN",
    description: "CSIR SMART Village projects in Rajasthan.",
    sortOrder: 3,
    isPublished: true,
  },
  {
    name: "Madhya Pradesh",
    slug: "madhya-pradesh",
    code: "MADHYA_PRADESH",
    description:
      "CSIR SMART Village projects in Madhya Pradesh.",
    sortOrder: 4,
    isPublished: true,
  },
];

const seedStates = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding States...");

for (const state of states) {
  await State.updateOne(
    { code: state.code },
    { $set: state },
    { upsert: true }
  );
}

    console.log("✅ States seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed states");
    console.error(error);

    process.exit(1);
  }
};

seedStates();
