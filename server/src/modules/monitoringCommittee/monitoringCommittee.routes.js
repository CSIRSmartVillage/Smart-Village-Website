import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import { publicCache } from "../../middleware/cache.middleware.js";
import {
  adminLimiter,
  publicLimiter,
} from "../../middleware/rateLimit.middleware.js";
import * as controller from "./monitoringCommittee.controller.js";
import {
  createMonitoringCommitteeMemberSchema,
  monitoringCommitteeMemberIdSchema,
  reorderMonitoringCommitteeMembersSchema,
  updateMonitoringCommitteeSettingsSchema,
  updateMonitoringCommitteeMemberSchema,
} from "./monitoringCommittee.validation.js";

const router = Router();
const publicReadCache = publicCache();

router.get(
  "/",
  publicLimiter,
  publicReadCache,
  controller.getPublic
);

router.get(
  "/settings",
  publicLimiter,
  publicReadCache,
  controller.getSettings
);

router.use(
  "/admin",
  adminLimiter,
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN")
);

router.get("/admin", controller.getAll);

router.get("/admin/settings", controller.getSettings);

router.patch(
  "/admin/settings",
  validate(updateMonitoringCommitteeSettingsSchema),
  controller.updateSettings
);

router.post(
  "/admin",
  validate(createMonitoringCommitteeMemberSchema),
  controller.create
);

router.patch(
  "/admin/reorder",
  validate(reorderMonitoringCommitteeMembersSchema),
  controller.reorder
);

router.patch(
  "/admin/:id",
  validate(updateMonitoringCommitteeMemberSchema),
  controller.update
);

router.delete(
  "/admin/:id",
  validate(monitoringCommitteeMemberIdSchema),
  controller.remove
);

export default router;
