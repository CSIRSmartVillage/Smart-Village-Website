import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";
import {
  publicCache,
} from "../../middleware/cache.middleware.js";
import {
  adminLimiter,
  publicLimiter,
} from "../../middleware/rateLimit.middleware.js";

import * as supporterController from "./supporter.controller.js";

import {
  createSupporterSchema,
  createSupporterLogoSchema,
  supporterIdSchema,
  supporterLogoIdSchema,
  supporterQuerySchema,
  updateSupporterSchema,
} from "./supporter.validation.js";

const router = Router();
const publicReadCache = publicCache();

router.get(
  "/logos",
  publicLimiter,
  publicReadCache,
  supporterController.getPublicLogos
);

router.get(
  "/",
  publicLimiter,
  publicReadCache,
  validate(supporterQuerySchema),
  supporterController.getPublicList
);

router.use(
  "/admin",
  adminLimiter,
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN")
);

router.get(
  "/admin/logos",
  supporterController.getAllLogos
);

router.post(
  "/admin/logos",
  validate(createSupporterLogoSchema),
  supporterController.createLogo
);

router.delete(
  "/admin/logos/:id",
  validate(supporterLogoIdSchema),
  supporterController.removeLogo
);

router.get(
  "/admin",
  validate(supporterQuerySchema),
  supporterController.getAll
);

router.post(
  "/admin",
  validate(createSupporterSchema),
  supporterController.create
);

router.get(
  "/admin/:id",
  validate(supporterIdSchema),
  supporterController.getById
);

router.patch(
  "/admin/:id",
  validate(updateSupporterSchema),
  supporterController.update
);

router.delete(
  "/admin/:id",
  validate(supporterIdSchema),
  supporterController.remove
);

export default router;
