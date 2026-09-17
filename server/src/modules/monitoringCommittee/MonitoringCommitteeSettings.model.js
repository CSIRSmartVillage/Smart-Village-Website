import mongoose from "mongoose";

export const DEFAULT_MONITORING_COMMITTEE_SUBTITLE =
  "Contact information for monitoring committee of the SMART Village Mission.";

export const DEFAULT_COMMITTEE_HEADINGS = {
  chairmanHeading: "Chairman",
  membersHeading: "Committee Member",
  conveyersHeading: "Conveyers",
  headHeading: "Head",
  otherHeading: "Other Member",
};

const monitoringCommitteeSettingsSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      default: "monitoring-committee",
      unique: true,
      immutable: true,
    },
    subtitle: {
      type: String,
      trim: true,
      maxlength: 500,
      default: DEFAULT_MONITORING_COMMITTEE_SUBTITLE,
    },
    rows: {
      type: [{ _id: false, id: { type: String, required: true }, title: { type: String, required: true, trim: true, maxlength: 100 } }],
      default: undefined,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    ...Object.fromEntries(
      Object.entries(DEFAULT_COMMITTEE_HEADINGS).map(([key, value]) => [
        key,
        { type: String, trim: true, required: true, maxlength: 100, default: value },
      ])
    ),
  },
  {
    timestamps: true,
  }
);

const MonitoringCommitteeSettings = mongoose.model(
  "MonitoringCommitteeSettings",
  monitoringCommitteeSettingsSchema
);

export default MonitoringCommitteeSettings;
