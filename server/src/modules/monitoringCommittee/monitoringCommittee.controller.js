import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { createAuditLog } from "../../services/audit.service.js";
import {
  createMonitoringCommitteeMember,
  deleteMonitoringCommitteeMember,
  getAdminMonitoringCommittee,
  getMonitoringCommitteeSettings,
  getPublicMonitoringCommittee,
  reorderMonitoringCommitteeMembers,
  updateMonitoringCommitteeSettings,
  updateMonitoringCommitteeMember,
} from "./monitoringCommittee.service.js";

const audit = (req, action, resourceId = null) =>
  createAuditLog({
    actor: req.admin._id,
    action,
    resource: "MonitoringCommitteeMember",
    resourceId,
    ipAddress: req.ip,
  });

export const getPublic = asyncHandler(async (_req, res) => {
  const members = await getPublicMonitoringCommittee();

  return res.json(
    new ApiResponse(
      200,
      members,
      "Monitoring Committee fetched successfully."
    )
  );
});

export const getSettings = asyncHandler(async (_req, res) => {
  const settings = await getMonitoringCommitteeSettings();

  return res.json(
    new ApiResponse(
      200,
      settings,
      "Monitoring Committee header fetched successfully."
    )
  );
});

export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await updateMonitoringCommitteeSettings(
    req.body.subtitle,
    req.admin._id
  );

  await audit(
    req,
    "UPDATE_MONITORING_COMMITTEE_SETTINGS",
    settings._id
  );

  return res.json(
    new ApiResponse(
      200,
      { subtitle: settings.subtitle },
      "Monitoring Committee header updated successfully."
    )
  );
});

export const getAll = asyncHandler(async (_req, res) => {
  const members = await getAdminMonitoringCommittee();

  return res.json(
    new ApiResponse(
      200,
      members,
      "Monitoring Committee fetched successfully."
    )
  );
});

export const create = asyncHandler(async (req, res) => {
  const member = await createMonitoringCommitteeMember(
    req.body,
    req.admin._id
  );

  await audit(req, "CREATE_MONITORING_COMMITTEE_MEMBER", member._id);

  return res.status(201).json(
    new ApiResponse(
      201,
      member,
      "Monitoring Committee member added successfully."
    )
  );
});

export const update = asyncHandler(async (req, res) => {
  const member = await updateMonitoringCommitteeMember(
    req.params.id,
    req.body,
    req.admin._id
  );

  await audit(req, "UPDATE_MONITORING_COMMITTEE_MEMBER", member._id);

  return res.json(
    new ApiResponse(
      200,
      member,
      "Monitoring Committee member updated successfully."
    )
  );
});

export const remove = asyncHandler(async (req, res) => {
  await deleteMonitoringCommitteeMember(req.params.id);
  await audit(req, "DELETE_MONITORING_COMMITTEE_MEMBER", req.params.id);

  return res.json(
    new ApiResponse(
      200,
      null,
      "Monitoring Committee member deleted successfully."
    )
  );
});

export const reorder = asyncHandler(async (req, res) => {
  const members = await reorderMonitoringCommitteeMembers({
    ...req.body,
    adminId: req.admin._id,
  });

  await audit(req, "REORDER_MONITORING_COMMITTEE_MEMBERS");

  return res.json(
    new ApiResponse(
      200,
      members,
      "Monitoring Committee order updated successfully."
    )
  );
});
