import { z } from "zod";

export const createVideoSchema =
  z.object({
    body: z.object({
      title: z
        .string()
        .min(3),

      youtubeUrl: z
        .string()
        .url(),

      thumbnailUrl:
        z.string().url().optional().or(z.literal("")),

      description:
        z.string().optional(),

      displayOrder:
        z.number().optional(),

      isActive:
        z.boolean().optional(),
    }),
  });

export const updateVideoSchema =
  z.object({
    body: z.object({
      title:
        z.string().optional(),

      youtubeUrl:
        z.string().url().optional(),

      thumbnailUrl:
        z.string().url().optional().or(z.literal("")),

      description:
        z.string().optional(),

      displayOrder:
        z.number().optional(),

      isActive:
        z.boolean().optional(),
    }),
  });
