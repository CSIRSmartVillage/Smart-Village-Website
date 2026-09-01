import { connectDB } from "../config/database.js";
import Page from "../models/Page.model.js";
import PageSection from "../models/PageSection.model.js";

const seedSuccessStorySections =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug:
            "success-stories",
        });

      if (!page) {
        throw new Error(
          "Success Stories page not found"
        );
      }

      const sections = [
        {
          pageId: page._id,
          sectionType:
            "SUCCESS_STORIES_HERO",
          title:
            "Success Stories",
          subtitle:
            "Real impact from SMART Village initiatives",
          order: 1,
          isVisible: true,
        },

        {
          pageId: page._id,
          sectionType:
            "SUCCESS_STORIES_INTRO",
          title:
            "Transforming Communities",
          content: {
            description:
              "Explore inspiring stories and measurable outcomes from villages participating in the SMART Village initiative.",
          },
          order: 2,
          isVisible: true,
        },
      ];

      for (const section of sections) {
        await PageSection.findOneAndUpdate(
          {
            pageId: page._id,
            sectionType:
              section.sectionType,
          },
          section,
          {
            upsert: true,
            new: true,
          }
        );
      }

      console.log(
        "✅ Success Story sections seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

seedSuccessStorySections();
