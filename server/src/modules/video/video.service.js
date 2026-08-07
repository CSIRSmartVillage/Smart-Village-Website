import Media
  from "../../models/Media.model.js";

import Video
  from "../../models/Video.model.js";

import ApiError
  from "../../utils/ApiError.js";

const getYoutubeThumbnail =
  (url = "") => {
    const match =
      url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/i
      );

    const videoId = match?.[1];

    if (!videoId) {
      return "";
    }

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

const getSelectedMedia =
  async (mediaId) => {
    const media =
      await Media.findById(mediaId);

    const mediaType =
      media?.mediaType ||
      media?.resourceType;

    if (
      !media ||
      mediaType !== "video"
    ) {
      throw new ApiError(
        400,
        "Select a valid video from the Media Library"
      );
    }

    return media;
  };

const resolveVideoSource =
  async (payload) => {
    if (!payload.media) {
      if (!payload.youtubeUrl) {
        return payload;
      }

      return {
        ...payload,
        media: null,
        videoUrl: "",
        thumbnailUrl:
          payload.thumbnailUrl ||
          getYoutubeThumbnail(
            payload.youtubeUrl
          ),
      };
    }

    const media =
      await getSelectedMedia(
        payload.media
      );

    return {
      ...payload,
      media: media._id,
      videoUrl: media.url,
      youtubeUrl: "",
      thumbnailUrl:
        media.thumbnailUrl,
    };
  };

const populateMedia =
  (query) => {
    return query.populate(
      "media",
      [
        "url",
        "thumbnailUrl",
        "originalName",
        "mimeType",
        "size",
        "mediaType",
        "resourceType",
      ].join(" ")
    );
  };

export const createVideo =
  async (
    payload,
    adminId
  ) => {
    const resolvedPayload =
      await resolveVideoSource(
        payload
      );

    return Video.create({
      ...resolvedPayload,
      createdBy: adminId,
    });
  };

export const getAllVideos =
  async () => {
    return populateMedia(
      Video.find()
        .sort({
          displayOrder: 1,
          createdAt: -1,
        })
    );
  };

export const getActiveVideos =
  async () => {
    return populateMedia(
      Video.find({
        isActive: true,
      }).sort({
        displayOrder: 1,
      })
    );
  };

export const getVideoById =
  async (id) => {
    return populateMedia(
      Video.findById(id)
    );
  };

export const updateVideo =
  async (
    id,
    payload
  ) => {
    const resolvedPayload =
      await resolveVideoSource(
        payload
      );

    return populateMedia(
      Video.findByIdAndUpdate(
        id,
        resolvedPayload,
        {
          new: true,
          runValidators: true,
        }
      )
    );
  };

export const deleteVideo =
  async (id) => {
    return Video.findByIdAndDelete(id);
  };