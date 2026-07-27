import mongoose from "mongoose";

const pageSectionSchema =
  new mongoose.Schema(
    {
      pageId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Page",
        required: true,
      },

      sectionType: {
  type: String,
  enum: [
    "HERO",

    "MISSION",

    "MISSION_OBJECTIVES",

    "IMPACT_STATISTICS",

    "CSIR_CBRI",

    "LATEST_UPDATES",

    "POLICIES",

    "VILLAGES",

    "FOOTER",

    "RICH_TEXT",

    "CARDS",

    "GALLERY",

    "TIMELINE",

    "FAQ",

    "CONTACT",

    "NEWS_FEED",

    "VILLAGE_GRID",

    "CUSTOM",
    
    "ABOUT_HERO",
    "ABOUT_GALLERY",
    "ABOUT_OVERVIEW",
    "ABOUT_VISION",
    "ABOUT_MISSION",
    "ABOUT_OBJECTIVES",
    "ABOUT_HISTORY",
    "ABOUT_CBRI",
    "ABOUT_PREVIEW",

    "ABOUT_QUICK_LINKS",

    "OBJECTIVES_HERO",
"OBJECTIVES_CONTENT",
"OBJECTIVES_FOCUS_AREAS",
"OBJECTIVES_OUTCOMES",


"PROFILE_HERO",
"PROFILE_MESSAGE",
"PROFILE_BIO",

    
    "CSIR_LABS_HERO",
"CSIR_LABS_OVERVIEW",
"CSIR_LABS_ROLE",
"CSIR_LABS_NETWORK",
"CSIR_LABS_NODAL_PREVIEW",
"CSIR_LABS_PARTICIPATING_PREVIEW",

"NODAL_LAB_HERO",
"NODAL_LAB_OVERVIEW",
"NODAL_LAB_RESPONSIBILITIES",
"NODAL_LAB_RESEARCH_AREAS",
"NODAL_LAB_PROJECTS",
"NODAL_LAB_ACHIEVEMENTS",
"NODAL_LAB_CONTACT",

"PARTICIPATING_LABS_HERO",
"PARTICIPATING_LABS_OVERVIEW",
"PARTICIPATING_LABS_LIST",
"PARTICIPATING_LABS_RESEARCH",
"PARTICIPATING_LABS_CONTRIBUTIONS",
"PARTICIPATING_LABS_CONTACT",

"SMART_VILLAGE_HERO",
"SMART_VILLAGE_OVERVIEW",
"SMART_VILLAGE_OBJECTIVES",
"SMART_VILLAGE_FOCUS_AREAS",
"SMART_VILLAGE_FRAMEWORK",
"SMART_VILLAGE_IMPACT",
"SMART_VILLAGE_VILLAGES",

"CONTACT_HERO",
"CONTACT_INFORMATION",
"CONTACT_FORM",
"CONTACT_LOCATION",
"CONTACT_FAQ",

"NEWS_HERO",
"NEWS_INTRO",

"SUCCESS_STORIES_HERO",
"SUCCESS_STORIES_INTRO",
  ],
  required: true,
      },

      title: {
        type: String,
        trim: true,
      },

      subtitle: {
        type: String,
        trim: true,
      },

      content: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      order: {
        type: Number,
        required: true,
      },

      isVisible: {
        type: Boolean,
        default: true,
      },

      metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Admin",
      },

      updatedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Admin",
      },
    },
    {
      timestamps: true,
    }
  );

pageSectionSchema.index({
  pageId: 1,
  isVisible: 1,
  order: 1,
});

const PageSection =
  mongoose.model(
    "PageSection",
    pageSectionSchema
  );

export default PageSection;
