import mongoose from "mongoose";

import { connectDB } from "../config/database.js";
import Page from "../models/Page.model.js";
import PageSection from "../models/PageSection.model.js";

const SOURCE_SLUG = "about";
const TARGET_SLUG = "mission-objectives";

const PRIMARY_SECTION_ORDER = [
  "ABOUT_OVERVIEW",
  "ABOUT_GALLERY",
  "OBJECTIVES_CONTENT",
  "OBJECTIVES_FOCUS_AREAS",
  "ABOUT_OBJECTIVES",
  "OBJECTIVES_OUTCOMES",
];

const RETIRED_HERO_TYPES = new Set([
  "ABOUT_HERO",
  "OBJECTIVES_HERO",
]);

const isApplyMode = process.argv.includes("--apply");

const byExistingOrder = (left, right) =>
  left.order - right.order ||
  String(left._id).localeCompare(String(right._id));

const buildSectionPlan = (sections) => {
  const sectionsByType = new Map();

  for (const section of sections) {
    const current = sectionsByType.get(section.sectionType) || [];
    current.push(section);
    sectionsByType.set(section.sectionType, current);
  }

  const duplicatePrimaryTypes = PRIMARY_SECTION_ORDER.filter(
    (sectionType) => (sectionsByType.get(sectionType) || []).length > 1
  );

  if (duplicatePrimaryTypes.length) {
    throw new Error(
      `Migration stopped because duplicate primary sections exist: ${duplicatePrimaryTypes.join(", ")}`
    );
  }

  const primarySections = PRIMARY_SECTION_ORDER.flatMap(
    (sectionType) => sectionsByType.get(sectionType) || []
  );
  const primaryIds = new Set(
    primarySections.map((section) => String(section._id))
  );

  const additionalSections = sections
    .filter(
      (section) =>
        !primaryIds.has(String(section._id)) &&
        !RETIRED_HERO_TYPES.has(section.sectionType)
    )
    .sort(byExistingOrder);

  return {
    orderedSections: [...primarySections, ...additionalSections],
    retiredHeroes: sections.filter((section) =>
      RETIRED_HERO_TYPES.has(section.sectionType)
    ),
  };
};

const run = async () => {
  await connectDB();

  const [sourcePage, targetPage] = await Promise.all([
    Page.findOne({ slug: SOURCE_SLUG }).lean(),
    Page.findOne({ slug: TARGET_SLUG }).lean(),
  ]);

  if (!sourcePage || !targetPage) {
    throw new Error(
      "Both the About and Mission & Objectives page records must exist before migration."
    );
  }

  const sections = await PageSection.find({
    pageId: { $in: [sourcePage._id, targetPage._id] },
  })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  const { orderedSections, retiredHeroes } = buildSectionPlan(sections);
  const sourceSectionCount = sections.filter(
    (section) => String(section.pageId) === String(sourcePage._id)
  ).length;

  console.table(
    orderedSections.map((section, index) => ({
      sectionType: section.sectionType,
      currentPage:
        String(section.pageId) === String(sourcePage._id)
          ? SOURCE_SLUG
          : TARGET_SLUG,
      newOrder: index + 1,
      sectionId: String(section._id),
    }))
  );

  console.log({
    mode: isApplyMode ? "apply" : "dry-run",
    sourceSectionsToMove: sourceSectionCount,
    retainedSections: orderedSections.length,
    retiredHeroSections: retiredHeroes.length,
  });

  if (!isApplyMode) {
    console.log(
      "Dry run complete. Re-run with --apply to migrate section ownership and archive the old About page."
    );
    return;
  }

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      if (orderedSections.length) {
        await PageSection.bulkWrite(
          orderedSections.map((section, index) => ({
            updateOne: {
              filter: { _id: section._id },
              update: {
                $set: {
                  pageId: targetPage._id,
                  order: index + 1,
                },
              },
            },
          })),
          { session }
        );
      }

      if (retiredHeroes.length) {
        await PageSection.bulkWrite(
          retiredHeroes.map((section, index) => ({
            updateOne: {
              filter: { _id: section._id },
              update: {
                $set: {
                  pageId: targetPage._id,
                  order: orderedSections.length + index + 1,
                  isVisible: false,
                },
              },
            },
          })),
          { session }
        );
      }

      await Page.updateOne(
        { _id: targetPage._id },
        {
          $set: {
            title: "Mission & Objectives",
            status: "PUBLISHED",
            isVisible: true,
          },
        },
        { session }
      );

      await Page.updateOne(
        { _id: sourcePage._id },
        {
          $set: {
            status: "ARCHIVED",
            isVisible: false,
          },
        },
        { session }
      );
    });
  } finally {
    await session.endSession();
  }

  const [remainingSourceSections, targetSections] = await Promise.all([
    PageSection.countDocuments({ pageId: sourcePage._id }),
    PageSection.find({ pageId: targetPage._id })
      .sort({ order: 1 })
      .select("sectionType order isVisible")
      .lean(),
  ]);

  if (remainingSourceSections !== 0) {
    throw new Error(
      `Migration verification failed: ${remainingSourceSections} sections remain assigned to About.`
    );
  }

  console.log("Migration verified successfully.");
  console.table(targetSections);
};

run()
  .catch((error) => {
    console.error("About page merge migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
