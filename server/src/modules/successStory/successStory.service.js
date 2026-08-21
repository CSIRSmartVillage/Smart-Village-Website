import slugify from "slugify";

import SuccessStory
  from "../../models/SuccessStory.model.js";

import SuccessStoryVillage
  from "../../models/SuccessStoryVillage.model.js";
import Village
  from "../../models/Village.model.js";

import ApiError
  from "../../utils/ApiError.js";
const normalizeVillage =
  (village) => {
    if (!village) {
      return village;
    }

    const normalized = {
      ...village,
    };

    if (
      normalized.name &&
      typeof normalized.name === "object"
    ) {
      normalized.name =
        normalized.name.en ||
        normalized.name.regional ||
        "";
    }

    return normalized;
  };

const normalizeStory =
  (story) => ({
    ...story,
    village:
      normalizeVillage(story.village),
  });

const generateUniqueSlug =
  async (title, excludeId = null) => {
    const baseSlug =
      slugify(title, {
        lower: true,
        strict: true,
        trim: true,
      }) || "success-story";

    let candidate = baseSlug;
    let suffix = 2;

    while (
      await SuccessStory.exists({
        slug: candidate,
        ...(excludeId
          ? { _id: { $ne: excludeId } }
          : {}),
      })
    ) {
      candidate =
        baseSlug + "-" + suffix;
      suffix += 1;
    }

    return candidate;
  };
const hasOwn =

  (object, key) =>
    Object.prototype.hasOwnProperty.call(
      object,
      key
    );

const normalizeStoryPayload =
  (payload = {}) => {
    const normalized = {
      ...payload,
    };

    [
      "title",
      "videoUrl",
      "summary",
      "story",
      "impact",
    ].forEach((field) => {
      if (
        hasOwn(normalized, field) &&
        normalized[field] == null
      ) {
        normalized[field] = "";
      }
    });

    if (
      hasOwn(normalized, "village")
    ) {
      normalized.village =
        normalized.village || null;
    }

    if (
      hasOwn(
        normalized,
        "featuredImage"
      )
    ) {
      normalized.featuredImage =
        normalized.featuredImage ||
        null;
    }

    if (
      hasOwn(
        normalized,
        "galleryImages"
      )
    ) {
      normalized.galleryImages =
        Array.isArray(
          normalized.galleryImages
        )
          ? normalized.galleryImages
              .filter(Boolean)
          : [];
    }

    if (
      hasOwn(
        normalized,
        "beneficiaries"
      ) &&
      (normalized.beneficiaries == null ||
        normalized.beneficiaries === "")
    ) {
      normalized.beneficiaries = null;
    }

    if (
      hasOwn(normalized, "isFeatured") &&
      normalized.isFeatured == null
    ) {
      normalized.isFeatured = false;
    }

    if (
      hasOwn(normalized, "status") &&
      !normalized.status
    ) {
      delete normalized.status;
    }

    return normalized;
  };


export const getAllStories =
  async () => {
    const stories =
      await SuccessStory.find()
      .populate("featuredImage")
      .populate("galleryImages")
      .populate("village")
      .sort({
        createdAt: -1,
      })
      .lean();

    return stories.map(
      normalizeStory
    );
  };

export const getPublishedStories =
  async () => {
    const stories =
      await SuccessStory.find({
        status: "PUBLISHED",
      })
      .populate("featuredImage")
      .populate("galleryImages")
      .populate("village")
      .sort({
        createdAt: -1,
      })
      .lean();

    return stories.map(
      normalizeStory
    );
  };

export const getPublishedStoryVillages =
  async () => {
    const legacyReferences =
      await SuccessStory.find({
        status: "PUBLISHED",
        villageModel: {
          $ne: "Village",
        },
      })
        .distinct("village");

    const [
      mainVillages,
      legacyVillages,
    ] = await Promise.all([
      Village.find({
        isPublished: true,
        status: "ACTIVE",
        isActive: true,
      })
        .populate("coverImage")
        .sort({
          sortOrder: 1,
          createdAt: 1,
        })
        .lean(),
      legacyReferences.length
        ? SuccessStoryVillage.find({
            _id: {
              $in: legacyReferences,
            },
            isPublished: true,
          })
            .populate("coverImage")
            .populate("bannerImage")
            .populate("video.media")
            .lean()
        : [],
    ]);

    const villagesBySlug =
      new Map();

    mainVillages.forEach(
      (village) => {
        villagesBySlug.set(
          village.slug,
          normalizeVillage(village)
        );
      }
    );

    legacyVillages.forEach(
      (village) => {
        if (
          !villagesBySlug.has(
            village.slug
          )
        ) {
          villagesBySlug.set(
            village.slug,
            normalizeVillage(village)
          );
        }
      }
    );

    return Array.from(
      villagesBySlug.values()
    );
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

    return normalizeStory(
      story
    );
  };

export const getStoryById =
  async (id) => {
    const story =
      await SuccessStory.findById(id)
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

    return normalizeStory(
      story
    );
  };

export const getStoriesByVillageSlug =
  async (villageSlug) => {
    const [
      mainVillage,
      legacyVillage,
    ] = await Promise.all([
      Village.findOne({
        slug: villageSlug,
        isPublished: true,
        status: "ACTIVE",
        isActive: true,
      })
        .populate("coverImage")
        .lean(),
      SuccessStoryVillage.findOne({
        slug: villageSlug,
        isPublished: true,
      })
        .populate("coverImage")
        .populate("bannerImage")
        .populate("video.media")
        .lean(),
    ]);

    if (
      !mainVillage &&
      !legacyVillage
    ) {
      throw new ApiError(
        404,
        "Village not found"
      );
    }

    const villageFilters = [];

    if (mainVillage) {
      villageFilters.push({
        village: mainVillage._id,
        villageModel: "Village",
      });
    }

    if (legacyVillage) {
      villageFilters.push({
        village: legacyVillage._id,
        $or: [
          {
            villageModel:
              "SuccessStoryVillage",
          },
          {
            villageModel: {
              $exists: false,
            },
          },
        ],
      });
    }

    const stories =
      await SuccessStory.find({
        status: "PUBLISHED",
        $or: villageFilters,
      })
        .populate("featuredImage")
        .populate("galleryImages")
        .populate("village")
        .sort({
          createdAt: -1,
        })
        .lean();

    return {
      village: normalizeVillage(
        mainVillage ||
          legacyVillage
      ),
      stories: stories.map(
        normalizeStory
      ),
    };
  };

export const createStory =
  async (payload, adminId) => {
    const storyPayload =
      normalizeStoryPayload(payload);

    if (storyPayload.village) {
      const village =
        await Village.findById(
          storyPayload.village
        );

      if (!village) {
        throw new ApiError(
          404,
          "Selected village not found"
        );
      }
    }

    const generatedSlug =
      await generateUniqueSlug(
        storyPayload.title || ""
      );

    const story =
      await SuccessStory.create({
        ...storyPayload,
        slug: generatedSlug,
        villageModel:
          storyPayload.village
            ? "Village"
            : undefined,
        createdBy: adminId || null,
        updatedBy: adminId || null,
        publishedAt:
          storyPayload.status ===
            "PUBLISHED"
            ? new Date()
            : null,
      });

    return getStoryById(
      story._id
    );
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

    const updatePayload =
      normalizeStoryPayload(payload);

    delete updatePayload.slug;
    delete updatePayload.villageModel;

    if (
      hasOwn(
        updatePayload,
        "title"
      ) &&
      updatePayload.title !==
        story.title
    ) {
      updatePayload.slug =
        await generateUniqueSlug(
          updatePayload.title,
          story._id
        );
    }

    if (
      hasOwn(updatePayload, "village")
    ) {
      if (!updatePayload.village) {
        story.village = null;
        story.villageModel =
          undefined;
      } else {
        const villageChanged =
          String(
            updatePayload.village
          ) !==
          String(story.village);

        if (villageChanged) {
          const village =
            await Village.findById(
              updatePayload.village
            );

          if (!village) {
            throw new ApiError(
              404,
              "Selected village not found"
            );
          }

          story.village =
            updatePayload.village;
          story.villageModel =
            "Village";
        }
      }

      delete updatePayload.village;
    }

    Object.assign(
      story,
      updatePayload
    );

    if (
      updatePayload.status ===
        "PUBLISHED" &&
      !story.publishedAt
    ) {
      story.publishedAt =
        new Date();
    }

    story.updatedBy =
      adminId || story.updatedBy;

    await story.save();

    return getStoryById(
      story._id
    );
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
