import PageSection from "../../models/PageSection.model.js";
import Page from "../../models/Page.model.js";
import {
  ensureHomeAnnouncementSection,
} from "../../shared/homeAnnouncement.js";

export const getSectionsByPageId =
  async (pageId) => {
    const page = await Page.findById(
      pageId
    )
      .select("slug")
      .lean();

    await ensureHomeAnnouncementSection(
      page
    );

    return PageSection.find({
      pageId,
    }).sort({
      order: 1,
    });
  };

export const getSectionById =
  async (id) => {
    return PageSection.findById(id);
  };

export const updateSection =
  async (
    id,
    payload
  ) => {
    return PageSection.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    );
  };
