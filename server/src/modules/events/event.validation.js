import { z } from "zod";

import {
  EVENT_TYPE_VALUES,
  EVENT_STATUS_VALUES,
} from "../../utils/constants/event.constants.js";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

export const createEventSchema = z.object({
  body: z.object({
    village: objectId,

    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(200),

    type: z.enum(EVENT_TYPE_VALUES),

    category: z
      .string()
      .trim()
      .max(100)
      .optional(),

    summary: z
      .string()
      .trim()
      .max(500)
      .optional(),

    description: z
      .string()
      .optional(),

    coverImage: z.any().optional(),

    gallery: z.array(z.any()).optional(),

    documents: z.array(z.any()).optional(),

    eventDate: z.string(),

    endDate: z.string().optional(),

    location: z
      .string()
      .trim()
      .max(200)
      .optional(),

    organizer: z
      .string()
      .trim()
      .max(200)
      .optional(),

    participants: z
      .number()
      .int()
      .min(0)
      .optional(),

    status: z
      .enum(EVENT_STATUS_VALUES)
      .optional(),

    isFeatured: z
      .boolean()
      .optional(),

    showOnVillageInfo: z
      .boolean()
      .optional(),

    highlightOrder: z
      .coerce
      .number()
      .int()
      .optional(),

    published: z
      .boolean()
      .optional(),

    displayOrder: z
      .number()
      .int()
      .optional(),

    seo: z.any().optional(),
  }),
});

export const updateEventSchema = z.object({
  body: createEventSchema.shape.body.partial(),

  params: z.object({
    id: objectId,
  }),
});

export const homePageFeatureSchema = z.object({
  body: z.object({
    featureOnHomePage: z.boolean(),
  }),

  params: z.object({
    id: objectId,
  }),
});

export const eventIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const eventSlugSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1),
  }),
});

export const eventQuerySchema = z.object({
  query: z.object({
    search: z.string().optional(),

    village: objectId.optional(),

    type: z.enum(EVENT_TYPE_VALUES).optional(),

    status: z.enum(EVENT_STATUS_VALUES).optional(),

    featured: z
      .enum(["true", "false"])
      .optional(),

    showOnVillageInfo: z
      .enum(["true", "false"])
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
