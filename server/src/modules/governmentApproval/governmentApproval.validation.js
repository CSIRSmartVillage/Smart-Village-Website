import { z } from "zod";

const objectId = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

const optionalText = (maxLength) =>
  z.string().trim().max(maxLength).optional();

const formBoolean = z.preprocess(
  (value) => {
    if (value === true || value === "true") return true;
    if (value === false || value === "false") return false;
    return value;
  },
  z.boolean()
);

export const createGovernmentApprovalSchema = z.object({
  body: z.object({
    village: objectId,
    title: optionalText(200),
    description: optionalText(2000),
    showOnWebsite: formBoolean.optional(),
  }),
});

export const updateGovernmentApprovalSchema = z.object({
  params: z.object({
    id: objectId,
  }),
  body: z.object({
    title: optionalText(200),
    description: optionalText(2000),
    showOnWebsite: formBoolean.optional(),
  }),
});

export const governmentApprovalIdSchema = z.object({
  params: z.object({
    id: objectId,
  }),
});

export const governmentApprovalVillageSchema = z.object({
  params: z.object({
    villageSlug: z.string().trim().min(1).max(150),
  }),
});

export const governmentApprovalQuerySchema = z.object({
  query: z.object({
    village: objectId.optional(),
    search: z.string().trim().max(200).optional(),
    showOnWebsite: z.enum(["true", "false"]).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});
