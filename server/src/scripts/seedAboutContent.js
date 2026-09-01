import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedAboutContent =
  async () => {
    try {
      await connectDB();

      const aboutPage =
        await Page.findOne({
          slug: "mission-objectives",
        });

      if (!aboutPage) {
        throw new Error(
          "Mission & Objectives page not found"
        );
      }

      const sections =
        await PageSection.find({
          pageId: aboutPage._id,
        });

      for (const section of sections) {

        switch (
          section.sectionType
        ) {

          case "ABOUT_GALLERY":
            section.content = {
              heading:
                "About Us",

              description:
                "Learn about the CSIR SMART Village Mission and its journey towards sustainable rural development through science, technology and innovation.",

              images: [],
            };
            break;

          case "ABOUT_OVERVIEW":
            section.content = {
              heading:
                "About Us",

              description:
                "The CSIR SMART Village Mission is a transformative initiative aimed at improving the quality of life in rural communities through science, technology and innovation. The mission focuses on sustainable development, livelihood enhancement, digital empowerment and community participation to create resilient and self-reliant villages.",
            };
            break;

          case "ABOUT_HISTORY":
            section.content = {
              heading:
                "Journey of the Mission",

              timeline: [
                {
                  year: "2023",
                  title:
                    "Mission Conceptualization",

                  description:
                    "The SMART Village Mission framework was conceptualized to address rural challenges through science, technology and innovation.",
                },

                {
                  year: "2024",
                  title:
                    "Pilot Village Implementation",

                  description:
                    "Pilot projects were initiated in selected villages to validate sustainable development interventions.",
                },

                {
                  year: "2025",
                  title:
                    "Expansion Across States",

                  description:
                    "The mission expanded its reach across multiple states through collaborative efforts of CSIR laboratories and stakeholders.",
                },
              ],
            };
            break;

          case "ABOUT_QUICK_LINKS":
            section.content = {
              heading:
                "Explore More",

              links: [
                {
                  title:
                    "Mission Objectives",

                  description:
                    "Explore mission goals, focus areas and expected outcomes.",

                  path:
                    "/about/mission-objectives",
                },

                {
                  title:
                    "DG Desk",

                  description:
                    "Read the message from the Director General, CSIR.",

                  path:
                    "/about/dg-desk",
                },

                {
                  title:
                    "Director Desk",

                  description:
                    "Read the message from the Director, CSIR-CBRI.",

                  path:
                    "/about/director-desk",
                },
              ],
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ About Content Seeded"
      );

      process.exit(0);

    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedAboutContent();
