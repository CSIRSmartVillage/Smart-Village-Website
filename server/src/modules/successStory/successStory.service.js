import SuccessStory
  from "../../models/SuccessStory.model.js";

import SuccessStoryVillage
  from "../../models/SuccessStoryVillage.model.js";

import ApiError
  from "../../utils/ApiError.js";

export const getAllStories =
  async () => {
    return SuccessStory.find()
      .populate("featuredImage")
      .populate("galleryImages")
      .populate("village")
      .sort({
        createdAt: -1,
      });
  };

export const getPublishedStories =
  async () => {
    return SuccessStory.find({
      status: "PUBLISHED",
    })
      .populate("featuredImage")
      .populate("galleryImages")
      .populate("village")
      .sort({
        createdAt: -1,
      })
      .lean();
  };

export const getStoryBySlug =
  async (slug) => {
    const story =
      await SuccessStory.findOne({
        slug,
      })
        .populate("featuredImage")
        .populate("galleryImages")
        .populate("village")
        .lean();

    if (!story) {
      throw new ApiError(
        404,
        "Success story not found"
      );
    }

    return story;
  };

export const getStoryById =
  async (id) => {
    const story =
      await SuccessStory.findById(id)
        .populate("featuredImage")
        .populate("galleryImages")
        .populate("village");

    if (!story) {
      throw new ApiError(
        404,
        "Success story not found"
      );
    }

    return story;
  };

export const getStoriesByVillageSlug =
  async (villageSlug) => {
    const village =
      await SuccessStoryVillage.findOne({
        slug: villageSlug,
        isPublished: true,
      })
        .populate("coverImage")
        .populate("bannerImage")
        .populate("video.media")
        .lean();

    if (!village) {
      throw new ApiError(
        404,
        "Success story village not found"
      );
    }

    const stories =
      await SuccessStory.find({
        village: village._id,
        status: "PUBLISHED",
      })
        .populate("featuredImage")
        .populate("galleryImages")
        .populate("village")
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      village,
      stories,
    };
  };

export const createStory =
  async (payload, adminId) => {
    const existing =
      await SuccessStory.findOne({
        slug: payload.slug,
      });

    if (existing) {
      throw new ApiError(
        400,
        "Success story with this slug already exists"
      );
    }

    const village =
      await SuccessStoryVillage.findById(
        payload.village
      );

    if (!village) {
      throw new ApiError(
        404,
        "Selected success story village not found"
      );
    }

    const story =
      await SuccessStory.create({
        ...payload,
        createdBy: adminId || null,
        updatedBy: adminId || null,
        publishedAt:
          payload.status === "PUBLISHED"
            ? new Date()
            : null,
      });

    return story;
  };

export const updateStory =
  async (
    id,
    payload,
    adminId
  ) => {
    const story =
      await SuccessStory.findById(id);

    if (!story) {
      throw new ApiError(
        404,
        "Success story not found"
      );
    }

    if (
      payload.slug &&
      payload.slug !== story.slug
    ) {
      const existing =
        await SuccessStory.findOne({
          slug: payload.slug,
          _id: { $ne: id },
        });

      if (existing) {
        throw new ApiError(
          400,
          "Success story with this slug already exists"
        );
      }
    }

    if (payload.village) {
      const village =
        await SuccessStoryVillage.findById(
          payload.village
        );

      if (!village) {
        throw new ApiError(
          404,
          "Selected success story village not found"
        );
      }
    }

    Object.assign(story, payload);

    if (
      payload.status === "PUBLISHED" &&
      !story.publishedAt
    ) {
      story.publishedAt =
        new Date();
    }

    story.updatedBy =
      adminId || story.updatedBy;

    await story.save();

    return story;
  };

export const deleteStory =
  async (id) => {
    const story =
      await SuccessStory.findById(id);

    if (!story) {
      throw new ApiError(
        404,
        "Success story not found"
      );
    }

    await story.deleteOne();

    return true;
  };
