import * as eventService from "./event.service.js";

import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";

export const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(
    req.body,
    req.admin._id
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      event,
      "Event created successfully."
    )
  );
});

export const getEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getEvents({
    ...req.query,
    published: "true",
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Events fetched successfully."
    )
  );
});

export const getAdminEvents = asyncHandler(async (req, res) => {
  const result = await eventService.getEvents(req.query);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Admin events fetched successfully."
    )
  );
});

export const getNewsUpdates = asyncHandler(async (_req, res) => {
  const events = await eventService.getNewsUpdates();

  return res.status(200).json(
    new ApiResponse(
      200,
      events,
      "Village news updates fetched successfully."
    )
  );
});

export const getHomePageNews = asyncHandler(async (_req, res) => {
  const events = await eventService.getHomePageNews();

  return res.status(200).json(
    new ApiResponse(
      200,
      events,
      "Home page news fetched successfully."
    )
  );
});

export const getAdminNewsItems = asyncHandler(async (_req, res) => {
  const events = await eventService.getAdminNewsItems();

  return res.status(200).json(
    new ApiResponse(
      200,
      events,
      "Admin news items fetched successfully."
    )
  );
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event fetched successfully."
    )
  );
});

export const getEventBySlug = asyncHandler(async (req, res) => {
  const event = await eventService.getEventBySlug(
    req.params.slug
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event fetched successfully."
    )
  );
});

/**
 * Get Featured Event
 */
export const getFeaturedEvent = asyncHandler(
  async (req, res) => {
    const event =
      await eventService.getFeaturedEvent();

    return res.status(200).json(
      new ApiResponse(
        200,
        event,
        "Featured event fetched successfully."
      )
    );
  }
);

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(
    req.params.id,
    req.body,
    req.admin._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event updated successfully."
    )
  );
});

export const deleteEvent = asyncHandler(async (req, res) => {
  const event = await eventService.deleteEvent(
    req.params.id,
    req.admin._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Event deleted successfully."
    )
  );
});

export const togglePublish = asyncHandler(async (req, res) => {
  const event = await eventService.togglePublish(
    req.params.id,
    req.body.published,
    req.admin._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Publish status updated successfully."
    )
  );
});

export const toggleFeatured = asyncHandler(async (req, res) => {
  const event = await eventService.toggleFeatured(
    req.params.id,
    req.body.isFeatured,
    req.admin._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      event,
      "Featured status updated successfully."
    )
  );
});

export const toggleHomePageFeature = asyncHandler(
  async (req, res) => {
    const event = await eventService.toggleHomePageFeature(
      req.params.id,
      req.body.featureOnHomePage,
      req.admin._id
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        event,
        "Home page feature status updated successfully."
      )
    );
  }
);

/**
 * Get Event Statistics
 */
export const getEventStatistics = asyncHandler(
  async (req, res) => {
    const statistics =
      await eventService.getEventStatistics(
        req.query
      );

    res.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );

    return res.status(200).json(
      new ApiResponse(
        200,
        statistics,
        "Event statistics fetched successfully."
      )
    );
  }
);
