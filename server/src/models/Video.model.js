import mongoose from "mongoose";

const videoSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      media: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null,
      },

      videoUrl: {
        type: String,
        default: "",
        trim: true,
      },

      youtubeUrl: {
        type: String,
        default: "",
        trim: true,
      },

      description: {
        type: String,
        default: "",
      },

      thumbnailUrl: {
        type: String,
        default: "",
      },

      displayOrder: {
        type: Number,
        default: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Video",
  videoSchema
);