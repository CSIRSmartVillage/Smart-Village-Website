import usePage from "../../hooks/usePage";
import MainLayout from "../../layouts/MainLayout";
import AboutPageRenderer from "./AboutPageRenderer";
import MissionObjectivesBackdrop
  from "./MissionObjectivesBackdrop";

import "./MissionObjectivesPage.css";

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

    if (missionPage.loading) {
      return (
        <div className="py-20 text-center">
          Loading...
        </div>
      );
    }

    if (missionPage.error) {
      return (
        <MainLayout>
          <div className="py-20 text-center">
            {missionPage.error}
          </div>
        </MainLayout>
      );
    }

    const missionSections =
      missionPage.page?.sections || [];
    const aboutSections =
      missionSections;

    const missionStatementSections =
      missionSections.filter(
        (section) =>
          section.sectionType ===
          "OBJECTIVES_CONTENT"
      );
    const missionFocusAreaSections =
      missionSections.filter(
        (section) =>
          section.sectionType ===
          "OBJECTIVES_FOCUS_AREAS"
      );
    const missionOutcomeSections =
      missionSections.filter(
        (section) =>
          section.sectionType ===
          "OBJECTIVES_OUTCOMES"
      );
    const aboutMissionSections =
      aboutSections.filter(
        (section) =>
          section.sectionType ===
          "ABOUT_OVERVIEW"
      );
    const aboutGallerySections =
      aboutSections.filter(
        (section) =>
          section.sectionType ===
          "ABOUT_GALLERY"
      );
    const aboutObjectiveSections =
      aboutSections.filter(
        (section) =>
          section.sectionType ===
          "ABOUT_OBJECTIVES"
      );
    const remainingAboutSections =
      aboutSections.filter(
        (section) =>
          section.sectionType.startsWith(
            "ABOUT_"
          ) &&
          ![
            "ABOUT_OVERVIEW",
            "ABOUT_GALLERY",
            "ABOUT_OBJECTIVES",
            "ABOUT_QUICK_LINKS",
          ].includes(
            section.sectionType
          )
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
        <div className="mission-objectives-theme">
          <MissionObjectivesBackdrop />
          <div className="mission-section mission-section--about">
            <AboutPageRenderer
              sections={aboutMissionSections}
            />
          </div>

          <div className="mission-section mission-section--gallery">
            <AboutPageRenderer
              sections={aboutGallerySections}
            />
          </div>

          <div className="mission-section mission-section--statement">
            {renderMissionSections(
              missionStatementSections
            )}
          </div>

          <div className="mission-section mission-section--focus">
            {renderMissionSections(
              missionFocusAreaSections
            )}
          </div>

          <div className="mission-section mission-section--objectives">
            <AboutPageRenderer
              sections={aboutObjectiveSections}
            />
          </div>

          <div className="mission-section mission-section--outcomes">
            {renderMissionSections(
              missionOutcomeSections
            )}
          </div>

          <div className="mission-section mission-section--additional">
            <AboutPageRenderer
              sections={remainingAboutSections}
            />
          </div>

          <div className="mission-section mission-section--links">
            <AboutPageRenderer
              sections={
                aboutQuickLinkSections
              }
            />
          </div>
        </div>
      </MainLayout>
    );
  };

export default MissionObjectivesPage;