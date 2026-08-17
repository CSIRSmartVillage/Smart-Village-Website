import { Router } from "express";
import multer from "multer";
import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import * as controller from "./survey.controller.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (req, file, done) => done(null, file.originalname.toLowerCase().endsWith(".xlsx")),
});

router.post("/admin/survey", verifyJWT, authorize("SUPER_ADMIN"), upload.single("file"), controller.uploadSurvey);
router.get("/admin/surveys", verifyJWT, authorize("SUPER_ADMIN"), controller.getSurveyHistory);
router.patch("/admin/surveys/:id/publication", verifyJWT, authorize("SUPER_ADMIN"), controller.updatePublication);
router.delete("/admin/surveys/:id", verifyJWT, authorize("SUPER_ADMIN"), controller.removeSurvey);
router.get("/states/:stateId/villages/:villageId/survey-options", controller.getSurveyOptions);
router.get("/states/:stateId/villages/:villageId/surveys/by-id/:surveyId", controller.getSurveyById);
router.get("/states/:stateId/villages/:villageId/surveys", controller.getSurveyYears);
router.get("/states/:stateId/villages/:villageId/surveys/:year", controller.getSurveyByYear);

export default router;