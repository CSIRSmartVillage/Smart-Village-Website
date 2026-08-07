import { Router } from "express";

import * as mediaController
  from "./mediaManagement.controller.js";

import upload
  from "../../middleware/upload.middleware.js";

import verifyJWT
  from "../../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get(
  "/",
  mediaController.getAllMedia
);

router.get(
  "/:id",
  mediaController.getMediaById
);

router.post(
  "/upload",
  upload.fields([
    {
      name: "file",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  mediaController.uploadMedia
);

router.post(
  "/",
  mediaController.createMedia
);

router.delete(
  "/:id",
  mediaController.deleteMedia
);

export default router;