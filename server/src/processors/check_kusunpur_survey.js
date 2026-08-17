import { connectDB } from "../config/database.js";
import State from "../models/State.model.js";
import Village from "../models/Village.model.js";
import Survey from "../models/Survey.model.js";

const run = async () => {
  await connectDB();
  const village = await Village.findOne({ slug: "kusunpur" });
  if (!village) {
    console.error("Village kusunpur not found!");
    process.exit(1);
  }
  const survey = await Survey.findOne({ village: village._id }).sort({ updatedAt: -1 });
  if (!survey) {
    console.error("Survey not found for kusunpur!");
    process.exit(1);
  }
  console.log("Survey database document found!");
  console.log("isPublished:", survey.isPublished);
  console.log("processedData structure:");
  console.log(JSON.stringify(survey.processedData, null, 2));
  process.exit(0);
};

run();
