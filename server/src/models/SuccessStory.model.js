import mongoose from "mongoose";

const successStorySchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },

      village: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "SuccessStoryVillage",
        required: true,
      },

      summary: {
        type: String,
        default: "",
      },

      story: {
        type: String,
        default: "",
      },

      impact: {
        type: String,
        default: "",
      },

      beneficiaries: {
        type: Number,
        default: 0,
      },

      featuredImage: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Media",
        default: null,
      },

      galleryImages: [
        {
          type:
            mongoose.Schema.Types.ObjectId,
          ref: "Media",
        },
      ],

      videoUrl: {
        type: String,
        default: "",
        trim: true,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

      status: {
        type: String,
        enum: [
          "DRAFT",
          "PUBLISHED",
          "ARCHIVED",
        ],
        default: "DRAFT",
      },

      publishedAt: {
        type: Date,
        default: null,
      },

      createdBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
      },

      updatedBy: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        default: null,
      },

      website: {
  type: String,
  trim: true,
},

footerQuickLinks: [
  {
    label: String,
    url: String,
  },
],
    },
    {
      timestamps: true,
    }
  );

successStorySchema.index({
  status: 1,
  createdAt: -1,
});

successStorySchema.index({
  village: 1,
  status: 1,
  createdAt: -1,
});

const SuccessStory =
  mongoose.model(
    "SuccessStory",
    successStorySchema
  );

export default SuccessStory;
