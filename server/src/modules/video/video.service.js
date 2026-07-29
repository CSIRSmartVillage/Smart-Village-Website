import Video from "../../models/Video.model.js";

const getYoutubeThumbnail =
  (url) => {

    const match =
      url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/i
      );

    const videoId =
      match?.[1];

    if (!videoId) {
      return "";
    }

    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

export const createVideo =
  async (
    payload,
    adminId
  ) => {

    return Video.create({
      ...payload,

      thumbnailUrl:
        payload.thumbnailUrl ||
        getYoutubeThumbnail(
          payload.youtubeUrl
        ),

      createdBy:
        adminId,
    });
  };

export const getAllVideos =
  async () => {

    return Video.find()
      .sort({
        displayOrder: 1,
        createdAt: -1,
      });
  };

export const getActiveVideos =
  async () => {

    return Video.find({
      isActive: true,
    }).sort({
      displayOrder: 1,
    });
  };

export const getVideoById =
  async (id) => {

    return Video.findById(
      id
    );
  };

export const updateVideo =
  async (
    id,
    payload
  ) => {

    if (
      payload.youtubeUrl &&
      !payload.thumbnailUrl
    ) {
      payload.thumbnailUrl =
        getYoutubeThumbnail(
          payload.youtubeUrl
        );
    }

    return Video.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
      }
    );
  };

export const deleteVideo =
  async (id) => {

    return Video.findByIdAndDelete(
      id
    );
  };
