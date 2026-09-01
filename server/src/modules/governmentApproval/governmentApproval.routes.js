import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";
import { governmentApprovalUpload } from "../../middleware/upload.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import * as controller from "./governmentApproval.controller.js";
import {
  createGovernmentApprovalSchema,
  governmentApprovalIdSchema,
  governmentApprovalQuerySchema,
  governmentApprovalVillageSchema,
  updateGovernmentApprovalSchema,
} from "./governmentApproval.validation.js";

const router = Router();
const adminOnly = [
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
];

router.get(
  "/village/:villageSlug",
  validate(governmentApprovalVillageSchema),
  controller.getByVillage
);

router.get(
  "/admin",
  ...adminOnly,
  validate(governmentApprovalQuerySchema),
  controller.getAll
);

router.post(
  "/admin",
  ...adminOnly,
  governmentApprovalUpload.single("file"),
  validate(createGovernmentApprovalSchema),
  controller.create
);

router.get(
  "/admin/:id",
  ...adminOnly,
  validate(governmentApprovalIdSchema),
  controller.getById
);

router.patch(
  "/admin/:id",
  ...adminOnly,
  governmentApprovalUpload.single("file"),
  validate(updateGovernmentApprovalSchema),
  controller.update
);

router.delete(
  "/admin/:id",
  ...adminOnly,
  validate(governmentApprovalIdSchema),
  controller.remove
);

export default router;
