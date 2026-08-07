import * as mediaService
  from "./mediaManagement.service.js";

import ApiResponse
  from "../../utils/ApiResponse.js";

export const uploadMedia =
  async (req, res) => {
    const media =
      await mediaService.uploadMedia({
        file:
          req.files?.file?.[0],
        thumbnail:
          req.files?.thumbnail?.[0],
        uploadedBy:
          req.admin?._id,
      });

    return res.json(
      new ApiResponse(
        201,
        media,
        "File uploaded successfully"
      )
    );
  };

export const getAllMedia =
  async (req, res) => {
    const media =
      await mediaService.getAllMedia({
        mediaType:
          req.query.type,
      });

    return res.json(
      new ApiResponse(
        200,
        media,
        "Media fetched successfully"
      )
    );
  };

export const getMediaById =
  async (req, res) => {
    const media =
      await mediaService.getMediaById(
        req.params.id
      );

    return res.json(
      new ApiResponse(
        200,
        media,
        "Media fetched successfully"
      )
    );
  };

export const createMedia =
  async (req, res) => {
    const media =
      await mediaService.createMedia(
        req.body
      );

    return res.json(
      new ApiResponse(
        201,
        media,
        "Media created successfully"
      )
    );
  };

export const deleteMedia =
  async (req, res) => {
    await mediaService.deleteMedia(
      req.params.id
    );

    return res.json(
      new ApiResponse(
        200,
        null,
        "Media deleted successfully"
      )
    );
  };