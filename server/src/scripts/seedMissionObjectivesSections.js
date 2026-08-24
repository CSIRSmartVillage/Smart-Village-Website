import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedMissionObjectives =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug:
            "mission-objectives",
        });

      if (!page) {
        throw new Error(
          "Page not found"
        );
      }

      await PageSection.deleteMany({
        pageId: page._id,
      });

      await PageSection.insertMany([
        {
          pageId: page._id,
          sectionType: "ABOUT_OVERVIEW",
          title: "About Mission",
          order: 1,
        },
        {
          pageId: page._id,
          sectionType: "ABOUT_GALLERY",
          title: "Three Informational Images",
          order: 2,
        },
        {
          pageId: page._id,
          sectionType: "OBJECTIVES_CONTENT",
          title: "Mission Statement",
          order: 3,
        },
        {
          pageId: page._id,
          sectionType: "OBJECTIVES_FOCUS_AREAS",
          title: "Focus Areas",
          order: 4,
        },
        {
          pageId: page._id,
          sectionType: "OBJECTIVES_OUTCOMES",
          title: "Expected Outcomes",
          order: 5,
        },
        {
          pageId: page._id,
          sectionType: "ABOUT_HISTORY",
          title: "History",
          order: 6,
        },
        {
          pageId: page._id,
          sectionType: "ABOUT_QUICK_LINKS",
          title: "Quick Links",
          order: 7,
        },
      ]);

      console.log(
        "✅ Mission Objectives Sections Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedMissionObjectives();