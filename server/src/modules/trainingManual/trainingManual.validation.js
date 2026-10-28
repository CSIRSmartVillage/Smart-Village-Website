import { z } from "zod";

const objectId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");
const optionalText = (max) => z.string().trim().max(max).optional();
const formBoolean = z.preprocess((value) => value === "true" ? true : value === "false" ? false : value, z.boolean());

export const createTrainingManualSchema = z.object({ body: z.object({
  technologyName: z.string().trim().min(1, "Technology Name is required").max(200),
  description: optionalText(2000),
  published: formBoolean.optional(),
}) });
export const updateTrainingManualSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ technologyName: z.string().trim().min(1).max(200).optional(), description: optionalText(2000), published: formBoolean.optional() }),
});
export const trainingManualIdSchema = z.object({ params: z.object({ id: objectId }) });
export const trainingManualFileSchema = z.object({ params: z.object({ id: objectId, fileId: objectId }) });
