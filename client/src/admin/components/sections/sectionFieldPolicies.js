const textItems = true;
const titleAndDescription = {
  title: true,
  description: true,
};

// Each allowlist is based on properties read by the current public renderer.
// Fields outside the allowlist stay stored but are intentionally hidden in the CMS.
const sectionFieldPolicies = {
  HERO: {
    heading: true,
    subHeading: true,
    heroImages: true,
  },
  IMPACT_STATISTICS: {
    heading: true,
    description: true,
  },
  LATEST_UPDATES: {
    heading: true,
    description: true,
  },

  ABOUT_GALLERY: {
    images: { imageUrl: true },
  },
  ABOUT_OVERVIEW: {
    description: true,
  },
  ABOUT_HISTORY: {
    heading: true,
    timeline: {
      year: true,
      title: true,
      description: true,
    },
  },
  ABOUT_VALUES: {
    heading: true,
    values: true,
  },
  ABOUT_OBJECTIVES: {
    heading: true,
    description: true,
    objectives: titleAndDescription,
  },
  ABOUT_CBRI: {
    heading: true,
    description: true,
    features: titleAndDescription,
  },
  ABOUT_QUICK_LINKS: {
    heading: true,
    links: {
      title: true,
      description: true,
      path: true,
    },
  },

  OBJECTIVES_HERO: {
    backgroundImage: true,
    heroImage: true,
  },
  OBJECTIVES_CONTENT: {
    description: true,
  },
  OBJECTIVES_FOCUS_AREAS: {
    heading: true,
    items: titleAndDescription,
  },
  OBJECTIVES_OUTCOMES: {
    heading: true,
    items: textItems,
  },

  PROFILE_HERO: {
    heading: true,
    subHeading: true,
  },
  PROFILE_MESSAGE: {
    image: true,
    name: true,
    designation: true,
    message: true,
  },
  PROFILE_BIO: {
    heading: true,
    description: true,
  },

  CONTACT_HERO: {
    heading: true,
    description: true,
  },
  CONTACT_FORM: {
    heading: true,
    description: true,
  },
  CONTACT_INFORMATION: {
    address: true,
    phone: true,
  },

  SUCCESS_STORIES_HERO: {
    description: true,
    backgroundImage: true,
    heroImage: true,
  },

  // Verified section types with no current public content consumer.
  MISSION: {},
  MISSION_OBJECTIVES: {},
  CSIR_CBRI: {},
  POLICIES: {},
  VILLAGES: {},
  FOOTER: {},
  RICH_TEXT: {},
  CARDS: {},
  GALLERY: {},
  TIMELINE: {},
  FAQ: {},
  CONTACT: {},
  NEWS_FEED: {},
  VILLAGE_GRID: {},
  CUSTOM: {},
  ABOUT_HERO: {},
  ABOUT_VISION: {},
  ABOUT_MISSION: {},
  ABOUT_PREVIEW: {},
  CSIR_LABS_HERO: {},
  CSIR_LABS_OVERVIEW: {},
  CSIR_LABS_ROLE: {},
  CSIR_LABS_NETWORK: {},
  CSIR_LABS_NODAL_PREVIEW: {},
  CSIR_LABS_PARTICIPATING_PREVIEW: {},
  NODAL_LAB_HERO: {},
  NODAL_LAB_OVERVIEW: {},
  NODAL_LAB_RESPONSIBILITIES: {},
  NODAL_LAB_RESEARCH_AREAS: {},
  NODAL_LAB_PROJECTS: {},
  NODAL_LAB_ACHIEVEMENTS: {},
  NODAL_LAB_CONTACT: {},
  PARTICIPATING_LABS_HERO: {},
  PARTICIPATING_LABS_OVERVIEW: {},
  PARTICIPATING_LABS_LIST: {},
  PARTICIPATING_LABS_RESEARCH: {},
  PARTICIPATING_LABS_CONTRIBUTIONS: {},
  PARTICIPATING_LABS_CONTACT: {},
  SMART_VILLAGE_HERO: {},
  SMART_VILLAGE_OVERVIEW: {},
  SMART_VILLAGE_OBJECTIVES: {},
  SMART_VILLAGE_FOCUS_AREAS: {},
  SMART_VILLAGE_FRAMEWORK: {},
  SMART_VILLAGE_IMPACT: {},
  SMART_VILLAGE_VILLAGES: {},
  CONTACT_LOCATION: {},
  CONTACT_FAQ: {},
  NEWS_HERO: {},
  NEWS_INTRO: {},
  SUCCESS_STORIES_INTRO: {},
};

export const getSectionFieldPolicy = (sectionType) =>
  Object.prototype.hasOwnProperty.call(sectionFieldPolicies, sectionType)
    ? sectionFieldPolicies[sectionType]
    : undefined;
