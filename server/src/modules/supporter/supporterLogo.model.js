import mongoose from "mongoose";

import MediaSchema
  from "../../shared/Media.schema.js";

const supporterLogoSchema =
  new mongoose.Schema(
    {
      logo: {
        type: MediaSchema,
        required: true,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
      },

      updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
      },

      isDeleted: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

supporterLogoSchema.index({
  isDeleted: 1,
  createdAt: 1,
});

const SupporterLogo = mongoose.model(
  "SupporterLogo",
  supporterLogoSchema
);

export default SupporterLogo;
