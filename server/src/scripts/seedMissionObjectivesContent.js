import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedMissionObjectivesContent =
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
          "Mission Objectives page not found"
        );
      }

      const sections =
        await PageSection.find({
          pageId: page._id,
        });

      for (const section of sections) {

        switch (
          section.sectionType
        ) {

          case "OBJECTIVES_HERO":
            section.content = {
              heading:
                "Mission Objectives",

              subHeading:
                "Building self-reliant, sustainable and technology-enabled villages through science, innovation and community participation.",

              backgroundImage:
                null,
            };
            break;

          case "OBJECTIVES_CONTENT":
            section.content = {
              heading:
                "Our Objectives",

              description:
                "The SMART Village Mission seeks to improve quality of life in rural communities through scientific interventions, sustainable infrastructure, digital empowerment, livelihood enhancement and community-driven development.",
            };
            break;

          case "OBJECTIVES_FOCUS_AREAS":
            section.content = {
              heading:
                "Focus Areas",

              items: [
                {
                  title:
                    "Digital Inclusion",

                  description:
                    "Expanding access to digital services and connectivity.",
                },

                {
                  title:
                    "Sustainable Housing",

                  description:
                    "Promoting resilient and affordable housing technologies.",
                },

                {
                  title:
                    "Water & Sanitation",

                  description:
                    "Improving water conservation and sanitation systems.",
                },

                {
                  title:
                    "Healthcare",

                  description:
                    "Enhancing healthcare access through technology.",
                },

                {
                  title:
                    "Education",

                  description:
                    "Supporting skill development and digital literacy.",
                },

                {
                  title:
                    "Livelihoods",

                  description:
                    "Creating sustainable economic opportunities.",
                },
              ],
            };
            break;

          case "OBJECTIVES_OUTCOMES":
            section.content = {
              heading:
                "Expected Outcomes",

              items: [
                "Improved quality of life",
                "Technology adoption in villages",
                "Enhanced rural livelihoods",
                "Sustainable development practices",
                "Better healthcare and education access",
                "Community empowerment and participation",
              ],
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ Mission Objectives Content Seeded"
      );

      process.exit(0);

    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  };

seedMissionObjectivesContent();
