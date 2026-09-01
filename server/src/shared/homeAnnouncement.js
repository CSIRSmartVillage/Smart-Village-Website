import PageSection
  from "../models/PageSection.model.js";

export const DEFAULT_HOME_ANNOUNCEMENT =
  "CSIR SMART Village Mission welcomes Corporates, NGOs, Industries & PSUs to invest CSR funds for the implementation of technologies towards building self-reliant and resilient villages.";

export const ensureHomeAnnouncementSection =
  async (page) => {
    if (!page || page.slug !== "home") {
      return null;
    }

    return PageSection.findOneAndUpdate(
      {
        pageId: page._id,
        sectionType: "ANNOUNCEMENT_LINE",
      },
      {
        $setOnInsert: {
          title: "Announcement Line",
          content: {
            text: DEFAULT_HOME_ANNOUNCEMENT,
          },
          order: 1.5,
          isVisible: true,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
  };
