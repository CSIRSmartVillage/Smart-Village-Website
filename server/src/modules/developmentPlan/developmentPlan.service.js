import DevelopmentPlan, {
  withCalculatedSectorProgress,
} from "./DevelopmentPlan.model.js";
import Village from "../../models/Village.model.js";
import ApiError from "../../utils/ApiError.js";

const findPlanOrThrow = async (id) => {
  const plan = await DevelopmentPlan.findById(id);

  if (!plan) {
    throw new ApiError(
      404,
      "Development Plan not found."
    );
  }

  return plan;
};

const findSectorOrThrow = (plan, sectorId) => {
  const sector = plan.sectors.id(sectorId);

  if (!sector) {
    throw new ApiError(404, "Sector not found.");
  }

  return sector;
};

const findTechnologyOrThrow = (sector, technologyId) => {
  const technology = sector.technologies.id(technologyId);

  if (!technology) {
    throw new ApiError(404, "Technology not found.");
  }

  return technology;
};

/*
=====================================================
Create Development Plan
=====================================================
*/

export const createDevelopmentPlan = async (
  payload,
  adminId
) => {
  const village = await Village.findById(
    payload.village
  );

  if (!village) {
    throw new ApiError(404, "Village not found.");
  }

  const plan =
    await DevelopmentPlan.create({
      ...payload,
      createdBy: adminId,
    });

  return withCalculatedSectorProgress(plan);
};

/*
=====================================================
Update Development Plan
=====================================================
*/

export const updateDevelopmentPlan = async (
  id,
  payload,
  adminId
) => {
  const plan = await findPlanOrThrow(id);

  Object.assign(plan, payload);

  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

/*
=====================================================
Delete Development Plan
=====================================================
*/

export const deleteDevelopmentPlan =
  async (id) => {
    const plan = await findPlanOrThrow(id);

    await plan.deleteOne();

    return true;
  };

/*
=====================================================
Get Development Plan By ID
=====================================================
*/

export const getDevelopmentPlanById =
  async (id) => {
    const plan = await DevelopmentPlan.findById(id)
      .populate(
        "village",
        "name slug district state"
      )
      .lean();

    return withCalculatedSectorProgress(plan);
  };

/*
=====================================================
Get Development Plans By Village
=====================================================
*/

export const getDevelopmentPlansByVillage =
  async (slug) => {
    const village =
      await Village.findOne({
        slug,
      })
        .select("_id")
        .lean();

    if (!village) {
      throw new ApiError(404, "Village not found.");
    }

    const plans = await DevelopmentPlan.find({
      village: village._id,
      isPublished: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    return plans.map(withCalculatedSectorProgress);
  };

/*
=====================================================
Admin List
=====================================================
*/

export const getAllDevelopmentPlans =
  async () => {
    const plans = await DevelopmentPlan.find()
      .populate(
        "village",
        "name slug"
      )
      .sort({
        createdAt: -1,
      });

    return plans.map(withCalculatedSectorProgress);
  };

/*
=====================================================
Publish / Unpublish
=====================================================
*/

export const togglePublishStatus =
  async (id, adminId) => {
    const plan = await findPlanOrThrow(id);

    plan.isPublished =
      !plan.isPublished;

    plan.updatedBy = adminId;

    await plan.save();

    return withCalculatedSectorProgress(plan);
  };

/*
=====================================================
Sector Management
=====================================================
*/

export const createSector = async (
  planId,
  payload,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);

  plan.sectors.push(payload);
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

export const updateSector = async (
  planId,
  sectorId,
  payload,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);
  const sector = findSectorOrThrow(plan, sectorId);

  Object.assign(sector, payload);
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

export const deleteSector = async (
  planId,
  sectorId,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);
  const sector = findSectorOrThrow(plan, sectorId);

  sector.deleteOne();
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

/*
=====================================================
Technology Management
=====================================================
*/

export const createTechnology = async (
  planId,
  sectorId,
  payload,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);
  const sector = findSectorOrThrow(plan, sectorId);

  sector.technologies.push(payload);
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

export const updateTechnology = async (
  planId,
  sectorId,
  technologyId,
  payload,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);
  const sector = findSectorOrThrow(plan, sectorId);
  const technology = findTechnologyOrThrow(
    sector,
    technologyId
  );

  Object.assign(technology, payload);
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};

export const deleteTechnology = async (
  planId,
  sectorId,
  technologyId,
  adminId
) => {
  const plan = await findPlanOrThrow(planId);
  const sector = findSectorOrThrow(plan, sectorId);
  const technology = findTechnologyOrThrow(
    sector,
    technologyId
  );

  technology.deleteOne();
  plan.updatedBy = adminId;

  await plan.save();

  return withCalculatedSectorProgress(plan);
};
