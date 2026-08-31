import asyncHandler from "../../utils/asyncHandler.js";
import ApiResponse from "../../utils/ApiResponse.js";
import { createAuditLog } from "../../services/audit.service.js";

import {
  createSupporter,
  createSupporterLogo,
  deleteSupporter,
  deleteSupporterLogo,
  getAdminSupporters,
  getAdminSupporterLogos,
  getPublicSupporters,
  getPublicSupporterLogos,
  getSupporterById,
  updateSupporter,
} from "./supporter.service.js";

const logSupporterAction = async ({
  req,
  action,
  resourceId,
}) => {
  await createAuditLog({
    actor: req.admin._id,
    action,
    resource: "Supporter",
    resourceId,
    ipAddress: req.ip,
  });
};

export const getPublicList = asyncHandler(async (req, res) => {
  const supporters = await getPublicSupporters(req.query);

  return res.json(
    new ApiResponse(
      200,
      supporters,
      "Supporters fetched successfully."
    )
  );
});

export const getAll = asyncHandler(async (req, res) => {
  const supporters = await getAdminSupporters(req.query);

  return res.json(
    new ApiResponse(
      200,
      supporters,
      "Supporters fetched successfully."
    )
  );
});

export const getById = asyncHandler(async (req, res) => {
  const supporter = await getSupporterById(req.params.id);

  return res.json(
    new ApiResponse(
      200,
      supporter,
      "Supporter fetched successfully."
    )
  );
});

export const create = asyncHandler(async (req, res) => {
  const supporter = await createSupporter(
    req.body,
    req.admin._id
  );

  await logSupporterAction({
    req,
    action: "CREATE_SUPPORTER",
    resourceId: supporter._id.toString(),
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      supporter,
      "Supporter created successfully."
    )
  );
});

export const update = asyncHandler(async (req, res) => {
  const supporter = await updateSupporter(
    req.params.id,
    req.body,
    req.admin._id
  );

  await logSupporterAction({
    req,
    action: "UPDATE_SUPPORTER",
    resourceId: supporter._id.toString(),
  });

  return res.json(
    new ApiResponse(
      200,
      supporter,
      "Supporter updated successfully."
    )
  );
});

export const remove = asyncHandler(async (req, res) => {
  await deleteSupporter(req.params.id, req.admin._id);

  await logSupporterAction({
    req,
    action: "DELETE_SUPPORTER",
    resourceId: req.params.id,
  });

  return res.json(
    new ApiResponse(
      200,
      null,
      "Supporter deleted successfully."
    )
  );
});

export const getPublicLogos =
  asyncHandler(async (_req, res) => {
    const logos =
      await getPublicSupporterLogos();

    return res.json(
      new ApiResponse(
        200,
        logos,
        "Supporter logos fetched successfully."
      )
    );
  });

export const getAllLogos =
  asyncHandler(async (_req, res) => {
    const logos =
      await getAdminSupporterLogos();

    return res.json(
      new ApiResponse(
        200,
        logos,
        "Supporter logos fetched successfully."
      )
    );
  });

export const createLogo =
  asyncHandler(async (req, res) => {
    const supporterLogo =
      await createSupporterLogo(
        req.body,
        req.admin._id
      );

    await createAuditLog({
      actor: req.admin._id,
      action: "CREATE_SUPPORTER_LOGO",
      resource: "SupporterLogo",
      resourceId:
        supporterLogo._id.toString(),
      ipAddress: req.ip,
    });

    return res.status(201).json(
      new ApiResponse(
        201,
        supporterLogo,
        "Supporter logo added successfully."
      )
    );
  });

export const removeLogo =
  asyncHandler(async (req, res) => {
    await deleteSupporterLogo(
      req.params.id,
      req.admin._id
    );

    await createAuditLog({
      actor: req.admin._id,
      action: "DELETE_SUPPORTER_LOGO",
      resource: "SupporterLogo",
      resourceId: req.params.id,
      ipAddress: req.ip,
    });

    return res.json(
      new ApiResponse(
        200,
        null,
        "Supporter logo deleted successfully."
      )
    );
  });
