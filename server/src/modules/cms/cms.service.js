import Page from "../../models/Page.model.js";
import PageSection from "../../models/PageSection.model.js";
import ApiError from "../../utils/ApiError.js";

import Navigation from "../../models/Navigation.model.js";

import Media
  from "../../models/Media.model.js";

const resolveSectionMedia = async (sections) => {
  const mediaIds = new Set();

  for (const section of sections) {
    if (section.content?.heroImage) {
      mediaIds.add(String(section.content.heroImage));
    }

    if (
      Array.isArray(
        section.content?.heroImages
      )
    ) {
      for (const imageId of section.content.heroImages) {
        mediaIds.add(String(imageId));
      }
    }
  }

  if (!mediaIds.size) {
    return sections;
  }

  const mediaItems = await Media.find({
    _id: {
      $in: [...mediaIds],
    },
  }).lean();

  const mediaById = new Map(
    mediaItems.map((media) => [
      String(media._id),
      media,
    ])
  );

  for (const section of sections) {
    if (section.content?.heroImage) {
      const media = mediaById.get(
        String(section.content.heroImage)
      );

      if (media) {
        section.content.heroImage = media;
        section.content.backgroundImage =
          media.url;
      }
    }

    if (
      Array.isArray(
        section.content?.heroImages
      )
    ) {
      section.content.heroImages =
        section.content.heroImages
          .map((imageId) =>
            mediaById.get(String(imageId))
          )
          .filter(Boolean);
    }
  }

  return sections;
};

export const getNavigation =
  async () => {
    return Navigation.find({
      isVisible: true,
    })
      .sort({
        order: 1,
      })
      .lean();
  };

export const getPageBySlug =
  async (slug) => {
    const page =
      await Page.findOne({
        slug,
        status: "PUBLISHED",
        isVisible: true,
      }).lean();

    if (!page) {
      throw new ApiError(
        404,
        "Page not found"
      );
    }

    const sections =
      await PageSection.find({
        pageId: page._id,
        isVisible: true,
      })
        .sort({
          order: 1,
        })
        .lean();

    await resolveSectionMedia(sections);

    return {
      page,
      sections,
    };
  };
