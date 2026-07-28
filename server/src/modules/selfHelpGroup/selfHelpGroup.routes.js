import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import * as selfHelpGroupController from "./selfHelpGroup.controller.js";

import {
  createSelfHelpGroupSchema,
  updateSelfHelpGroupSchema,
  selfHelpGroupIdSchema,
  selfHelpGroupSlugSchema,
  villageSlugSchema,
  selfHelpGroupQuerySchema,
} from "./selfHelpGroup.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/village/:villageSlug",
  validate(
    villageSlugSchema.merge(
      selfHelpGroupQuerySchema.pick({
        query: true,
      })
    )
  ),
  selfHelpGroupController.getByVillage
);

router.get(
  "/",
  validate(selfHelpGroupQuerySchema),
  selfHelpGroupController.getPublicList
);

router.get(
  "/slug/:slug",
  validate(selfHelpGroupSlugSchema),
  selfHelpGroupController.getBySlug
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.get(
  "/admin",
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(selfHelpGroupQuerySchema),
  selfHelpGroupController.getAll
);

router.post(
  "/admin",
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(createSelfHelpGroupSchema),
  selfHelpGroupController.create
);

router.get(
  "/admin/:id",
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(selfHelpGroupIdSchema),
  selfHelpGroupController.getById
);

router.patch(
  "/admin/:id",
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(updateSelfHelpGroupSchema),
  selfHelpGroupController.update
);

router.patch(
  "/admin/:id/publish",
  verifyJWT,
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(selfHelpGroupIdSchema),
  selfHelpGroupController.togglePublish
);

router.delete(
  "/admin/:id",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  validate(selfHelpGroupIdSchema),
  selfHelpGroupController.remove
);

export default router;
