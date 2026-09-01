import mongoose from "mongoose";

const approvalFileSchema = new mongoose.Schema(
  {
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      trim: true,
    },
    mimeType: {
      type: String,
      required: true,
      trim: true,
    },
    extension: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    size: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const governmentApprovalSchema = new mongoose.Schema(
  {
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
      index: true,
    },
    file: {
      type: approvalFileSchema,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    showOnWebsite: {
      type: Boolean,
      default: false,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

governmentApprovalSchema.index({
  village: 1,
  showOnWebsite: 1,
  createdAt: -1,
});

const GovernmentApproval = mongoose.model(
  "GovernmentApproval",
  governmentApprovalSchema
);

export default GovernmentApproval;
