import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  originalName: { type: String, required: true, trim: true },
  filename: { type: String, required: true, trim: true },
  publicId: { type: String, required: true, trim: true },
  mimeType: { type: String, required: true, trim: true },
  extension: { type: String, required: true, trim: true, lowercase: true },
  size: { type: Number, min: 0, default: 0 },
  uploadedAt: { type: Date, default: Date.now },
});

const trainingManualSchema = new mongoose.Schema({
  technologyName: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: "" },
  files: { type: [fileSchema], default: [] },
  published: { type: Boolean, default: true, index: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
}, { timestamps: true });

trainingManualSchema.index({ published: 1, createdAt: -1 });

export default mongoose.model("TrainingManual", trainingManualSchema);
