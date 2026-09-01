import { connectDB } from "../config/database.js";
import SiteSettings from "../models/SiteSettings.model.js";

const seedSiteSettings = async () => {
  try {
    await connectDB();

    const existingSettings = await SiteSettings.findOne();

    if (existingSettings) {
      console.log("ℹ️ Site Settings already exist.");
      process.exit(0);
    }

    await SiteSettings.create({
      siteName: "SMART Village Management Portal",

      organizationName:
        "CSIR - Central Building Research Institute (CSIR-CBRI)",

      logoUrl: null,

      faviconUrl: null,

      footerDescription:
        "Empowering rural communities through sustainable technologies, innovation, and scientific research under the CSIR SMART Village initiative.",

      contactEmail: "smartvillage@cbri.res.in",

      contactPhone: "+91 96635 30674",

      address:
        "CSIR–Central Building Research Institute, Roorkee, Uttarakhand, India",

      website: "https://cbri.res.in",

      socialLinks: {
        facebook: "https://www.facebook.com/CsirCbriRoorkee/",
        twitter: "",
        linkedin:
          "https://www.linkedin.com/school/central-building-research-institute-cbri-roorkee-uttarakhand-india-/",
        youtube: "https://www.youtube.com/c/CbriResIn-roorkee",
        instagram: "https://www.instagram.com/csir_cbri/?hl=en",
      },

      copyrightText: `© ${new Date().getFullYear()} CSIR-CBRI. All Rights Reserved.`,
    });

    console.log("✅ Site Settings seeded successfully.");

    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed Site Settings");
    console.error(error);
    process.exit(1);
  }
};

seedSiteSettings();
