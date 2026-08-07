import * as videoService
  from "./video.service.js";

import ApiResponse
  from "../../utils/ApiResponse.js";

import asyncHandler
  from "../../utils/asyncHandler.js";

export const getPublicVideos =
  asyncHandler(
    async (req, res) => {
      const videos =
        await videoService.getActiveVideos();

      return res.json(
        new ApiResponse(
          200,
          videos
        )
      );
    }
  );

export const createVideo =
  asyncHandler(
    async (req, res) => {
      const video =
        await videoService.createVideo(
          req.body,
          req.admin?._id
        );

      return res
        .status(201)
        .json(
          new ApiResponse(
            201,
            video,
            "Video created successfully"
          )
        );
    }
  );

export const getAllVideos =
  asyncHandler(
    async (req, res) => {
      const videos =
        await videoService.getAllVideos();

      return res.json(
        new ApiResponse(
          200,
          videos
        )
      );
    }
  );

export const getVideoById =
  asyncHandler(
    async (req, res) => {
      const video =
        await videoService.getVideoById(
          req.params.id
        );

      return res.json(
        new ApiResponse(
          200,
          video
        )
      );
    }
  );

export const updateVideo =
  asyncHandler(
    async (req, res) => {
      const video =
        await videoService.updateVideo(
          req.params.id,
          req.body
        );

      return res.json(
        new ApiResponse(
          200,
          video,
          "Video updated successfully"
        )
      );
    }
  );

export const deleteVideo =
  asyncHandler(
    async (req, res) => {
      await videoService.deleteVideo(
        req.params.id
      );

      return res.json(
        new ApiResponse(
          200,
          null,
          "Video deleted successfully"
        )
      );
    }
  );