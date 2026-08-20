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
  updateSection,
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

const PageSectionsPage = () => {
  const { pageId } =
    useParams();

  const [sections, setSections] =
    useState([]);
  const [pageTitle, setPageTitle] =
    useState("");
  const [pageSlug, setPageSlug] =
    useState("");
  const [saving, setSaving] =
    useState(false);


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
    pageId === HOME_PAGE_ID;
  const isSuccessStoriesPage =
    pageSlug === "success-stories";

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
        : sections;
  const handleOrderChange = (id, value) => {
    setSections((currentSections) =>
      currentSections.map((section) =>
        section._id === id
          ? {
              ...section,
              order: Number(value),
            }
          : section
      )
    );
  };

  const saveHomeSectionOrder = async () => {
    try {
      setSaving(true);

      await Promise.all(
        displayedSections.map((section) =>
          updateSection(section._id, {
            order: section.order,
            isVisible: section.isVisible,
          })
        )
      );

      alert("Sections updated successfully");
    } catch (error) {
      console.error(error);
      alert("Unable to update section order.");
    } finally {
      setSaving(false);
    }
  };

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

              <th className="p-4 text-left">
                Order
              </th>

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

                  <td className="p-4">
                    {isHomePage ? (
                      <input
                        type="number"
                        value={section.order}
                        onChange={(event) =>
                          handleOrderChange(
                            section._id,
                            event.target.value
                          )
                        }
                        className="w-24 rounded-lg border border-slate-300 px-3 py-2"
                        aria-label={`Display order for ${section.sectionType}`}
                      />
                    ) : (
                      section.order
                    )}
                  </td>

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
      {isHomePage && (
        <button
          type="button"
          onClick={saveHomeSectionOrder}
          disabled={saving}
          className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      )}

    </div>
  );
};

export default PageSectionsPage;
