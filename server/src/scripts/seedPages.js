import { connectDB } from "../config/database.js";
import Page from "../models/Page.model.js";

const pages = [
  {
    title: "Home",
    slug: "home",
    pageType: "HOME",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "About",
    slug: "about",
    pageType: "ABOUT",
    status: "ARCHIVED",
    isVisible: false,
  },

  {
    title: "CSIR Laboratories",
    slug: "csir-laboratories",
    pageType: "CSIR_LABS",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "Nodal Laboratory",
    slug: "nodal-lab",
    pageType: "NODAL_LAB",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "Participating Laboratories",
    slug: "participating-labs",
    pageType: "PARTICIPATING_LABS",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "CSIR Smart Village",
    slug: "csir-smart-village",
    pageType: "SMART_VILLAGE",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "News & Updates",
    slug: "news-updates",
    pageType: "NEWS_UPDATES",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "Success Stories",
    slug: "success-stories",
    pageType: "SUCCESS_STORIES",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
    title: "Contact",
    slug: "contact",
    pageType: "CONTACT",
    status: "PUBLISHED",
    isVisible: true,
  },

  {
  title: "Mission & Objectives",
  slug: "mission-objectives",
  pageType: "MISSION_OBJECTIVES",
  status: "PUBLISHED",
  isVisible: true,
},

{
  title: "DG Desk",
  slug: "dg-desk",
  pageType: "DG_DESK",
  status: "PUBLISHED",
 isVisible: true,
},

{
  title: "Director Desk",
  slug: "director-desk",
  pageType: "DIRECTOR_DESK",
  status: "PUBLISHED",
  isVisible: true,
}
];

const seedPages = async () => {
  try {
    await connectDB();

    for (const page of pages) {
      await Page.findOneAndUpdate(
        { slug: page.slug },
        page,
        {
          upsert: true,
          new: true,
        }
      );
    }

    console.log(
      "✅ CMS Pages Synced Successfully"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedPages();