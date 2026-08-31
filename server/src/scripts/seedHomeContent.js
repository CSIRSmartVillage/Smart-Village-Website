import { connectDB }
  from "../config/database.js";

import Page
  from "../models/Page.model.js";

import PageSection
  from "../models/PageSection.model.js";
import {
  DEFAULT_HOME_ANNOUNCEMENT,
} from "../shared/homeAnnouncement.js";

const seedHomeContent =
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

      const sections =
        await PageSection.find({
          pageId: homePage._id,
        });

      for (const section of sections) {
        switch (
          section.sectionType
        ) {
          case "HERO":
            section.content = {
              heading:
                "Smart Village Management Portal",

              subHeading:
                "Empowering Rural Communities Through Technology and Sustainable Development",

              buttonText:
                "Explore Villages",

              buttonLink:
                "/villages",

              secondaryButtonText:
                "Learn More",

              secondaryButtonLink:
                "/about",

              backgroundImage:
                null,
            };
            break;

          case "ANNOUNCEMENT_LINE":
            section.content = {
              text:
                DEFAULT_HOME_ANNOUNCEMENT,
            };
            break;

            case "ABOUT_PREVIEW":
  section.content = {
    heading:
      "About Smart Village Mission",

    description:
      "Transforming rural communities through innovation, sustainability, and technology-driven development. Learn more about our mission, objectives, vision, and the role of CSIR-CBRI in empowering villages.",

    buttonText:
      "Learn More",

    buttonLink:
      "/about",
  };
  break;

  
          case "MISSION":
  section.content = {
    heading:
      "About Smart Village Mission",

    description:
      "The Smart Village Mission aims to transform rural communities through sustainable development, technology adoption, infrastructure improvement, and knowledge-based growth.",

    image: null,

    features: [
      {
        title:
          "Sustainable Development",

        description:
          "Promoting environmentally responsible and long-term rural growth.",
      },

      {
        title:
          "Technology Integration",

        description:
          "Leveraging digital tools and innovation for village advancement.",
      },

      {
        title:
          "Community Empowerment",

        description:
          "Enabling villagers through education, skills, and participation.",
      },
    ],
  };
  break;

          case "MISSION_OBJECTIVES":
            section.content = {
  heading:
    "Mission Objectives",

  description:
    "The Smart Village initiative focuses on sustainable, technology-driven development to improve quality of life, strengthen rural infrastructure, and empower communities.",

  objectives: [
    {
      title:
        "Infrastructure Development",
      description:
        "Enhancing rural infrastructure including roads, housing, sanitation, and public facilities.",
    },

    {
      title:
        "Healthcare Accessibility",
      description:
        "Improving healthcare services and access to medical facilities for rural communities.",
    },

    {
      title:
        "Quality Education",
      description:
        "Promoting digital learning, literacy, and educational opportunities.",
    },

    {
      title:
        "Agricultural Innovation",
      description:
        "Encouraging modern farming practices and sustainable agricultural technologies.",
    },

    {
      title:
        "Digital Inclusion",
      description:
        "Connecting villages through digital infrastructure and e-governance services.",
    },

    {
      title:
        "Environmental Sustainability",
      description:
        "Supporting eco-friendly development and responsible resource management.",
    },
  ],
};
            break;

          case "IMPACT_STATISTICS":
          section.content = {
  heading:
    "Smart Village Impact",

  description:
    "Key indicators reflecting rural transformation initiatives.",

  stats: [
    {
      label:
        "Villages Covered",
      value: 4,
      suffix: "+",
    },

    {
      label:
        "Beneficiaries",
      value: 15000,
      suffix: "+",
    },

    {
      label:
        "Projects",
      value: 25,
      suffix: "+",
    },

    {
      label:
        "Technologies Deployed",
      value: 12,
      suffix: "+",
    },
  ],
};
            break;

          case "CSIR_CBRI":
  section.content = {
    heading:
      "Vision & Objectives",

    description:
      "CSIR-CBRI is committed to advancing rural transformation through research, innovation, sustainable development, and technology-driven solutions.",

    image: null,

    buttonText:
      "Learn More",

    buttonLink:
      "/about",

    features: [
      {
        title:
          "Research & Innovation",

        description:
          "Advancing science and technology solutions for sustainable rural development.",
      },

      {
        title:
          "Rural Infrastructure",

        description:
          "Supporting smart infrastructure planning and resilient village ecosystems.",
      },

      {
        title:
          "Technology Transfer",

        description:
          "Bridging research outcomes with real-world village implementation.",
      },

      {
        title:
          "Capacity Building",

        description:
          "Empowering communities through knowledge, training, and skill development.",
      },
    ],
  };
  break;

          case "LATEST_UPDATES":
            section.content = {
  heading:
    "News & Announcements",

  description:
    "Stay informed about recent developments, initiatives, programs, and activities under the Smart Village Mission.",

  displayCount: 3,

  updates: [
    {
      title:
        "Village Infrastructure Development Initiative",

      date:
        "June 2026",

      description:
        "New infrastructure projects launched to improve connectivity and public facilities.",
    },

    {
      title:
        "Smart Agriculture Awareness Program",

      date:
        "May 2026",

      description:
        "Training sessions conducted for farmers on modern agricultural practices.",
    },

    {
      title:
        "Digital Literacy Campaign",

      date:
        "April 2026",

      description:
        "Community members participated in digital literacy and e-governance workshops.",
    },
  ],
};
            break;

          case "POLICIES":
            section.content = {
  heading:
    "Policies & Schemes",

  description:
    "Explore central and state initiatives supporting sustainable rural development and smart village transformation.",

  displayCount: 4,

  policies: [
    {
      title:
        "PM Awas Yojana",

      category:
        "Housing",

      description:
        "Affordable housing initiative supporting rural infrastructure development.",
    },

    {
      title:
        "Jal Jeevan Mission",

      category:
        "Water",

      description:
        "Ensuring safe and adequate drinking water supply to rural households.",
    },

    {
      title:
        "Digital India",

      category:
        "Technology",

      description:
        "Promoting digital empowerment and online service accessibility.",
    },

    {
      title:
        "MGNREGA",

      category:
        "Employment",

      description:
        "Generating livelihood opportunities and strengthening rural economy.",
    },
  ],
};
            break;

          case "VILLAGES":
            section.content = {
  heading:
    "Featured Villages",

  description:
    "Explore village-specific information, development plans, achievements, maps, indicators, and community activities.",

  displayCount: 4,

  villages: [
    {
      name:
        "Mahuakhera Ganj",

      district:
        "Udham Singh Nagar",

      state:
        "Uttarakhand",

      slug:
        "mahuakhera-ganj",
    },

    {
      name:
        "Karanpur",

      district:
        "Haridwar",

      state:
        "Uttarakhand",

      slug:
        "karanpur",
    },

    {
      name:
        "Bhagwanpur",

      district:
        "Haridwar",

      state:
        "Uttarakhand",

      slug:
        "bhagwanpur",
    },
  ],
};
            break;

          case "FOOTER":
            section.content = {
              useSiteSettings:
                true,
            };
            break;

          default:
            break;
        }

        await section.save();
      }

      console.log(
        "✅ Home Content Seeded Successfully"
      );

      process.exit(0);
    } catch (error) {
      console.error(error);

      process.exit(1);
    }
  };

seedHomeContent();
