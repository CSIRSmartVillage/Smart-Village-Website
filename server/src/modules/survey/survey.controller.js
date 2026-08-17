import { logger } from "../../config/logger.js";
import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import ApiError from "../../utils/ApiError.js";
import * as surveyService from "./survey.service.js";

export const uploadSurvey = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, "Upload an .xlsx survey workbook.");

  const surveyTitle = String(req.body.surveyTitle || "").trim();
  if (!req.body.villageId || !surveyTitle || surveyTitle.length > 200) {
    throw new ApiError(400, "Choose a village and enter a survey title of up to 200 characters.");
  }

  const survey = await surveyService.createSurvey({
    villageId: req.body.villageId,
    surveyTitle,
    surveyId: req.body.surveyId,
    file: req.file,
    adminId: req.admin._id,
  });

  logger.info(`Survey uploaded: village=${req.body.villageId}, title=${surveyTitle}`);
  return res.status(201).json(new ApiResponse(201, survey, "Survey processed and saved successfully."));
});

// Legacy endpoints remain available so existing year-based public links keep working.
export const getSurveyYears = asyncHandler(async (req, res) => {
  const years = await surveyService.getSurveyYears(req.params.stateId, req.params.villageId);
  return res.json(new ApiResponse(200, years, "Survey years fetched successfully."));
});

export const getSurveyByYear = asyncHandler(async (req, res) => {
  const year = Number(req.params.year);
  const survey = await surveyService.getSurveyByYear(req.params.stateId, req.params.villageId, year);
  return res.json(new ApiResponse(200, survey, "Survey data fetched successfully."));
});

export const getSurveyOptions = asyncHandler(async (req, res) => {
  const surveys = await surveyService.getSurveyOptions(req.params.stateId, req.params.villageId);
  return res.json(new ApiResponse(200, surveys, "Surveys fetched successfully."));
});

export const getSurveyById = asyncHandler(async (req, res) => {
  const survey = await surveyService.getSurveyById(
    req.params.stateId,
    req.params.villageId,
    req.params.surveyId
  );
  return res.json(new ApiResponse(200, survey, "Survey data fetched successfully."));
});

export const getSurveyHistory = asyncHandler(async (req, res) => res.json(new ApiResponse(200, await surveyService.getSurveyHistory(), "Survey history fetched successfully.")));
export const updatePublication = asyncHandler(async (req, res) => res.json(new ApiResponse(200, await surveyService.setSurveyPublication(req.params.id, Boolean(req.body.isPublished)), "Survey publication updated.")));
export const removeSurvey = asyncHandler(async (req, res) => {
  await surveyService.deleteSurvey(req.params.id);
  return res.json(new ApiResponse(200, null, "Survey deleted."));
});
