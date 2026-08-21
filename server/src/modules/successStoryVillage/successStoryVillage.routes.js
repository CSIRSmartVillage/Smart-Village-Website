import { Router } from "express";

import * as controller
  from "./successStoryVillage.controller.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public
|--------------------------------------------------------------------------
*/

router.get(
  "/published",
  controller.getPublishedVillages
);

router.get(
  "/slug/:slug",
  controller.getVillageBySlug
);

export default router;