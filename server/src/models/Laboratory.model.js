import mongoose from "mongoose";

const laboratoryMemberSchema = new mongoose.Schema({
  photo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Media",
    default: null,
  },
  name: { type: String, default: "", trim: true },
  designation: { type: String, default: "", trim: true },
  email: { type: String, default: "", trim: true },
  phone: { type: String, default: "", trim: true },
});

const laboratorySchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
      },

      type: {
        type: String,
        enum: [
          "NODAL",
          "PARTICIPATING",
        ],
        required: true,
      },

      heroImage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Media",
      },

      directorName: {
        type: String,
        default: "",
      },

      overview: {
        type: String,
        default: "",
      },

      researchAreas: [
        String,
      ],

      contributions: [
        String,
      ],

      address: {
        type: String,
        default: "",
      },

      phone: {
        type: String,
        default: "",
      },

      email: {
        type: String,
        default: "",
      },

      website: {
        type: String,
        default: "",
      },

      members: {
        type: [laboratoryMemberSchema],
        default: [],
      },

      isPublished: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Laboratory",
  laboratorySchema
);
