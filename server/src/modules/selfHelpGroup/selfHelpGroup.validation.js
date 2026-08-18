import { z } from "zod";

import {
  SHG_STATUS,
} from "./SelfHelpGroup.model.js";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const mediaSchema = z.object({
  url: z.string().trim().url(),
  publicId: z.string().trim().min(1),
  alt: z.string().trim().optional(),
});

const leaderSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Leader name is required")
    .max(150),

  designation: z
    .string()
    .trim()
    .max(150)
    .optional(),

  mobileNumber: z
    .string()
    .trim()
    .min(6)
    .max(20),

  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .min(3)
    .max(500),
});

const memberSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(150),

  role: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .optional()
    .or(z.literal("")),

  mobileNumber: z
    .string()
    .trim()
    .min(6)
    .max(20)
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal("")),

  address: z
    .string()
    .trim()
    .max(500)
    .optional(),
});

const shgBodySchema = z.object({
  groupName: z
    .string()
    .trim()
    .min(3, "Group name must be at least 3 characters")
    .max(200),

  village: objectId,

  description: z
    .string()
    .trim()
    .min(3),

  featuredImage: mediaSchema
    .nullable()
    .optional(),

  isPublished: z
    .boolean()
    .optional(),

  displayOrder: z
    .coerce
    .number()
    .int()
    .optional(),

  leader: leaderSchema,

  members: z
    .array(memberSchema)
    .optional(),

  slug: z
    .string()
    .trim()
    .min(1)
    .optional(),

  status: z
    .enum(SHG_STATUS)
    .optional(),
});

export const createSelfHelpGroupSchema = z.object({
  body: shgBodySchema,
});

export const updateSelfHelpGroupSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: shgBodySchema.partial(),
});

export const selfHelpGroupIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const selfHelpGroupSlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1),
  }),
});

export const villageSlugSchema = z.object({
  params: z.object({
    villageSlug: z.string().trim().min(1),
  }),
});

export const selfHelpGroupQuerySchema = z.object({
  query: z.object({
    search: z.string().trim().optional(),

    village: objectId.optional(),

    status: z
      .enum(SHG_STATUS)
      .optional(),

    published: z
      .enum(["true", "false"])
      .optional(),

    page: z
      .coerce
      .number()
      .min(1)
      .optional(),

    limit: z
      .coerce
      .number()
      .min(1)
      .max(100)
      .optional(),

    sortBy: z.string().optional(),

    sortOrder: z
      .enum(["asc", "desc"])
      .optional(),
  }),
});
