import mongoose from "mongoose";

const pageSchema =
  new mongoose.Schema(
    {
      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      pageType: {
        type: String,
        enum: [
          "HOME",
          "ABOUT",
          "CSIR_LABS",
          "SMART_VILLAGE",
          "NEWS_UPDATES",
          "SUCCESS_STORIES",
          "CONTACT",
          "CUSTOM",
          "NODAL_LAB",
          "PARTICIPATING_LABS",
          "MISSION_OBJECTIVES",
          "DG_DESK",
          "DIRECTOR_DESK",
        ],
        required: true,
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

      seoTitle: {
        type: String,
        trim: true,
        maxlength: 200,
      },

      seoDescription: {
        type: String,
        trim: true,
        maxlength: 500,
      },

      isVisible: {
        type: Boolean,
        default: true,
      },

      createdBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Admin",
      },

      updatedBy: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Admin",
      },

      publishedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

pageSchema.index({
  slug: 1,
});

pageSchema.index({
  slug: 1,
  status: 1,
  isVisible: 1,
});

const Page = mongoose.model(
  "Page",
  pageSchema
);

export default Page;
