import express from "express";

import * as eventController from "./event.controller.js";

import validate from "../../middleware/validate.middleware.js";
import auth from "../../middleware/auth.middleware.js";
import authorize from "../../middleware/rbac.middleware.js";

import {
  createEventSchema,
  updateEventSchema,
  homePageFeatureSchema,
  eventIdSchema,
  eventSlugSchema,
  eventQuerySchema,
} from "./event.validation.js";

const router = express.Router();

/* ==========================================================
   Public Routes
========================================================== */

router.get(
  "/featured",
  eventController.getFeaturedEvent
);

router.get(
  "/news-updates",
  eventController.getNewsUpdates
);

router.get(
  "/home-page-news",
  eventController.getHomePageNews
);

router.get(
  "/statistics",
  validate(eventQuerySchema.pick({
    query: true,
  })),
  eventController.getEventStatistics
);

router.get(
  "/",
  validate(eventQuerySchema),
  eventController.getEvents
);

router.get(
  "/slug/:slug",
  validate(eventSlugSchema),
  eventController.getEventBySlug
);

/* ==========================================================
   Admin Routes
========================================================== */

router.use(auth);

router.get(
  "/admin/news-items",
  authorize("SUPER_ADMIN", "ADMIN"),
  eventController.getAdminNewsItems
);

router.get(
  "/admin/list",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(eventQuerySchema),
  eventController.getAdminEvents
);

router.get(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(eventIdSchema),
  eventController.getEventById
);

router.post(
  "/",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(createEventSchema),
  eventController.createEvent
);

router.put(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(updateEventSchema),
  eventController.updateEvent
);

router.patch(
  "/:id/publish",
  authorize("SUPER_ADMIN", "ADMIN"),
  eventController.togglePublish
);

router.patch(
  "/:id/feature",
  authorize("SUPER_ADMIN", "ADMIN"),
  eventController.toggleFeatured
);

router.patch(
  "/:id/home-page-feature",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(homePageFeatureSchema),
  eventController.toggleHomePageFeature
);

router.delete(
  "/:id",
  authorize("SUPER_ADMIN", "ADMIN"),
  validate(eventIdSchema),
  eventController.deleteEvent
);

export default router;
