import Media
  from "../../models/Media.model.js";

import Video
  from "../../models/Video.model.js";

import Supporter
  from "../supporter/supporter.model.js";

import {
  deleteFile,
  uploadFile,
} from "../../services/s3.service.js";

import ApiError
  from "../../utils/ApiError.js";

export const getAllMedia =
  async ({ mediaType } = {}) => {
    const query = {};

    if (
      ["image", "video"].includes(
        mediaType
      )
    ) {
      query.$or = [
        { mediaType },
        {
          mediaType: {
            $exists: false,
          },
          resourceType: mediaType,
        },
      ];
    }

    return Media.find(query)
      .sort({
        createdAt: -1,
      });
  };

export const getMediaById =
  async (id) => {
    return Media.findById(id);
  };

export const createMedia =
  async (payload) => {
    return Media.create(payload);
  };

export const uploadMedia =
  async ({
    file,
    thumbnail,
    uploadedBy,
  }) => {
    if (!file) {
      throw new ApiError(
        400,
        "No file uploaded"
      );
    }

    const isImage =
      file.mimetype.startsWith(
        "image/"
      );

    const isVideo =
      file.mimetype.startsWith(
        "video/"
      );

    const mediaType =
      isVideo
        ? "video"
        : isImage
        ? "image"
        : undefined;

    if (
      isVideo &&
      !thumbnail
    ) {
      throw new ApiError(
        400,
        "Unable to generate a thumbnail for this video"
      );
    }

    const uploadedKeys = [];

    try {
      const uploadResult =
        await uploadFile({
          file,
          folder: "media",
        });

      uploadedKeys.push(
        uploadResult.publicId
      );

      let thumbnailResult = null;

      if (thumbnail) {
        thumbnailResult =
          await uploadFile({
            file: thumbnail,
            folder:
              "media/thumbnails",
          });

        uploadedKeys.push(
          thumbnailResult.publicId
        );
      }

      return await createMedia({
        filename:
          uploadResult.filename,
        originalName:
          file.originalname,
        url: uploadResult.url,
        publicId:
          uploadResult.publicId,
        resourceType:
          mediaType || "raw",
        mediaType,
        mimeType:
          uploadResult.mimeType,
        size: uploadResult.size,
        thumbnailUrl:
          thumbnailResult?.url || "",
        thumbnailPublicId:
          thumbnailResult?.publicId || "",
        uploadedBy,
      });
    } catch (error) {
      await Promise.allSettled(
        uploadedKeys.map(
          (key) => deleteFile(key)
        )
      );

      throw error;
    }
  };

export const deleteMedia =
  async (id) => {
    const media =
      await Media.findById(id);

    if (!media) {
      throw new ApiError(
        404,
        "Media not found"
      );
    }

    const isUsedByVideo =
      await Video.exists({
        media: id,
      });

    if (isUsedByVideo) {
      throw new ApiError(
        409,
        "This video is in use. Delete its Website Content video record before removing it from the Media Library."
      );
    }

    const isUsedBySupporter =
      await Supporter.exists({
        "logo.publicId": media.publicId,
        isDeleted: false,
      });

    if (isUsedBySupporter) {
      throw new ApiError(
        409,
        "This image is in use by a supporter. Update or delete the supporter before removing it from the Media Library."
      );
    }

    const objectKeys = [
      media.publicId,
      media.thumbnailPublicId,
    ].filter(Boolean);

    await Promise.all(
      objectKeys.map(
        (key) => deleteFile(key)
      )
    );

    return Media.findByIdAndDelete(id);
  };