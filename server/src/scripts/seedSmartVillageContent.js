import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedSmartVillageContent =
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
          "SMART Village page not found"
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
          case "SMART_VILLAGE_HERO":
            section.content = {
              heading:
                "CSIR SMART Village",

              subHeading:
                "Transforming rural communities through science, technology, innovation, and sustainable development.",

              backgroundImage:
                null,
            };
            break;

          case "SMART_VILLAGE_OVERVIEW":
            section.content = {
              heading:
                "About SMART Village Mission",

              description:
                "The CSIR SMART Village initiative aims to empower rural communities through integrated development, technology adoption, infrastructure enhancement, and knowledge-based transformation.",
            };
            break;

          case "SMART_VILLAGE_OBJECTIVES":
            section.content = {
              heading:
                "Vision & Objectives",

              items: [
                "Promote sustainable rural development",
                "Improve quality of life",
                "Strengthen local infrastructure",
                "Encourage technology adoption",
                "Enable community participation",
              ],
            };
            break;

          case "SMART_VILLAGE_FOCUS_AREAS":
            section.content = {
              heading:
                "Key Focus Areas",

              items: [
                "Education",
                "Healthcare",
                "Livelihood",
                "Water & Sanitation",
                "Renewable Energy",
                "Digital Inclusion",
              ],
            };
            break;

          case "SMART_VILLAGE_FRAMEWORK":
            section.content = {
              heading:
                "SMART Village Framework",

              description:
                "The framework integrates scientific knowledge, community engagement, local governance, and technology-driven interventions to create sustainable and self-reliant villages.",
            };
            break;

          case "SMART_VILLAGE_IMPACT":
            section.content = {
              heading:
                "Impact & Outcomes",

              items: [
                "Improved village infrastructure",
                "Enhanced livelihoods",
                "Technology adoption",
                "Community empowerment",
                "Sustainable development",
              ],
            };
            break;

          case "SMART_VILLAGE_VILLAGES":
            section.content = {
              heading:
                "Villages Overview",

              description:
                "Explore villages participating in the SMART Village Mission and learn about their transformation journey.",
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ SMART Village Content Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedSmartVillageContent();
