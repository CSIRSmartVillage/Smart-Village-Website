import mongoose from "mongoose";

import MediaSchema from "../../shared/Media.schema.js";

export const SUPPORTER_TYPES = ["NGO", "DONOR"];

const supporterSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: SUPPORTER_TYPES,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    link: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2048,
    },

    logo: {
      type: MediaSchema,
      required: true,
    },

    about: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
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

supporterSchema.index({
  type: 1,
  isDeleted: 1,
  createdAt: -1,
});

supporterSchema.index({
  name: "text",
  about: "text",
});

const Supporter = mongoose.model(
  "Supporter",
  supporterSchema
);

export default Supporter;