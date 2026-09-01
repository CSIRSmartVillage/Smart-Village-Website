import { Router } from "express";

import verifyJWT from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";
import validate from "../../middleware/validate.middleware.js";

import * as villageController from "./village.controller.js";

import {
  createVillageSchema,
  updateVillageSchema,
} from "./village.validation.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all published villages
 * Used by:
 * - Navbar
 * - Public SMART Village pages
 */
router.get(
  "/public",
  villageController.getPublishedVillages
);


/**
 * Get published villages by state
 * Used by:
 * - Navbar State → Village dropdown
 */
router.get(
  "/public/state/:slug",
  villageController.getVillagesByState
);

/**
 * Get village by slug
 */
router.get(
  "/slug/:slug",
  villageController.getVillageBySlug
);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

/**
 * Get all villages (Admin)
 */
router.get(
  "/",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  villageController.getAllVillages
);

/**
 * Create village
 */
router.post(
  "/",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  validate(createVillageSchema),
  villageController.createVillage
);

router.get(
  "/:id",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  villageController.getVillage
);

/**
 * Update village
 */
router.patch(
  "/:id",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  validate(updateVillageSchema),
  villageController.updateVillage
);

/**
 * Archive village
 */
router.delete(
  "/:id",
  verifyJWT,
  authorize("SUPER_ADMIN"),
  villageController.deleteVillage
);

export default router;
