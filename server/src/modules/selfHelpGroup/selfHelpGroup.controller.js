import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { createAuditLog } from "../../services/audit.service.js";

import {
  createSelfHelpGroup,
  updateSelfHelpGroup,
  deleteSelfHelpGroup,
  getSelfHelpGroupById,
  getSelfHelpGroupBySlug,
  getSelfHelpGroupsByVillage,
  getAllSelfHelpGroups,
  toggleSelfHelpGroupPublish,
} from "./selfHelpGroup.service.js";

const logShgAction = async ({
  req,
  action,
  resourceId,
}) => {
  await createAuditLog({
    actor: req.admin._id,
    action,
    resource: "SelfHelpGroup",
    resourceId,
    ipAddress: req.ip,
  });
};

export const create = asyncHandler(
  async (req, res) => {
    const shg = await createSelfHelpGroup(
      req.body,
      req.admin._id
    );

    await logShgAction({
      req,
      action: "CREATE_SHG",
      resourceId: shg._id.toString(),
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        shg,
        "Self Help Group created successfully."
      )
    );
  }
);

export const update = asyncHandler(
  async (req, res) => {
    const shg = await updateSelfHelpGroup(
      req.params.id,
      req.body,
      req.admin._id
    );

    await logShgAction({
      req,
      action: "UPDATE_SHG",
      resourceId: shg._id.toString(),
    });

    return res.json(
      new ApiResponse(
        200,
        shg,
        "Self Help Group updated successfully."
      )
    );
  }
);

export const remove = asyncHandler(
  async (req, res) => {
    await deleteSelfHelpGroup(
      req.params.id,
      req.admin._id
    );

    await logShgAction({
      req,
      action: "DELETE_SHG",
      resourceId: req.params.id,
    });

    return res.json(
      new ApiResponse(
        200,
        null,
        "Self Help Group deleted successfully."
      )
    );
  }
);

export const getById = asyncHandler(
  async (req, res) => {
    const shg = await getSelfHelpGroupById(
      req.params.id
    );

    return res.json(
      new ApiResponse(
        200,
        shg,
        "Self Help Group fetched successfully."
      )
    );
  }
);

export const getBySlug = asyncHandler(
  async (req, res) => {
    const shg = await getSelfHelpGroupBySlug(
      req.params.slug
    );

    return res.json(
      new ApiResponse(
        200,
        shg,
        "Self Help Group fetched successfully."
      )
    );
  }
);

export const getByVillage = asyncHandler(
  async (req, res) => {
    const groups = await getSelfHelpGroupsByVillage(
      req.params.villageSlug,
      req.query
    );

    return res.json(
      new ApiResponse(
        200,
        groups,
        "Self Help Groups fetched successfully."
      )
    );
  }
);

export const getPublicList = asyncHandler(
  async (req, res) => {
    const groups = await getAllSelfHelpGroups({
      ...req.query,
      published: "true",
      status: "PUBLISHED",
    });

    return res.json(
      new ApiResponse(
        200,
        groups,
        "Self Help Groups fetched successfully."
      )
    );
  }
);

export const getAll = asyncHandler(
  async (req, res) => {
    const groups =
      await getAllSelfHelpGroups(req.query);

    return res.json(
      new ApiResponse(
        200,
        groups,
        "Self Help Groups fetched successfully."
      )
    );
  }
);

export const togglePublish = asyncHandler(
  async (req, res) => {
    const shg = await toggleSelfHelpGroupPublish(
      req.params.id,
      req.admin._id
    );

    await logShgAction({
      req,
      action: "TOGGLE_SHG_PUBLISH",
      resourceId: shg._id.toString(),
    });

    return res.json(
      new ApiResponse(
        200,
        shg,
        "Self Help Group publish status updated successfully."
      )
    );
  }
);
