  import { Router } from "express";

  import healthRoutes from "./health.routes.js";
  import authRoutes from "../modules/auth/auth.routes.js";
  import villageRoutes from "../modules/village/village.routes.js";
  import stateRoutes from "../modules/state/state.routes.js";
  import cmsRoutes from "../modules/cms/cms.routes.js";
  import newsRoutes
  from "../modules/news/news.routes.js";

  import successStoryRoutes
  from "../modules/successStory/successStory.routes.js";

  import pageManagementRoutes
  from "../modules/pageManagement/pageManagement.routes.js";

  import sectionManagementRoutes
  from "../modules/sectionManagement/sectionManagement.routes.js";

  import navigationManagementRoutes
  from "../modules/navigationManagement/navigationManagement.routes.js";

  import mediaManagementRoutes
  from "../modules/mediaManagement/mediaManagement.routes.js";

  import videoRoutes
  from "../modules/video/video.routes.js";

  import announcementRoutes
  from "../modules/announcement/announcement.routes.js";

  import laboratoryRoutes
  from "../modules/laboratory/laboratory.routes.js";

  import contactRoutes
  from "../modules/contact/contact.routes.js";

  import siteSettingsRoutes
  from "../modules/siteSettings/siteSettings.routes.js";

  import successStoryVillageRoutes
  from "../modules/successStoryVillage/successStoryVillage.routes.js";

  import villageProfileRoutes from "../modules/villageProfile/villageProfile.routes.js";

  import developmentPlanRoutes from "../modules/developmentPlan/developmentPlan.routes.js";
  import surveyRoutes from "../modules/survey/survey.routes.js";

  import eventRoutes from "../modules/events/event.routes.js";

  import homeRoutes from "../modules/home/home.routes.js";

  import villageLocationRoutes
  from "../modules/villageLocation/villageLocation.routes.js";

  import policiesSchemeRoutes from "../modules/policiesSchemes/policiesScheme.routes.js";
  import selfHelpGroupRoutes from "../modules/selfHelpGroup/selfHelpGroup.routes.js";
  import {
  publicCache,
} from "../middleware/cache.middleware.js";
  import {
  publicLimiter,
  adminLimiter,
} from "../middleware/rateLimit.middleware.js";

const router = Router();
const publicReadCache = publicCache();

router.use("/health", healthRoutes);

router.use("/auth", authRoutes);

router.use(
  "/public",
  publicLimiter,
  publicReadCache,
  cmsRoutes
);

router.use(
  "/states",
  publicLimiter,
  publicReadCache,
  stateRoutes
);

router.use(
  "/villages",
  publicLimiter,
  publicReadCache,
  villageRoutes
);

router.use(
  "/news",
  publicLimiter,
  publicReadCache,
  newsRoutes
);


router.use(
  "/village-profiles",
  publicLimiter,
  publicReadCache,
  villageProfileRoutes
);

router.use(
  "/announcements",
  publicLimiter,
  publicReadCache,
  announcementRoutes
);


router.use(
  "/success-stories",
  publicLimiter,
  publicReadCache,
  successStoryRoutes
);


router.use(
  "/success-story-villages",
  publicLimiter,
  publicReadCache,
  successStoryVillageRoutes
);

router.use(
  "/videos",
  publicLimiter,
  publicReadCache,
  videoRoutes
);

router.use(
  "/laboratories",
  publicLimiter,
  publicReadCache,
  laboratoryRoutes
);

router.use(
  "/contact",
  publicLimiter,
  publicReadCache,
  contactRoutes
);

router.use(
  "/site-settings",
  publicLimiter,
  publicReadCache,
  siteSettingsRoutes
);

router.use(
  "/development-plans",
  publicLimiter,
  publicReadCache,
  developmentPlanRoutes
);

router.use("/", surveyRoutes);

router.use(
  "/village-locations",
  publicLimiter,
  publicReadCache,
  villageLocationRoutes
);

router.use(
  "/events",
  publicLimiter,
  publicReadCache,
  eventRoutes
);

router.use(
  "/home",
  publicLimiter,
  publicReadCache,
  homeRoutes
);

router.use(
  "/policies-schemes",
  publicLimiter,
  publicReadCache,
  policiesSchemeRoutes
);

router.use(
  "/self-help-groups",
  publicLimiter,
  publicReadCache,
  selfHelpGroupRoutes
);

router.use(
  "/admin/pages",
  adminLimiter,
  pageManagementRoutes
);

router.use(
  "/admin/sections",
  adminLimiter,
  sectionManagementRoutes
);

router.use(
  "/admin/navigation",
  adminLimiter,
  navigationManagementRoutes
);

router.use(
  "/admin/media",
  adminLimiter,
  mediaManagementRoutes
);

export default router;
