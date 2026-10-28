import { Router } from "express";
import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { trainingManualUpload } from "../../middleware/upload.middleware.js";
import * as controller from "./trainingManual.controller.js";
import { createTrainingManualSchema, trainingManualFileSchema, trainingManualIdSchema, updateTrainingManualSchema } from "./trainingManual.validation.js";

const router = Router();
const admin = [verifyJWT, authorize("SUPER_ADMIN", "ADMIN")];
router.get("/admin/all", ...admin, controller.getAll);
router.post("/admin", ...admin, trainingManualUpload.array("files", 10), validate(createTrainingManualSchema), controller.create);
router.get("/admin/:id", ...admin, validate(trainingManualIdSchema), controller.getById);
router.patch("/admin/:id", ...admin, trainingManualUpload.array("files", 10), validate(updateTrainingManualSchema), controller.update);
router.delete("/admin/:id/files/:fileId", ...admin, validate(trainingManualFileSchema), controller.removeFile);
router.delete("/admin/:id", ...admin, validate(trainingManualIdSchema), controller.remove);
router.get("/", controller.getPublic);
router.get("/:id", validate(trainingManualIdSchema), controller.getPublicById);
export default router;
