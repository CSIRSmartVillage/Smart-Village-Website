import mongoose from "mongoose";
import Event from "./Event.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Create Event
 */
export const createEvent = async (data, adminId) => {
  const event = await Event.create({
    ...data,
    createdBy: adminId,
    updatedBy: adminId,
  });

  return event.populate([
    {
      path: "village",
      select: "name slug",
    },
    {
      path: "createdBy",
      select: "name email",
    },
  ]);
};

/**
 * Get All Events
 */
export const getEvents = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    search,
    village,
    type,
    status,
    featured,
    showOnVillageInfo,
    published,
    sortBy = "eventDate",
    sortOrder = "desc",
  } = query;

  const filter = {
    isDeleted: false,
  };

  if (search) {
       filter.$or = [
  {
    title: {
      $regex: search,
      $options: "i",
    },
  },
  {
    summary: {
      $regex: search,
      $options: "i",
    },
  },
  {
    category: {
      $regex: search,
      $options: "i",
    },
  },
];
  }

  if (village) filter.village = village;
  if (type) filter.type = type;
  if (status) filter.status = status;

  if (featured !== undefined) {
    filter.isFeatured = featured === "true";
  }

  if (showOnVillageInfo !== undefined) {
    filter.showOnVillageInfo =
      showOnVillageInfo === "true";
  }

  if (published !== undefined) {
    filter.published = published === "true";
  }

  const skip = (Number(page) - 1) * Number(limit);

  const sort =
    showOnVillageInfo === "true"
      ? {
          highlightOrder: 1,
          eventDate: -1,
        }
      : {
          [sortBy]: sortOrder === "asc" ? 1 : -1,
        };

  const [events, total] = await Promise.all([
    Event.find(filter)
      .populate("village", "name slug")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),

    Event.countDocuments(filter),
  ]);

  return {
    data: events,

    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * Get Event By ID
 */
export const getEventById = async (id) => {
  const event = await Event.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("village", "name slug")
    .populate("createdBy", "name email")
    .populate("updatedBy", "name email");

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
};

/**
 * Get Event By Slug
 */
export const getEventBySlug = async (slug) => {
  const event = await Event.findOne({
    slug,
    published: true,
    isDeleted: false,
  })
    .populate("village", "name slug")
    .lean();

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  const relatedEvents = await getRelatedEvents(
    event._id,
    event.village._id
  );

  return {
    event,
    relatedEvents,
  };
};


/**
 * Get Featured Event
 */
export const getFeaturedEvent = async () => {
  const event = await Event.findOne({
    published: true,
    isDeleted: false,
    isFeatured: true,
  })
    .populate("village", "name slug")
    .sort({
      eventDate: -1,
    })
    .lean();

  if (!event) {
    throw new ApiError(
      404,
      "Featured event not found."
    );
  }

  return event;
};

/**
 * Update Event
 */
export const updateEvent = async (
  id,
  data,
  adminId
) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      ...data,
      updatedBy: adminId,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate("village", "name slug");

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
};

/**
 * Soft Delete Event
 */
export const deleteEvent = async (
  id,
  adminId
) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isDeleted: true,
      updatedBy: adminId,
    },
    {
      new: true,
    }
  );

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
};

/**
 * Publish / Unpublish
 */
export const togglePublish = async (
  id,
  published,
 adminId
) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      published,
      updatedBy: adminId,
    },
    {
      new: true,
    }
  );

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
};

/**
 * Feature / Unfeature
 */
export const toggleFeatured = async (
  id,
  featured,
  adminId
) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isFeatured: featured,
      updatedBy: adminId,
    },
    {
      new: true,
    }
  );

  if (!event) {
    throw new ApiError(404, "Event not found.");
  }

  return event;
};

/**
 * Get Event Statistics
 */
export const getEventStatistics =
  async (query = {}) => {
    const { village } = query;
    const match = {
      published: true,
      isDeleted: false,
    };

    if (village) {
      match.village =
        new mongoose.Types.ObjectId(village);
    }

    const [stats = {}] = await Event.aggregate([
      {
        $match: match,
      },
      {
        $addFields: {
          normalizedStatus: {
            $toUpper: {
              $trim: {
                input: {
                  $ifNull: ["$status", ""],
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: 1,
          },
          upcoming: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$normalizedStatus",
                    "UPCOMING",
                  ],
                },
                1,
                0,
              ],
            },
          },
          completed: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$normalizedStatus",
                    "COMPLETED",
                  ],
                },
                1,
                0,
              ],
            },
          },
          ongoing: {
            $sum: {
              $cond: [
                {
                  $eq: [
                    "$normalizedStatus",
                    "ONGOING",
                  ],
                },
                1,
                0,
              ],
            },
          },
          achievements: {
            $sum: {
              $cond: [
                { $eq: ["$type", "ACHIEVEMENT"] },
                1,
                0,
              ],
            },
          },
          featured: {
            $sum: {
              $cond: [
                { $eq: ["$isFeatured", true] },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    return {
      total: stats.total || 0,
      upcoming: stats.upcoming || 0,
      ongoing: stats.ongoing || 0,
      completed: stats.completed || 0,
      achievements: stats.achievements || 0,
      featured: stats.featured || 0,
    };
  };

  /**
 * Get Related Events
 */
export const getRelatedEvents = async (
  eventId,
  villageId,
  limit = 3
) => {
  const events = await Event.find({
    _id: { $ne: eventId },
    village: villageId,
    published: true,
    isDeleted: false,
  })
    .populate("village", "name slug")
    .sort({
      eventDate: -1,
    })
    .limit(limit)
    .lean();

  return events;
};
