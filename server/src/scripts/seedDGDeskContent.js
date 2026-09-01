import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedDGDeskContent =
  async () => {
    try {
      await connectDB();

      const page =
        await Page.findOne({
          slug: "dg-desk",
        });

      const sections =
        await PageSection.find({
          pageId: page._id,
        });

      for (const section of sections) {

        switch (
          section.sectionType
        ) {

          case "PROFILE_HERO":
            section.content = {
              heading:
                "Director General's Desk",

              subHeading:
                "Message from the Director General, CSIR",
            };
            break;

          case "PROFILE_MESSAGE":
            section.content = {
              name:
                "Dr. Director General",

              designation:
                "Director General, CSIR",

              image:
  "https://images.unsplash.com/photo-1560250097-0b93528c311a",

              message:
                "Welcome to the SMART Village Mission. Through innovation and collaboration, we aim to transform rural communities and create sustainable development models for the nation.",
            };
            break;

          case "PROFILE_BIO":
            section.content = {
              heading:
                "Biography",

              description:
                "Detailed biography and achievements of the Director General will appear here.",
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ DG Desk Content Seeded"
      );

      process.exit(0);

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

seedDGDeskContent();
