import { execFile } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import os from "os";
import path from "path";
import { randomUUID } from "crypto";
import Survey from "../../models/Survey.model.js";
import Village from "../../models/Village.model.js";
import ApiError from "../../utils/ApiError.js";

const execFileAsync = promisify(execFile);
const processor = path.resolve("src/processors/vdi_processor.py");

const processWorkbook = async (file) => {
  const temp = path.join(os.tmpdir(), `${randomUUID()}.xlsx`);
  await fs.writeFile(temp, file.buffer);
  try {
    const { stdout } = await execFileAsync(process.env.PYTHON_BIN || "python", [processor, temp], { maxBuffer: 10 * 1024 * 1024, timeout: 120000 });
    return JSON.parse(stdout);
  } catch (error) {
    throw new ApiError(422, `Unable to process VDI workbook: ${error.stderr || error.message}`);
  } finally { await fs.unlink(temp).catch(() => undefined); }
};

const displayTitle = (survey) =>
  survey.surveyTitle || (survey.surveyYear ? `Survey ${survey.surveyYear}` : "Untitled Survey");

export const createSurvey = async ({ villageId, surveyTitle, surveyId, file, adminId }) => {
  const village = await Village.findById(villageId);
  if (!village) throw new ApiError(404, "Village not found.");

  const uploadDir = path.resolve("uploads/surveys");
  await fs.mkdir(uploadDir, { recursive: true });

  const storedName = `${villageId}-${randomUUID()}.xlsx`;
  const uploadedFilePath = path.join(uploadDir, storedName);
  await fs.writeFile(uploadedFilePath, file.buffer);

  const processedData = await processWorkbook(file);
  const surveyData = {
    state: village.state,
    village: village._id,
    surveyTitle,
    file: { originalName: file.originalname, mimeType: file.mimetype, size: file.size },
    uploadedFilePath,
    processedData,
    uploadedBy: adminId,
    isPublished: true,
  };

  if (surveyId) {
    const survey = await Survey.findOneAndUpdate(
      { _id: surveyId, village: village._id },
      surveyData,
      { new: true, runValidators: true }
    );
    if (!survey) throw new ApiError(404, "Survey to replace was not found.");
    return survey;
  }

  return Survey.create(surveyData);
};

export const getSurveyOptions = async (state, village) => {
  const surveys = await Survey.find({ state, village, isPublished: true })
    .sort({ updatedAt: -1 })
    .select("surveyTitle surveyYear updatedAt");

  return surveys.map((survey) => ({
    _id: survey._id,
    surveyTitle: displayTitle(survey),
    surveyYear: survey.surveyYear,
    updatedAt: survey.updatedAt,
  }));
};

export const getSurveyById = async (state, village, surveyId) => {
  const survey = await Survey.findOne({ _id: surveyId, state, village, isPublished: true })
    .select("surveyTitle surveyYear processedData updatedAt");
  if (!survey) throw new ApiError(404, "Survey not found.");
  return survey;
};

export const getSurveyYears = async (state, village) => {
  const years = await Survey.distinct("surveyYear", {
    state,
    village,
    isPublished: true,
    surveyYear: { $exists: true },
  });
  return years.sort((a, b) => b - a);
};

export const getSurveyByYear = async (state, village, surveyYear) => {
  const survey = await Survey.findOne({ state, village, surveyYear, isPublished: true })
    .sort({ updatedAt: -1 })
    .select("surveyTitle surveyYear processedData updatedAt");
  if (!survey) throw new ApiError(404, "No survey exists for this village and year.");
  return survey;
};

export const getSurveyHistory = async () => {
  const surveys = await Survey.find()
    .populate("village", "name slug")
    .populate("state", "name slug")
    .sort({ updatedAt: -1 })
    .select("surveyTitle surveyYear file isPublished village state createdAt updatedAt");

  return surveys.map((survey) => {
    const item = survey.toObject();
    item.surveyTitle = displayTitle(survey);
    return item;
  });
};

export const setSurveyPublication = async (id, isPublished) => {
  const survey = await Survey.findByIdAndUpdate(id, { isPublished }, { new: true });
  if (!survey) throw new ApiError(404, "Survey not found.");
  return survey;
};

export const deleteSurvey = async (id) => {
  const survey = await Survey.findByIdAndDelete(id);
  if (!survey) throw new ApiError(404, "Survey not found.");

  if (survey.uploadedFilePath) {
    try {
      await fs.unlink(path.resolve(survey.uploadedFilePath));
    } catch {
      // Ignore a missing legacy workbook; the database record is already removed.
    }
  }
};
