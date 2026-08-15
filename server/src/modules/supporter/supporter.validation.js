import { z } from "zod";

import { SUPPORTER_TYPES } from "./supporter.model.js";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const logoSchema = z.object({
  url: z.string().trim().url("A valid logo URL is required."),
  publicId: z.string().trim().min(1, "Logo public ID is required."),
  alt: z.string().trim().max(200).optional(),
});

const supporterBodySchema = z.object({
  type: z.enum(SUPPORTER_TYPES),
  name: z
    .string()
    .trim()
    .min(2, "Supporter name must be at least 2 characters.")
    .max(200),
  link: z
    .string()
    .trim()
    .url("Enter a valid website or external link.")
    .max(2048),
  logo: logoSchema,
  about: z
    .string()
    .trim()
    .min(10, "About must be at least 10 characters.")
    .max(3000),
});

export const createSupporterSchema = z.object({
  body: supporterBodySchema,
});

export const updateSupporterSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: supporterBodySchema.partial(),
});

export const supporterIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const supporterQuerySchema = z.object({
  query: z.object({
    type: z.enum(SUPPORTER_TYPES).optional(),
    search: z.string().trim().max(200).optional(),
  }),
});