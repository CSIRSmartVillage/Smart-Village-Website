import usePage from "../../hooks/usePage";
import MainLayout from "../../layouts/MainLayout";
import AboutPageRenderer from "./AboutPageRenderer";

import ObjectivesHero
  from "../../sections/missionObjectives/ObjectivesHero";

import ObjectivesContent
  from "../../sections/missionObjectives/ObjectivesContent";

import ObjectivesFocusAreas
  from "../../sections/missionObjectives/ObjectivesFocusAreas";

import ObjectivesOutcomes
  from "../../sections/missionObjectives/ObjectivesOutcomes";

const MissionObjectivesPage =
  () => {
    const missionPage = usePage(
      "mission-objectives"
    );
    const aboutPage =
      usePage("about");

    if (
      missionPage.loading ||
      aboutPage.loading
    ) {
      return (
        <div className="py-20 text-center">
          Loading...
        </div>
      );
    }

    if (
      missionPage.error ||
      aboutPage.error
    ) {
      return (
        <MainLayout>
          <div className="py-20 text-center">
            {missionPage.error ||
              aboutPage.error}
          </div>
        </MainLayout>
      );
    }

    const missionSections =
      missionPage.page?.sections || [];
    const aboutSections =
      aboutPage.page?.sections || [];

    const missionHeroSections =
      missionSections.filter(
        (section) =>
          section.sectionType ===
          "OBJECTIVES_HERO"
      );
    const missionDetailSections =
      missionSections.filter(
        (section) =>
          section.sectionType !==
          "OBJECTIVES_HERO"
      );
    const aboutInformationalSections =
      aboutSections.filter(
        (section) =>
          section.sectionType !==
          "ABOUT_QUICK_LINKS"
      );
    const aboutQuickLinkSections =
      aboutSections.filter(
        (section) =>
          section.sectionType ===
          "ABOUT_QUICK_LINKS"
      );

    const renderMissionSections =
      (pageSections) =>
        pageSections.map(
          (section) => {
            switch (
              section.sectionType
            ) {
              case "OBJECTIVES_HERO":
                return (
                  <ObjectivesHero
                    key={section._id}
                    data={section.content}
                  />
                );

              case "OBJECTIVES_CONTENT":
                return (
                  <ObjectivesContent
                    key={section._id}
                    data={section.content}
                  />
                );

              case "OBJECTIVES_FOCUS_AREAS":
                return (
                  <ObjectivesFocusAreas
                    key={section._id}
                    data={section.content}
                  />
                );

              case "OBJECTIVES_OUTCOMES":
                return (
                  <ObjectivesOutcomes
                    key={section._id}
                    data={section.content}
                  />
                );

              default:
                return null;
            }
          }
        );

    return (
      <MainLayout>
        {renderMissionSections(
          missionHeroSections
        )}

        <AboutPageRenderer
          sections={
            aboutInformationalSections
          }
        />

        {renderMissionSections(
          missionDetailSections
        )}

        <AboutPageRenderer
          sections={
            aboutQuickLinkSections
          }
        />
      </MainLayout>
    );
  };

export default MissionObjectivesPage;