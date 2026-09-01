import { connectDB } from "../config/database.js";
import Page from "../models/Page.model.js";
import PageSection from "../models/PageSection.model.js";

const seedContactContent = async () => {
  try {
    await connectDB();

    const page = await Page.findOne({
      slug: "contact",
    });

    const sections = await PageSection.find({
      pageId: page._id,
    });

    for (const section of sections) {
      switch (section.sectionType) {
        case "CONTACT_HERO":
          section.content = {
            heading: "Contact Us",
            description: "Get in touch with the CSIR SMART Village team.",
          };
          break;

        case "CONTACT_INFORMATION":
          section.content = {
            heading: "Contact Information",
            description:
              "Feel free to contact the CSIR SMART Village team for any queries, collaborations, or support regarding the SMART Village Mission.",
            address: "CSIR-CBRI, Roorkee, Uttarakhand",
            email: "smartvillage@cbri.res.in",
            phone: "+91 9663530674",
            workingHours: "Monday - Friday, 9:00 AM - 5:30 PM",
          };
          break;

        case "CONTACT_FORM":
          section.content = {
            heading: "Send Us a Message",
            description:
              "Have a question or suggestion? Fill out the form below and we'll get back to you as soon as possible.",
          };
          break;
      }

      await section.save();
    }

    console.log("✅ Contact Content Seeded");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedContactContent();
