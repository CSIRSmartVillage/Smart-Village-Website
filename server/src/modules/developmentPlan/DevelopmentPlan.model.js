import mongoose from "mongoose";
import MediaSchema from "../../shared/Media.schema.js";

export const TECHNOLOGY_STATUS = [
  "PLANNED",
  "IN_PROGRESS",
  "DEPLOYED",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const technologySchema = new mongoose.Schema(
  {
    labName: {
      type: String,
      required: true,
      trim: true,
    },

    technologyName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    image: MediaSchema,

    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    showProgress: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: TECHNOLOGY_STATUS,
      default: "PLANNED",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const sectorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
    },

    technologies: {
      type: [technologySchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const developmentPlanSchema = new mongoose.Schema(
  {
    /*
    =====================================================
    RELATION
    =====================================================
    */

    village: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Village",
      required: true,
      index: true,
    },

    /*
    =====================================================
    BASIC INFORMATION
    =====================================================
    */

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    sectors: {
      type: [sectorSchema],
      default: [],
    },

    /*
    =====================================================
    PUBLICATION
    =====================================================
    */

    isPublished: {
      type: Boolean,
      default: true,
    },

    /*
    =====================================================
    AUDIT
    =====================================================
    */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

const calculateSectorProgress = (sector) => {
  const technologies = (sector.technologies || []).filter(
    (technology) => technology.showProgress !== false
  );

  if (!technologies.length) {
    return 0;
  }

  const total = technologies.reduce(
    (sum, technology) =>
      sum + Number(technology.progress || 0),
    0
  );

  return Math.round(total / technologies.length);
};

export const withCalculatedSectorProgress = (plan) => {
  if (!plan) return plan;

  const plainPlan =
    typeof plan.toObject === "function"
      ? plan.toObject()
      : plan;

  return {
    ...plainPlan,
    sectors: (plainPlan.sectors || [])
      .map((sector) => ({
        ...sector,
        progress: calculateSectorProgress(sector),
        showProgress: (sector.technologies || []).some(
          (technology) => technology.showProgress !== false
        ),
        technologies: [
          ...(sector.technologies || []),
        ].sort((a, b) => (a.order || 0) - (b.order || 0)),
      }))
      .sort((a, b) => (a.order || 0) - (b.order || 0)),
  };
};

developmentPlanSchema.index({
  village: 1,
  isPublished: 1,
  createdAt: -1,
});

developmentPlanSchema.index({
  isPublished: 1,
  createdAt: -1,
});

const DevelopmentPlan = mongoose.model(
  "DevelopmentPlan",
  developmentPlanSchema
);

export default DevelopmentPlan;
