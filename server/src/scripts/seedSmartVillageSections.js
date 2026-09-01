import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedSmartVillageSections =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug:
            "csir-smart-village",
        });

      if (!page) {
        throw new Error(
          "CSIR SMART Village page not found"
        );
      }

      await PageSection.deleteMany({
        pageId: page._id,
      });

      const sections = [
        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_HERO",
          title:
            "CSIR SMART Village",
          order: 1,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_OVERVIEW",
          title:
            "About SMART Village Mission",
          order: 2,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_OBJECTIVES",
          title:
            "Vision & Objectives",
          order: 3,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_FOCUS_AREAS",
          title:
            "Key Focus Areas",
          order: 4,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_FRAMEWORK",
          title:
            "SMART Village Framework",
          order: 5,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_IMPACT",
          title:
            "Impact & Outcomes",
          order: 6,
        },

        {
          pageId: page._id,
          sectionType:
            "SMART_VILLAGE_VILLAGES",
          title:
            "Villages Overview",
          order: 7,
        },
      ];

      await PageSection.insertMany(
        sections
      );

      console.log(
        "✅ SMART Village Sections Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedSmartVillageSections();
