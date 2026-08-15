import Supporter from "./supporter.model.js";
import ApiError from "../../utils/ApiError.js";

const getSupporterOrThrow = async (id) => {
  const supporter = await Supporter.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!supporter) {
    throw new ApiError(404, "Supporter not found.");
  }

  return supporter;
};

const buildFilter = ({ type, search } = {}) => {
  const filter = {
    isDeleted: false,
  };

  if (type) filter.type = type;

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        about: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  return filter;
};

export const createSupporter = async (payload, adminId) =>
  Supporter.create({
    ...payload,
    createdBy: adminId,
    updatedBy: adminId,
  });

export const getPublicSupporters = async (query = {}) =>
  Supporter.find(buildFilter(query))
    .select("type name link logo about createdAt")
    .sort({ type: 1, createdAt: -1 })
    .lean();

export const getAdminSupporters = async (query = {}) =>
  Supporter.find(buildFilter(query))
    .populate("createdBy", "username email")
    .populate("updatedBy", "username email")
    .sort({ type: 1, createdAt: -1 })
    .lean();

export const getSupporterById = async (id) => {
  const supporter = await Supporter.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("createdBy", "username email")
    .populate("updatedBy", "username email")
    .lean();

  if (!supporter) {
    throw new ApiError(404, "Supporter not found.");
  }

  return supporter;
};

export const updateSupporter = async (
  id,
  payload,
  adminId
) => {
  const supporter = await Supporter.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      ...payload,
      updatedBy: adminId,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!supporter) {
    throw new ApiError(404, "Supporter not found.");
  }

  return supporter;
};

export const deleteSupporter = async (id, adminId) => {
  const supporter = await getSupporterOrThrow(id);

  supporter.isDeleted = true;
  supporter.updatedBy = adminId;
  await supporter.save();

  return true;
};