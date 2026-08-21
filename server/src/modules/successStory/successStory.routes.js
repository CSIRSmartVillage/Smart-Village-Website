import { Router } from "express";

import * as successStoryController
  from "./successStory.controller.js";

import validate
  from "../../middleware/validate.middleware.js";

import {
  createSuccessStorySchema,
  updateSuccessStorySchema,
} from "./successStory.validation.js";

import verifyJWT
  from "../../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get(
  "/published",
  successStoryController.getPublishedStories
);

router.get(
  "/villages/published",
  successStoryController.getPublishedStoryVillages
);

router.get(
  "/village/:villageSlug",
  successStoryController.getStoriesByVillageSlug
);

router.get(
  "/slug/:slug",
  successStoryController.getStoryBySlug
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------

*/

router.get(
  "/",
  verifyJWT,
  successStoryController.getAllStories
);

router.get(
  "/id/:id",
  verifyJWT,
  successStoryController.getStoryById
);

router.post(
  "/",
  verifyJWT,
  validate(
    createSuccessStorySchema
  ),
  successStoryController.createStory
);

router.put(
  "/:id",
  verifyJWT,
  validate(
    updateSuccessStorySchema
  ),
  successStoryController.updateStory
);

router.delete(
  "/:id",
  verifyJWT,
  successStoryController.deleteStory
);

export default router;