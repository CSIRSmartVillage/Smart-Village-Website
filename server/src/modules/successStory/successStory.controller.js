import * as successStoryService
  from "./successStory.service.js";

import ApiResponse
  from "../../utils/ApiResponse.js";

export const getAllStories =
  async (req, res) => {
    const stories =
      await successStoryService.getAllStories();

    return res.json(
      new ApiResponse(
        200,
        stories,
        "Success stories fetched successfully"
      )
    );
  };

export const getPublishedStories =
  async (req, res) => {
    const stories =
      await successStoryService.getPublishedStories();

    return res.json(
      new ApiResponse(
        200,
        stories,
        "Published success stories fetched successfully"
      )
    );

  };
export const getPublishedStoryVillages =
  async (req, res) => {
    const villages =
      await successStoryService.getPublishedStoryVillages();

    return res.json(
      new ApiResponse(
        200,
        villages,
        "Success story villages fetched successfully"
      )
    );
  };

export const getStoriesByVillageSlug =
  async (req, res) => {
    const data =
      await successStoryService.getStoriesByVillageSlug(
        req.params.villageSlug
      );

    return res.json(
      new ApiResponse(
        200,
        data,
        "Village success stories fetched successfully"
      )
    );
  };

export const getStoryBySlug =
  async (req, res) => {
    const story =
      await successStoryService.getStoryBySlug(
        req.params.slug
      );

    return res.json(
      new ApiResponse(
        200,
        story,
        "Success story fetched successfully"
      )
    );
  };

export const createStory =
  async (req, res) => {
    const story =
      await successStoryService.createStory(
        req.body,
        req.admin?._id
      );

    return res.json(
      new ApiResponse(
        201,
        story,
        "Success story created successfully"
      )
    );
  };

export const getStoryById =
  async (req, res) => {
    const story =
      await successStoryService.getStoryById(
        req.params.id
      );

    return res.json(
      new ApiResponse(
        200,
        story,
        "Success story fetched successfully"
      )
    );
  };

export const updateStory =
  async (req, res) => {
    const story =
      await successStoryService.updateStory(
        req.params.id,
        req.body,
        req.admin?._id
      );

    return res.json(
      new ApiResponse(
        200,
        story,
        "Success story updated successfully"
      )
    );
  };

export const deleteStory =
  async (req, res) => {
    await successStoryService.deleteStory(
      req.params.id
    );

    return res.json(
      new ApiResponse(
        200,
        null,
        "Success story deleted successfully"
      )
    );
  };