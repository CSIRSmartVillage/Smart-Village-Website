import mongoose from "mongoose";

export const MONITORING_COMMITTEE_ROLES = [
  "CHAIRMAN",
  "MEMBER",
  "CONVENER",
  "HEAD",
];

const monitoringCommitteeMemberSchema = new mongoose.Schema(
  {
    photo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    designation: {
      type: String,
      trim: true,
      maxlength: 300,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 50,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
      default: "",
    },
    role: {
      type: String,
      enum: MONITORING_COMMITTEE_ROLES,
      required: true,
      index: true,
    },
    displayOrder: {
      type: Number,
      min: 0,
      default: 0,
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
  },
  {
    timestamps: true,
  }
);

monitoringCommitteeMemberSchema.index({
  role: 1,
  displayOrder: 1,
  createdAt: 1,
});

const MonitoringCommitteeMember = mongoose.model(
  "MonitoringCommitteeMember",
  monitoringCommitteeMemberSchema
);

export default MonitoringCommitteeMember;
