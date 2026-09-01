import {connectDB}
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedHomeSections =
  async () => {
    try {
      await connectDB();

      const homePage =
        await Page.findOne({
          slug: "home",
        });

      if (!homePage) {
        throw new Error(
          "Home page not found"
        );
      }

      await PageSection.deleteMany({
        pageId: homePage._id,
      });

    const sections = [
  {
    pageId: homePage._id,
    sectionType: "HERO",
    title:
      "SMART Village Management Portal",
    order: 1,
  },

  {
    pageId: homePage._id,
    sectionType:
      "ANNOUNCEMENT_LINE",
    title:
      "Announcement Line",
    order: 2,
  },

  {
    pageId: homePage._id,
    sectionType:
      "ABOUT_PREVIEW",
    title:
      "About Preview",
    order: 3,
  },

  {
    pageId: homePage._id,
    sectionType:
      "IMPACT_STATISTICS",
    title:
      "Impact Statistics",
    order: 4,
  },

  {
    pageId: homePage._id,
    sectionType:
      "LATEST_UPDATES",
    title:
      "Latest Updates",
    order: 5,
  },

  {
    pageId: homePage._id,
    sectionType:
      "VILLAGES",
    title:
      "Villages",
    order: 6,
  },

  {
    pageId: homePage._id,
    sectionType:
      "FOOTER",
    title:
      "Footer",
    order: 7,
  },
];

      await PageSection.insertMany(
        sections
      );

      console.log(
        "✅ Home Sections Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedHomeSections();
