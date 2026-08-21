import { z } from "zod";

export const createSuccessStorySchema =
  z.object({
    body: z.object({
      title:
        z.string().nullable().optional(),

      village:
        z.string().nullable().optional(),

      featuredImage:
        z.string().nullable().optional(),

      galleryImages:
        z.array(z.string()).nullable().optional(),

      videoUrl:
        z.string().nullable().optional(),

      summary:
        z.string().nullable().optional(),

      story:
        z.string().nullable().optional(),

      impact:
        z.string().nullable().optional(),

      beneficiaries:
        z.union([
          z.number(),
          z.literal(""),
        ]).nullable().optional(),

      isFeatured:
        z.boolean().nullable().optional(),

      status:
        z.union([
          z.enum([
            "DRAFT",
            "PUBLISHED",
            "ARCHIVED",
          ]),
          z.literal(""),
        ])
          .nullable().optional(),
    }),
  });

export const updateSuccessStorySchema =
  z.object({
    body: z.object({
      title:
        z.string().nullable().optional(),

      village:
        z.string().nullable().optional(),

      featuredImage:
        z.string().nullable().optional(),

      galleryImages:
        z.array(z.string()).nullable().optional(),

      videoUrl:
        z.string().nullable().optional(),

      summary:
        z.string().nullable().optional(),

      story:
        z.string().nullable().optional(),

      impact:
        z.string().nullable().optional(),

      beneficiaries:
        z.union([
          z.number(),
          z.literal(""),
        ]).nullable().optional(),

      isFeatured:
        z.boolean().nullable().optional(),

      status:
        z.union([
          z.enum([
            "DRAFT",
            "PUBLISHED",
            "ARCHIVED",
          ]),
          z.literal(""),
        ])
          .nullable().optional(),
    }),
  });