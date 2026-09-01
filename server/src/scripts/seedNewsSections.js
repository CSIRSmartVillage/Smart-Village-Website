    import { connectDB } from "../config/database.js";
import Page from "../models/Page.model.js";
import PageSection from "../models/PageSection.model.js";

const seedNewsSections = async () => {
  try {
    await connectDB();

    const page = await Page.findOne({
      slug: "news-updates",
    });

    if (!page) {
      throw new Error(
        "News page not found"
      );
    }

    const sections = [
      {
        pageId: page._id,
        sectionType: "NEWS_HERO",
        title: "News & Updates",
        subtitle:
          "Latest developments from CSIR SMART Village",
        order: 1,
        isVisible: true,
      },

      {
        pageId: page._id,
        sectionType: "NEWS_INTRO",
        title: "Stay Updated",
        content: {
          description:
            "Discover recent initiatives, events, announcements and achievements from CSIR SMART Village.",
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
      "✅ News sections seeded"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedNewsSections();
