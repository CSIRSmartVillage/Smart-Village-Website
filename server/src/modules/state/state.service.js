import State from "../../models/State.model.js";
import ApiError from "../../utils/ApiError.js";

/**
 * Create State
 */
export const createState = async (payload) => {
  const existingState = await State.findOne({
    $or: [
      { name: payload.name },
      { slug: payload.slug },
      { code: payload.code },
    ],
  });

  if (existingState) {
    throw new ApiError(
      409,
      "State with the same name, slug, or code already exists."
    );
  }

  return State.create(payload);
};

/**
 * Get All States
 */
export const getAllStates = async () => {
  return State.find()
    .populate("coverImage")
    .sort({
      sortOrder: 1,
      createdAt: 1,
    });
};

/**
 * Get Published States
 */
export const getPublishedStates = async () => {
  return State.find({
    isPublished: true,
  })
    .populate("coverImage")
    .sort({
      sortOrder: 1,
      createdAt: 1,
    })
    .lean();
};

/**
 * Get State By ID
 */
export const getStateById = async (id) => {
  const state = await State.findById(id).populate(
    "coverImage"
  );

  if (!state) {
    throw new ApiError(
      404,
      "State not found."
    );
  }

  return state;
};

/**
 * Get State By Slug
 */
export const getStateBySlug = async (slug) => {
  const state = await State.findOne({
    slug,
  })
    .populate("coverImage")
    .lean();

  if (!state) {
    throw new ApiError(
      404,
      "State not found."
    );
  }

  return state;
};

/**
 * Update State
 */
export const updateState = async (
  id,
  payload
) => {
  const state = await State.findById(id);

  if (!state) {
    throw new ApiError(
      404,
      "State not found."
    );
  }

  if (
    payload.slug ||
    payload.name ||
    payload.code
  ) {
    const duplicate =
      await State.findOne({
        _id: { $ne: id },
        $or: [
          { name: payload.name },
          { slug: payload.slug },
          { code: payload.code },
        ],
      });

    if (duplicate) {
      throw new ApiError(
        409,
        "Another state already uses this name, slug, or code."
      );
    }
  }

  Object.assign(state, payload);

  await state.save();

  return state.populate("coverImage");
};

/**
 * Delete State
 */
export const deleteState = async (
  id
) => {
  const state = await State.findById(id);

  if (!state) {
    throw new ApiError(
      404,
      "State not found."
    );
  }

  await state.deleteOne();

  return true;
};
