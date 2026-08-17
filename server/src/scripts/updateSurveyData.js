// Update existing survey with newly processed data
import "../models/Survey.model.js";
import "../models/Village.model.js";
import "../models/State.model.js";
import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const execFileAsync = promisify(execFile);
const processor = path.resolve("src/processors/vdi_processor.py");

const run = async () => {
  await connectDB();
  
  const Survey = mongoose.model("Survey");
  
  // Find the uploaded survey file
  const survey = await Survey.findOne().sort({ updatedAt: -1 });
  if (!survey) {
    console.error("No survey found!");
    process.exit(1);
  }
  
  console.log("Found survey ID:", survey._id);
  console.log("File path:", survey.uploadedFilePath);
  
  if (!survey.uploadedFilePath) {
    console.error("No uploaded file path in survey!");
    process.exit(1);
  }
  
  const filePath = path.resolve(survey.uploadedFilePath);
  console.log("Processing file:", filePath);
  
  const { stdout } = await execFileAsync(process.env.PYTHON_BIN || "python", [processor, filePath], { maxBuffer: 10 * 1024 * 1024, timeout: 120000 });
  const processedData = JSON.parse(stdout);
  
  console.log("Processing complete. Categories:", processedData.categories.length);
  for (const cat of processedData.categories) {
    console.log(`  ${cat.category}: ${cat.indicators.length} indicators`);
  }
  
  // Update the survey
  survey.processedData = processedData;
  await survey.save();
  
  console.log("\nSurvey updated successfully!");
  
  // Verify
  const verify = await Survey.findById(survey._id).select("processedData.categories");
  console.log("\nVerification - categories now in DB:");
  for (const c of verify.processedData.categories) {
    console.log(`  ${c.category}: ${c.indicators?.length || 0} indicators`);
  }
  
  process.exit(0);
};

run();