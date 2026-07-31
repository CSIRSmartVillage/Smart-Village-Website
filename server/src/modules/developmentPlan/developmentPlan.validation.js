import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId");

const statusEnum = z.enum([
  "PLANNED",
  "IN_PROGRESS",
  "DEPLOYED",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
]);

const mediaSchema = z.object({
  url: z.string().trim().url(),
  publicId: z.string().trim().min(1),
  alt: z.string().trim().optional(),
});

const technologySchema = z.object({
  labName: z
    .string()
    .trim()
    .min(1, "Lab name is required.")
    .max(150),

  technologyName: z
    .string()
    .trim()
    .min(1, "Technology name is required.")
    .max(200),

  description: z
    .string()
    .trim()
    .optional(),

  image: mediaSchema.optional(),

  progress: z
    .coerce
    .number()
    .min(0)
    .max(100)
    .optional(),

  showProgress: z
    .boolean()
    .optional(),

  status: statusEnum.optional(),

  order: z
    .coerce
    .number()
    .optional(),
});

const sectorSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Sector title is required.")
    .max(200),

  description: z
    .string()
    .trim()
    .optional(),

  order: z
    .coerce
    .number()
    .optional(),

  technologies: z
    .array(technologySchema)
    .optional(),
});

/*
=====================================================
Create Development Plan
=====================================================
*/

export const createDevelopmentPlanSchema = z.object({
  body: z.object({
    village: objectId,

    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters.")
      .max(200, "Title cannot exceed 200 characters."),

    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters."),

    sectors: z
      .array(sectorSchema)
      .optional(),

    isPublished: z
      .boolean()
      .optional(),
  }),
});

/*
=====================================================
Update Development Plan
=====================================================
*/

export const updateDevelopmentPlanSchema =
  z.object({
    params: z.object({
      id: objectId,
    }),

    body:
      createDevelopmentPlanSchema.shape.body.partial(),
  });

/*
=====================================================
Get Development Plan By ID
=====================================================
*/

export const developmentPlanIdSchema =
  z.object({
    params: z.object({
      id: objectId,
    }),
  });

/*
=====================================================
Get Development Plans By Village
=====================================================
*/

export const villageSlugSchema =
  z.object({
    params: z.object({
      slug: z.string().trim(),
    }),
  });

export const sectorParamsSchema = z.object({
  params: z.object({
    id: objectId,
    sectorId: objectId,
  }),
});

export const technologyParamsSchema = z.object({
  params: z.object({
    id: objectId,
    sectorId: objectId,
    technologyId: objectId,
  }),
});

export const createSectorSchema = z.object({
  params: z.object({
    id: objectId,
  }),

  body: sectorSchema.omit({
    technologies: true,
  }),
});

export const updateSectorSchema = z.object({
  params: z.object({
    id: objectId,
    sectorId: objectId,
  }),

  body: sectorSchema
    .omit({
      technologies: true,
    })
    .partial(),
});

export const createTechnologySchema = z.object({
  params: z.object({
    id: objectId,
    sectorId: objectId,
  }),

  body: technologySchema,
});

export const updateTechnologySchema = z.object({
  params: z.object({
    id: objectId,
    sectorId: objectId,
    technologyId: objectId,
  }),

  body: technologySchema.partial(),
});
