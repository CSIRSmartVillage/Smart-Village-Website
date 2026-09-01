import { connectDB }
  from "../config/database.js";

import News
  from "../models/News.model.js";

const seedNews =
  async () => {
    try {
      await connectDB();

      await News.deleteMany({});

      await News.insertMany([
        {
          title:
            "CSIR SMART Village Initiative Launched",

          slug:
            "csir-smart-village-initiative-launched",

          summary:
            "CSIR launches a new initiative to accelerate SMART Village development.",

          content:
            "The CSIR SMART Village Initiative aims to transform rural communities through technology, innovation, and sustainable development.",

          category:
            "ANNOUNCEMENT",

          status:
            "PUBLISHED",

          isFeatured:
            true,

          publishedAt:
            new Date(),
        },

        {
          title:
            "Village Development Workshop Conducted",

          slug:
            "village-development-workshop-conducted",

          summary:
            "A workshop was conducted to engage local communities and stakeholders.",

          content:
            "Experts and community leaders participated in discussions focused on village transformation and technology adoption.",

          category:
            "EVENT",

          status:
            "PUBLISHED",

          isFeatured:
            false,

          publishedAt:
            new Date(),
        },

        {
          title:
            "New Water Management Technology Introduced",

          slug:
            "new-water-management-technology-introduced",

          summary:
            "Advanced water management solutions are being tested in participating villages.",

          content:
            "The technology aims to improve water conservation and ensure sustainable resource utilization.",

          category:
            "GENERAL",

          status:
            "PUBLISHED",

          isFeatured:
            false,

          publishedAt:
            new Date(),
        },
      ]);

      console.log(
        "✅ News Seeded Successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedNews();
