import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";

const seedCSIRLabsContent =
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

      const sections =
        await PageSection.find({
          pageId: page._id,
        });

      for (const section of sections) {
        switch (
          section.sectionType
        ) {
          case "CSIR_LABS_HERO":
            section.content = {
              heading:
                "CSIR Laboratories",

              subHeading:
                "Supporting SMART Village transformation through research, innovation, and collaborative scientific excellence.",

              backgroundImage:
                null,
            };
            break;

          case "CSIR_LABS_OVERVIEW":
            section.content = {
              heading:
                "About CSIR Laboratories",

              description:
                "The Council of Scientific and Industrial Research (CSIR) laboratories contribute significantly to national development through multidisciplinary research, technology innovation, and knowledge dissemination.",
            };
            break;

          case "CSIR_LABS_ROLE":
            section.content = {
              heading:
                "Role In SMART Village Mission",

              description:
                "CSIR laboratories support rural transformation through technology deployment, research-based solutions, capacity building, and sustainable development initiatives.",
            };
            break;

          case "CSIR_LABS_NETWORK":
            section.content = {
              heading:
                "Laboratory Network",

              description:
                "A collaborative network of research institutions working together to support village development, innovation adoption, and scientific outreach.",
            };
            break;

          case "CSIR_LABS_NODAL_PREVIEW":
            section.content = {
              heading:
                "Nodal Laboratory",

              description:
                "The nodal laboratory leads coordination, implementation, monitoring, and technical support for SMART Village initiatives.",

              buttonText:
                "View Nodal Laboratory",

              buttonLink:
                "/csir-laboratories/nodal-lab",
            };
            break;

          case "CSIR_LABS_PARTICIPATING_PREVIEW":
            section.content = {
              heading:
                "Participating Laboratories",

              description:
                "Participating laboratories contribute domain expertise, technology solutions, and research support across multiple thematic areas.",

              buttonText:
                "View Participating Laboratories",

              buttonLink:
                "/csir-laboratories/participating-labs",
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ CSIR Labs Content Seeded"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedCSIRLabsContent();
