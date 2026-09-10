import { z } from "zod";

import {
  MONITORING_COMMITTEE_ROLES,
} from "./MonitoringCommitteeMember.model.js";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).optional();

const personFields = {
  photo: objectId.nullable().optional(),
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200),
  designation: optionalText(300),
  phone: optionalText(50),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254)
    .optional()
    .or(z.literal("")),
  role: z.enum(MONITORING_COMMITTEE_ROLES),
  displayOrder: z.coerce.number().int().min(0).optional(),
};

export const createMonitoringCommitteeMemberSchema = z.object({
  body: z.object(personFields),
});

export const updateMonitoringCommitteeMemberSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object(personFields).partial(),
});

export const monitoringCommitteeMemberIdSchema = z.object({
  params: z.object({ id: objectId }),
});

export const updateMonitoringCommitteeSettingsSchema = z.object({
  body: z.object({
    subtitle: z
      .string()
      .trim()
      .max(500, "Subtitle cannot exceed 500 characters"),
  }),
});

export const reorderMonitoringCommitteeMembersSchema = z.object({
  body: z
    .object({
      role: z.enum(MONITORING_COMMITTEE_ROLES),
      orderedIds: z.array(objectId).min(1).max(1000),
    })
    .refine(
      ({ orderedIds }) =>
        new Set(orderedIds).size === orderedIds.length,
      {
        message: "Member IDs must be unique",
        path: ["orderedIds"],
      }
    ),
});
