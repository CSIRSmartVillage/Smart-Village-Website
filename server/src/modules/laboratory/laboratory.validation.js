import Joi from "joi";

export const createLaboratorySchema =
  Joi.object({
    name: Joi.string()
      .required(),

    slug: Joi.string()
      .required(),

    type: Joi.string()
      .valid(
        "NODAL",
        "PARTICIPATING"
      )
      .required(),

    directorName:
      Joi.string()
        .allow(""),

    directorPhoto:
      Joi.string()
        .allow(
          "",
          null
        ),

    overview:
      Joi.string()
        .allow(""),

    heroImage:
      Joi.string()
        .allow(
          "",
          null
        ),

    researchAreas:
      Joi.array()
        .items(
          Joi.string()
        ),

    contributions:
      Joi.array()
        .items(
          Joi.string()
        ),

    address:
      Joi.string()
        .allow(""),

    phone:
      Joi.string()
        .allow(""),

    email:
      Joi.string()
        .email()
        .allow(""),

    website:
      Joi.string()
        .allow(""),

    isPublished:
      Joi.boolean(),
  });
