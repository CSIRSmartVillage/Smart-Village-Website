const sectionDisplayNames = {
  HERO: "Home Banner / Top Section",
  MISSION: "Mission Overview",
  MISSION_OBJECTIVES: "Mission Objectives Summary",
  IMPACT_STATISTICS: "Smart Village Impact Summary",
  CSIR_CBRI: "CSIR-CBRI Overview",
  LATEST_UPDATES: "Latest News & Events",
  POLICIES: "Policies & Schemes",
  VILLAGES: "Featured Villages",
  FOOTER: "Website Footer",
  RICH_TEXT: "Main Text Content",
  CARDS: "Information Cards",
  GALLERY: "Image Gallery",
  TIMELINE: "Timeline",
  FAQ: "Frequently Asked Questions",
  CONTACT: "Contact Section",
  NEWS_FEED: "News Feed",
  VILLAGE_GRID: "Villages List",
  CUSTOM: "Additional Content",

  ABOUT_HERO: "Top Banner",
  ABOUT_GALLERY: "Image Gallery",
  ABOUT_OVERVIEW: "About Overview",
  ABOUT_VISION: "Vision",
  ABOUT_MISSION: "Mission",
  ABOUT_OBJECTIVES: "Objectives",
  ABOUT_HISTORY: "History & Timeline",
  ABOUT_CBRI: "About CSIR-CBRI",
  ABOUT_PREVIEW: "About Preview",
  ABOUT_QUICK_LINKS: "Quick Links",

  OBJECTIVES_HERO: "Top Banner",
  OBJECTIVES_CONTENT: "Mission Objectives Content",
  OBJECTIVES_FOCUS_AREAS: "Focus Areas",
  OBJECTIVES_OUTCOMES: "Outcomes",

  PROFILE_HERO: "Top Banner",
  PROFILE_MESSAGE: "Profile Message",
  PROFILE_BIO: "Biography",

  CSIR_LABS_HERO: "Top Banner",
  CSIR_LABS_OVERVIEW: "Laboratories Overview",
  CSIR_LABS_ROLE: "Role of CSIR Laboratories",
  CSIR_LABS_NETWORK: "Laboratory Network",
  CSIR_LABS_NODAL_PREVIEW: "Nodal Laboratory Preview",
  CSIR_LABS_PARTICIPATING_PREVIEW:
    "Participating Laboratories Preview",

  NODAL_LAB_HERO: "Top Banner",
  NODAL_LAB_OVERVIEW: "Laboratory Overview",
  NODAL_LAB_RESPONSIBILITIES: "Responsibilities",
  NODAL_LAB_RESEARCH_AREAS: "Research Areas",
  NODAL_LAB_PROJECTS: "Projects",
  NODAL_LAB_ACHIEVEMENTS: "Achievements",
  NODAL_LAB_CONTACT: "Contact Information",

  PARTICIPATING_LABS_HERO: "Top Banner",
  PARTICIPATING_LABS_OVERVIEW: "Laboratories Overview",
  PARTICIPATING_LABS_LIST: "Participating Laboratories List",
  PARTICIPATING_LABS_RESEARCH: "Research Areas",
  PARTICIPATING_LABS_CONTRIBUTIONS: "Key Contributions",
  PARTICIPATING_LABS_CONTACT: "Contact Information",

  SMART_VILLAGE_HERO: "Top Banner",
  SMART_VILLAGE_OVERVIEW: "Smart Village Overview",
  SMART_VILLAGE_OBJECTIVES: "Objectives",
  SMART_VILLAGE_FOCUS_AREAS: "Focus Areas",
  SMART_VILLAGE_FRAMEWORK: "Development Framework",
  SMART_VILLAGE_IMPACT: "Impact Summary",
  SMART_VILLAGE_VILLAGES: "Villages",

  CONTACT_HERO: "Top Banner",
  CONTACT_INFORMATION: "Contact Information",
  CONTACT_FORM: "Contact Form",
  CONTACT_LOCATION: "Map & Location",
  CONTACT_FAQ: "Frequently Asked Questions",

  NEWS_HERO: "Top Banner",
  NEWS_INTRO: "News Introduction",

  SUCCESS_STORIES_HERO: "Top Banner",
  SUCCESS_STORIES_INTRO: "Success Stories Introduction",
};

const humanizeSectionType = (sectionType) =>
  String(sectionType || "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(" ");

export const getSectionDisplayName =
  (sectionType) =>
    sectionDisplayNames[sectionType] ||
    humanizeSectionType(sectionType) ||
    "Website Section";
