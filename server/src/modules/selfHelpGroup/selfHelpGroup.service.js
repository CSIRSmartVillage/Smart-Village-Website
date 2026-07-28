import SelfHelpGroup from "./SelfHelpGroup.model.js";
import Village from "../../models/Village.model.js";
import ApiError from "../../utils/ApiError.js";

const populateVillage =
  "name slug district state";

const adminPopulate = [
  {
    path: "village",
    select: populateVillage,
  },
  {
    path: "createdBy",
    select: "username email",
  },
  {
    path: "updatedBy",
    select: "username email",
  },
];

const findShgOrThrow = async (id) => {
  const shg = await SelfHelpGroup.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!shg) {
    throw new ApiError(
      404,
      "Self Help Group not found."
    );
  }

  return shg;
};

const ensureVillageExists = async (villageId) => {
  const village = await Village.findById(villageId)
    .select("_id")
    .lean();

  if (!village) {
    throw new ApiError(404, "Village not found.");
  }
};

const normalizePublishing = (payload) => {
  const next = {
    ...payload,
  };

  if (next.status === "PUBLISHED") {
    next.isPublished = true;
  }

  if (next.isPublished === false) {
    next.status = next.status || "DRAFT";
  }

  if (
    next.isPublished === true &&
    next.status !== "ARCHIVED"
  ) {
    next.status = "PUBLISHED";
  }

  return next;
};

export const createSelfHelpGroup = async (
  payload,
  adminId
) => {
  await ensureVillageExists(payload.village);

  const shg = await SelfHelpGroup.create({
    ...normalizePublishing(payload),
    createdBy: adminId,
    updatedBy: adminId,
  });

  return shg.populate(
    "village",
    populateVillage
  );
};

export const updateSelfHelpGroup = async (
  id,
  payload,
  adminId
) => {
  if (payload.village) {
    await ensureVillageExists(payload.village);
  }

  const shg = await SelfHelpGroup.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      ...normalizePublishing(payload),
      updatedBy: adminId,
    },
    {
      new: true,
      runValidators: true,
    }
  ).populate(adminPopulate);

  if (!shg) {
    throw new ApiError(
      404,
      "Self Help Group not found."
    );
  }

  return shg;
};

export const deleteSelfHelpGroup = async (
  id,
  adminId
) => {
  const shg = await findShgOrThrow(id);

  shg.isDeleted = true;
  shg.updatedBy = adminId;
  await shg.save();

  return true;
};

export const getSelfHelpGroupById =
  async (id) => {
    const shg = await SelfHelpGroup.findOne({
      _id: id,
      isDeleted: false,
    }).populate(adminPopulate);

    if (!shg) {
      throw new ApiError(
        404,
        "Self Help Group not found."
      );
    }

    return shg;
  };

export const getSelfHelpGroupBySlug =
  async (slug) => {
    const shg = await SelfHelpGroup.findOne({
      slug,
      isPublished: true,
      status: "PUBLISHED",
      isDeleted: false,
    })
      .populate("village", populateVillage)
      .lean();

    if (!shg) {
      throw new ApiError(
        404,
        "Self Help Group not found."
      );
    }

    return shg;
  };

export const getSelfHelpGroupsByVillage =
  async (villageSlug, query = {}) => {
    const village = await Village.findOne({
      slug: villageSlug,
    })
      .select("_id name slug district state")
      .lean();

    if (!village) {
      throw new ApiError(404, "Village not found.");
    }

    const {
      page = 1,
      limit = 10,
      search,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = query;

    const filter = {
      village: village._id,
      isPublished: true,
      status: "PUBLISHED",
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          groupName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "leader.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [groups, total] = await Promise.all([
      SelfHelpGroup.find(filter)
        .sort({
          [sortBy]: sortOrder === "desc" ? -1 : 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      SelfHelpGroup.countDocuments(filter),
    ]);

    return {
      village,
      data: groups,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  };

export const getAllSelfHelpGroups =
  async (query = {}) => {
    const {
      page = 1,
      limit = 10,
      search,
      village,
      status,
      published,
      sortBy = "displayOrder",
      sortOrder = "asc",
    } = query;

    const filter = {
      isDeleted: false,
    };

    if (search) {
      filter.$or = [
        {
          groupName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "leader.name": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (village) filter.village = village;
    if (status) filter.status = status;

    if (published !== undefined) {
      filter.isPublished = published === "true";
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [groups, total] = await Promise.all([
      SelfHelpGroup.find(filter)
        .populate("village", "name slug district state")
        .sort({
          [sortBy]: sortOrder === "desc" ? -1 : 1,
          createdAt: -1,
        })
        .skip(skip)
        .limit(limitNumber)
        .lean(),

      SelfHelpGroup.countDocuments(filter),
    ]);

    return {
      data: groups,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  };

export const toggleSelfHelpGroupPublish =
  async (id, adminId) => {
    const shg = await findShgOrThrow(id);

    shg.isPublished = !shg.isPublished;
    shg.status = shg.isPublished
      ? "PUBLISHED"
      : "DRAFT";
    shg.updatedBy = adminId;

    await shg.save();

    return shg.populate(adminPopulate);
  };
