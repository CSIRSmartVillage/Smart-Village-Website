import { getSectionDisplayName } from "./sectionPresentation";

export const HOME_PAGE_ID =
  "6a2fd2ad6ea52761ac32ca8a";


// Only section types with meaningful fields in the current CMS editor belong here.
// Video content and unused legacy placeholders stay stored but are hidden from this UI.
const homeSectionPresentation = {
  HERO: {
    name: getSectionDisplayName("HERO"),
    description:
      "Controls the rotating banner images shown at the top of the homepage.",
  },
  IMPACT_STATISTICS: {
    name: getSectionDisplayName("IMPACT_STATISTICS"),
    description:
      "Controls the heading and introduction above the impact figures. The figures update automatically from website records.",
  },
  LATEST_UPDATES: {
    name: getSectionDisplayName("LATEST_UPDATES"),
    description:
      "Controls the heading and introduction for recent updates. The cards are added automatically from Events & Achievements.",
  },
};

export const getHomeSectionPresentation =
  (sectionType) =>
    homeSectionPresentation[sectionType] ||
    null;

export const isManageableHomeSection =
  (section) =>
    Boolean(
      getHomeSectionPresentation(
        section.sectionType
      )
    );
