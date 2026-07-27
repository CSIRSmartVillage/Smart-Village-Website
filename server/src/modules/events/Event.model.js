import mongoose from "mongoose";
import slugify from "slugify";

import MediaSchema from "../../shared/Media.schema.js";
import GallerySchema from "../../shared/Gallery.schema.js";
import DocumentSchema from "../../shared/Document.schema.js";
import SeoSchema from "../../shared/Seo.schema.js";

import {
  EVENT_TYPES,
  EVENT_STATUS,
  EVENT_TYPE_VALUES,
  EVENT_STATUS_VALUES,
} from "../../utils/constants/event.constants.js";

const EventSchema = new mongoose.Schema(
  {
    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: EVENT_TYPE_VALUES,
      default: EVENT_TYPES.EVENT,
      required: true,
      index: true,
    },

    category: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    summary: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    description: {
      type: String,
      default: "",
    },

    coverImage: MediaSchema,

    gallery: {
      type: [GallerySchema],
      default: [],
    },

    documents: {
      type: [DocumentSchema],
      default: [],
    },

    eventDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    organizer: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    participants: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: EVENT_STATUS_VALUES,
      default: EVENT_STATUS.UPCOMING,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    showOnVillageInfo: {
      type: Boolean,
      default: false,
      index: true,
    },

    highlightOrder: {
      type: Number,
      default: 0,
      index: true,
    },

    published: {
      type: Boolean,
      default: true,
      index: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    seo: {
      type: SeoSchema,
      default: () => ({}),
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

EventSchema.pre("validate", function () {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      trim: true,
    });
  }
});

EventSchema.virtual("isUpcoming").get(function () {
  return this.eventDate > new Date();
});

EventSchema.index({
  village: 1,
  published: 1,
});

EventSchema.index({
  village: 1,
  type: 1,
});

EventSchema.index({
  village: 1,
  eventDate: -1,
});

EventSchema.index({
  village: 1,
  isFeatured: 1,
});

EventSchema.index({
  village: 1,
  showOnVillageInfo: 1,
  highlightOrder: 1,
  eventDate: -1,
});

EventSchema.index({
  village: 1,
  isDeleted: 1,
});

EventSchema.index({
  published: 1,
  isDeleted: 1,
  eventDate: -1,
});

EventSchema.index({
  published: 1,
  isDeleted: 1,
  isFeatured: 1,
  eventDate: -1,
});

EventSchema.index({
  slug: 1,
  published: 1,
  isDeleted: 1,
});

EventSchema.index({
  village: 1,
  published: 1,
  isDeleted: 1,
  eventDate: -1,
});

EventSchema.index({
  isDeleted: 1,
  eventDate: -1,
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
