import { connectDB } from "../config/database.js";
import State from "../models/State.model.js";
import Village from "../models/Village.model.js";
import Survey from "../models/Survey.model.js";
import { execSync } from "child_process";
import path from "path";

const run = async () => {
  await connectDB();
  const village = await Village.findOne({ slug: "kusunpur" });
  if (!village) {
    console.log("No village found for kusunpur");
    process.exit(0);
  }
  const surveys = await Survey.find({ village: village._id }).sort({ createdAt: -1 });
  console.log(`Found ${surveys.length} surveys for Kusunpur:`);
  for (const s of surveys) {
    console.log(`Title: ${s.surveyTitle || (s.surveyYear ? `Survey ${s.surveyYear}` : "Untitled Survey")}, File: ${s.file?.originalName}, CreatedAt: ${s.createdAt}`);
    console.log(`Categories count: ${s.processedData?.categories?.length}`);
    if (s.processedData?.categories?.length > 0) {
      console.log("First category details:", JSON.stringify(s.processedData.categories[0], null, 2));
    }
  }
  process.exit(0);
};
run();
