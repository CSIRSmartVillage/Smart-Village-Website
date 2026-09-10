import mongoose from "mongoose";

export const DEFAULT_MONITORING_COMMITTEE_SUBTITLE =
  "Contact information for monitoring committee of the SMART Village Mission.";

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

const MonitoringCommitteeSettings = mongoose.model(
  "MonitoringCommitteeSettings",
  monitoringCommitteeSettingsSchema
);

export default MonitoringCommitteeSettings;
