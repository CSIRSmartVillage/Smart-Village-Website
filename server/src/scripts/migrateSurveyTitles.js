import mongoose from "mongoose";
import { connectDB } from "../config/database.js";
import Survey from "../models/Survey.model.js";

const OBSOLETE_UNIQUE_INDEXES = new Set([
  "state_1_village_1_year_1",
  "village_1_surveyYear_1",
]);

const run = async () => {
  await connectDB();

  const titleResult = await Survey.collection.updateMany(
    {
      $or: [
        { surveyTitle: { $exists: false } },
        { surveyTitle: null },
        { surveyTitle: "" },
      ],
    },
    [
      {
        $set: {
          surveyTitle: {
            $let: {
              vars: { legacyYear: { $ifNull: ["$surveyYear", "$year"] } },
              in: {
                $cond: [
                  { $isNumber: "$$legacyYear" },
                  { $concat: ["Survey ", { $toString: "$$legacyYear" }] },
                  { $concat: ["Survey ", { $toString: "$_id" }] },
                ],
              },
            },
          },
        },
      },
    ]
  );

  const indexes = await Survey.collection.indexes();
  const obsoleteIndexes = indexes.filter(
    (index) => index.unique && OBSOLETE_UNIQUE_INDEXES.has(index.name)
  );

  for (const index of obsoleteIndexes) {
    await Survey.collection.dropIndex(index.name);
    console.log(`Dropped obsolete index: ${index.name}`);
  }

  await Survey.collection.createIndex(
    { village: 1, surveyTitle: 1 },
    { name: "village_1_surveyTitle_1" }
  );

  console.log(`Survey titles populated: ${titleResult.modifiedCount}`);
  console.log(`Obsolete unique indexes removed: ${obsoleteIndexes.length}`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Survey title migration failed:", error);
  await mongoose.disconnect();
  process.exit(1);
});
