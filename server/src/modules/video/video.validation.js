import { z } from "zod";

const optionalUrl =
  z.string().url().optional()
    .or(z.literal(""));

const optionalMediaId =
  z.string().nullable().optional();

export const createVideoSchema =
  z.object({
    body: z
      .object({
        title: z
          .string()
          .min(3),

        media:
          optionalMediaId,

        youtubeUrl:
          optionalUrl,

        thumbnailUrl:
          optionalUrl,

        description:
          z.string().optional(),

        displayOrder:
          z.coerce.number().optional(),

        isActive:
          z.boolean().optional(),
      })
      .superRefine(
        (data, context) => {
          if (
            !data.media &&
            !data.youtubeUrl
          ) {
            context.addIssue({
              code:
                z.ZodIssueCode.custom,
              path: ["media"],
              message:
                "Select an uploaded video or enter an external video URL",
            });
          }
        }
      ),
  });

export const updateVideoSchema =
  z.object({
    body: z.object({
      title:
        z.string().min(3).optional(),

      media:
        optionalMediaId,

      youtubeUrl:
        optionalUrl,

      thumbnailUrl:
        optionalUrl,

      description:
        z.string().optional(),

      displayOrder:
        z.coerce.number().optional(),

      isActive:
        z.boolean().optional(),
    }),
  });