import Village from "../../models/Village.model.js";
import State from "../../models/State.model.js";
import ApiError from "../../utils/ApiError.js";

/*
=====================================
Create Village
=====================================
*/

export const createVillage = async (
  payload,
  adminId
) => {
  const existingVillage = await Village.findOne({
    $or: [
      { slug: payload.slug },
      { villageCode: payload.villageCode },
      { "name.en": payload.name.en },
    ],
  });

  if (existingVillage) {
    throw new ApiError(
      409,
      "Village with the same name, slug, or village code already exists."
    );
  }

  const village = await Village.create({
    ...payload,
    createdBy: adminId,
  });

  return village.populate([
    {
      path: "state",
    },
    {
      path: "coverImage",
    },
  ]);
};

/*
=====================================
Get All Villages (Admin)
=====================================
*/

export const getAllVillages =
  async () => {
    return Village.find()
      .populate("state")
      .populate("coverImage")
      .sort({
        sortOrder: 1,
        createdAt: 1,
      });
  };

/*
=====================================
Get Published Villages (Public)
=====================================
*/

export const getPublishedVillages =
  async () => {
    return Village.find({
      isPublished: true,
      status: "ACTIVE",
      isActive: true,
    })
      .populate("state")
      .populate("coverImage")
      .sort({
        sortOrder: 1,
        createdAt: 1,
      })
      .lean();
  };

/*
=====================================
Get Village By ID
=====================================
*/

export const getVillageById =
  async (id) => {
    const village =
      await Village.findById(id)
        .populate("state")
        .populate("coverImage");

    if (!village) {
      throw new ApiError(
        404,
        "Village not found."
      );
    }

    return village;
  };

/*
=====================================
Get Village By Slug
=====================================
*/

export const getVillageBySlug =
  async (slug) => {
    const village =
      await Village.findOne({
        slug,
        isPublished: true,
        status: "ACTIVE",
        isActive: true,
      })
        .populate("state")
        .populate("coverImage")
        .lean();

    if (!village) {
      throw new ApiError(
        404,
        "Village not found."
      );
    }

    return village;
  };



  export const getVillage = async (id) => {
  const village = await Village.findById(id)
    .populate("state");

  if (!village) {
    throw new ApiError(
      404,
      "Village not found."
    );
  }

  return village;
};



/*
=====================================
Update Village
=====================================
*/

export const updateVillage =
  async (
    id,
    payload,
    adminId
  ) => {
    const village =
      await Village.findById(id);

    if (!village) {
      throw new ApiError(
        404,
        "Village not found."
      );
    }

    if (
      payload.slug ||
      payload.villageCode ||
      payload.name?.en
    ) {
      const duplicate =
        await Village.findOne({
          _id: { $ne: id },
          $or: [
            { slug: payload.slug },
            {
              villageCode:
                payload.villageCode,
            },
            {
              "name.en":
                payload.name?.en,
            },
          ],
        });

      if (duplicate) {
        throw new ApiError(
          409,
          "Another village already uses this name, slug, or village code."
        );
      }
    }

    Object.assign(village, payload);

    village.updatedBy = adminId;

    await village.save();

    return village.populate([
      {
        path: "state",
      },
      {
        path: "coverImage",
      },
    ]);
  };

/*
=====================================
Archive Village
=====================================
*/

export const deleteVillage =
  async (
    id,
    adminId
  ) => {
    const village =
      await Village.findById(id);

    if (!village) {
      throw new ApiError(
        404,
        "Village not found."
      );
    }

    village.status = "ARCHIVED";
    village.isPublished = false;
    village.isActive = false;
    village.updatedBy = adminId;

    await village.save();

    return village;
  };


  /*
=====================================
Get Published Villages By State
=====================================
*/

export const getVillagesByState = async (
  stateSlug
) => {
  const state = await State.findOne({
    slug: stateSlug,
  })
    .select("name slug")
    .lean();

  if (!state) {
    return [];
  }

  const villages = await Village.find({
    state: state._id,
    isPublished: true,
    status: "ACTIVE",
    isActive: true,
  })
    .populate({
      path: "state",
      select: "name slug",
    })
    .select(
      "name slug coverImage district state"
    )
    .sort({
      "name.en": 1,
    })
    .lean();

  return villages;
};
