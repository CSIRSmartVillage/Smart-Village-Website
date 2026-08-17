import { z } from "zod";

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters.")
    .max(200, "Title cannot exceed 200 characters."),

  type: z.enum(["EVENT", "ACHIEVEMENT", "VISIT"], {
    error: "Please select an event type.",
  }),

  village: z
    .string()
    .min(1, "Please select a village."),

  eventDate: z
    .string()
    .min(1, "Please select an event date."),

  status: z.enum([
    "UPCOMING",
    "ONGOING",
    "COMPLETED",
  ]),

  category: z.string().optional(),

  organizer: z.string().optional(),

  location: z.string().optional(),

  shortDescription: z
    .string()
    .max(300)
    .optional(),

  description: z.string().optional(),

  isFeatured: z.boolean(),

  showOnVillageInfo: z.boolean(),

  highlightOrder: z
    .coerce
    .number()
    .int()
    .min(0, "Highlight order cannot be negative."),

  published: z.boolean(),

  seoTitle: z.string().optional(),

  seoDescription: z.string().optional(),

  seoKeywords: z.string().optional(),

  featuredImage: z.any().optional(),

  gallery: z.array(z.any()).optional(),
});
