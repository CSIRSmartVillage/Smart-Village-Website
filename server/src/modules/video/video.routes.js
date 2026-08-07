import { Router } from "express";

import * as controller
  from "./video.controller.js";

import validate
  from "../../middleware/validate.middleware.js";

import {
  createVideoSchema,
  updateVideoSchema,
} from "./video.validation.js";

import verifyJWT
  from "../../middleware/auth.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get(
  "/public",
  controller.getPublicVideos
);

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  verifyJWT,
  controller.getAllVideos
);

router.get(
  "/:id",
  verifyJWT,
  controller.getVideoById
);

router.post(
  "/",
  verifyJWT,
  validate(
    createVideoSchema
  ),
  controller.createVideo
);

router.put(
  "/:id",
  verifyJWT,
  validate(
    updateVideoSchema
  ),
  controller.updateVideo
);

router.delete(
  "/:id",
  verifyJWT,
  controller.deleteVideo
);

export default router;