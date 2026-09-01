import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedCSIRLabsSections =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug:
            "csir-laboratories",
        });

      if (!page) {
        throw new Error(
          "CSIR Laboratories page not found"
        );
      }

      await PageSection.deleteMany({
        pageId: page._id,
      });

      const sections = [
        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_HERO",
          title:
            "CSIR Laboratories",
          order: 1,
        },

        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_OVERVIEW",
          title:
            "About CSIR Laboratories",
          order: 2,
        },

        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_ROLE",
          title:
            "Role In SMART Village Mission",
          order: 3,
        },

        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_NETWORK",
          title:
            "Laboratory Network",
          order: 4,
        },

        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_NODAL_PREVIEW",
          title:
            "Nodal Laboratory",
          order: 5,
        },

        {
          pageId: page._id,
          sectionType:
            "CSIR_LABS_PARTICIPATING_PREVIEW",
          title:
            "Participating Laboratories",
          order: 6,
        },
      ];

      await PageSection.insertMany(
        sections
      );

      console.log(
        "✅ CSIR Labs Sections Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedCSIRLabsSections();
