import mongoose from "mongoose";
import slugify from "slugify";

import MediaSchema from "../../shared/Media.schema.js";

export const SHG_STATUS = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
];

const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    designation: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 150,
    },

    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
  },
  {
    _id: false,
  }
);

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    role: {
      type: String,
      trim: true,
      default: "",
      maxlength: 150,
    },

    mobileNumber: {
      type: String,
      trim: true,
      default: "",
      maxlength: 20,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
      maxlength: 150,
    },

    address: {
      type: String,
      trim: true,
      default: "",
      maxlength: 500,
    },
  },
  {
    _id: true,
  }
);

const selfHelpGroupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    featuredImage: {
      type: MediaSchema,
      default: null,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    leader: {
      type: leaderSchema,
      required: true,
    },

    members: {
      type: [memberSchema],
      default: [],
    },

    status: {
      type: String,
      enum: SHG_STATUS,
      default: "PUBLISHED",
      index: true,
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

selfHelpGroupSchema.pre("validate", function () {
  if (!this.slug && this.groupName) {
    this.slug = slugify(this.groupName, {
      lower: true,
      strict: true,
      trim: true,
    });
  }

});

selfHelpGroupSchema.index({
  groupName: "text",
  description: "text",
  "leader.name": "text",
});

selfHelpGroupSchema.index({
  village: 1,
  isPublished: 1,
  isDeleted: 1,
  displayOrder: 1,
});

selfHelpGroupSchema.index({
  isPublished: 1,
  isDeleted: 1,
  displayOrder: 1,
});

selfHelpGroupSchema.index({
  slug: 1,
  isPublished: 1,
  isDeleted: 1,
});

selfHelpGroupSchema.index({
  status: 1,
  isDeleted: 1,
  createdAt: -1,
});

const SelfHelpGroup = mongoose.model(
  "SelfHelpGroup",
  selfHelpGroupSchema
);

export default SelfHelpGroup;
