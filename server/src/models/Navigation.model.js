import mongoose from "mongoose";

const navigationSchema =
  new mongoose.Schema(
    {
      label: {
        type: String,
        required: true,
        trim: true,
      },

      path: {
        type: String,
        required: true,
        trim: true,
      },
      
      menuType: {
  type: String,
  enum: [
    "INTERNAL",
    "EXTERNAL",
  ],
  default: "INTERNAL",
},

      parentId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Navigation",
        default: null,
      },

      order: {
        type: Number,
        required: true,
      },

      isVisible: {
        type: Boolean,
        default: true,
      },

      openInNewTab: {
        type: Boolean,
        default: false,
      },

      pageId: {
        type:
          mongoose.Schema.Types
            .ObjectId,
        ref: "Page",
        default: null,
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
    },
    {
      timestamps: true,
    }
  );

navigationSchema.index({
  isVisible: 1,
  order: 1,
});

const Navigation =
  mongoose.model(
    "Navigation",
    navigationSchema
  );

export default Navigation;
