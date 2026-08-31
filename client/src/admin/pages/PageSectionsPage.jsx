import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  getSectionsByPage,
} from "../services/section.service";

import {
  getPageById,
} from "../services/page.service";
import { getSectionDisplayName } from "../utils/sectionPresentation";

import {
  getHomeSectionPresentation,
  HOME_PAGE_ID,
  isManageableHomeSection,
} from "../utils/homeSectionPresentation";

const MISSION_OBJECTIVES_SECTION_ORDER =
  new Map([
    ["ABOUT_OVERVIEW", 1],
    ["ABOUT_GALLERY", 2],
    ["OBJECTIVES_CONTENT", 3],
    ["OBJECTIVES_FOCUS_AREAS", 4],
    ["ABOUT_OBJECTIVES", 5],
    ["OBJECTIVES_OUTCOMES", 6],
  ]);

const sortMissionObjectivesSections =
  (left, right) =>
    (MISSION_OBJECTIVES_SECTION_ORDER.get(left.sectionType) ?? 100 + left.order) -
    (MISSION_OBJECTIVES_SECTION_ORDER.get(right.sectionType) ?? 100 + right.order);

const PageSectionsPage = () => {
  const { pageId } =
    useParams();

  const [sections, setSections] =
    useState([]);
  const [pageTitle, setPageTitle] =
    useState("");
  const [pageSlug, setPageSlug] =
    useState("");
  useEffect(() => {
    const loadSections =
      async () => {
        const [data, pageData] =
          await Promise.all([
            getSectionsByPage(
              pageId
            ),
            getPageById(
              pageId
            ).catch(() => null),
          ]);

        setSections(data);
        setPageTitle(
          pageData?.title || ""
        );
        setPageSlug(
          pageData?.slug || ""
        );
      };

    loadSections();
  }, [pageId]);

  const isHomePage =
    pageSlug === "home" ||
    pageId === HOME_PAGE_ID;
  const isSuccessStoriesPage =
    pageSlug === "success-stories";
  const isMissionObjectivesPage =
    pageSlug === "mission-objectives";

  const displayedSections =
    isHomePage
      ? sections.filter(
          isManageableHomeSection
        )
      : isSuccessStoriesPage
        ? sections.filter(
            (section) =>
              section.sectionType !==
              "SUCCESS_STORIES_INTRO"
          )
        : isMissionObjectivesPage
          ? sections
              .filter(
                (section) =>
                  section.sectionType !== "OBJECTIVES_HERO" &&
                  section.sectionType !== "ABOUT_HERO"
              )
              .sort(sortMissionObjectivesSections)
        : sections;
  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        {isHomePage
          ? "Manage Home Page Sections"
          : pageTitle
            ? `${pageTitle} \u2013 Manage Sections`
            : "Manage Page Sections"}
      </h1>


      {isHomePage && (
        <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-600">
          Edit homepage sections with meaningful settings. Sections without editable settings are hidden; automatically updated content is identified below.
        </p>
      )}
      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-4 text-left">
                Section
              </th>

              {!isHomePage && (
                <th className="p-4 text-left">
                  Title
                </th>
              )}

              {!isHomePage && (
                <th className="p-4 text-left">
                  Order
                </th>
              )}

              <th className="p-4 text-left">
                Visible
              </th>

              <th className="p-4 text-left">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {displayedSections.map(
              (section) => (
                <tr
                  key={
                    section._id
                  }
                  className="border-b"
                >

                  <td className="p-4">
                    {isHomePage ? (
                      <>
                        <p className="font-semibold text-slate-900">
                          {getHomeSectionPresentation(
                            section.sectionType
                          )?.name}
                        </p>
                        <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                          {getHomeSectionPresentation(
                            section.sectionType
                          )?.description}
                        </p>
                      </>
                    ) : (
                      getSectionDisplayName(
                        section.sectionType
                      )
                    )}
                  </td>

                  {!isHomePage && (
                    <td className="p-4">
                      {section.title}
                    </td>
                  )}

                  {!isHomePage && (
                    <td className="p-4">
                      {section.order}
                    </td>
                  )}

                  <td className="p-4">
                    {section.isVisible
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    <Link
                      to={`/admin/sections/${section._id}`}
                      className="text-blue-600"
                    >
                      Edit section
                    </Link>
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
};

export default PageSectionsPage;
