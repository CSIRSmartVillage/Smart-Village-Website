import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getSectionsByPage,
  updateSection,
} from "../services/sectionManagement.service";

import {
  getHomeSectionPresentation,
  HOME_PAGE_ID,
  isManageableHomeSection,
} from "../utils/homeSectionPresentation";

const HomeSectionsPage =
  () => {
    const [
      sections,
      setSections,
    ] = useState([]);

    useEffect(() => {
      const loadSections =
        async () => {
          try {
            const data =
              await getSectionsByPage(
                HOME_PAGE_ID
              );

            setSections(
              data.filter(
                isManageableHomeSection
              )
            );
          } catch (error) {
            console.error(error);
          }
        };

      loadSections();
    }, []);

    const handleOrderChange =
      (
        id,
        value
      ) => {
        setSections(
          sections.map(
            (section) =>
              section._id ===
              id
                ? {
                    ...section,
                    order:
                      Number(
                        value
                      ),
                  }
                : section
          )
        );
      };

    const saveChanges =
      async () => {
        try {
          await Promise.all(
            sections.map(
              (
                section
              ) =>
                updateSection(
                  section._id,
                  {
                    order:
                      section.order,
                    isVisible:
                      section.isVisible,
                  }
                )
            )
          );

          alert(
            "Sections updated successfully"
          );
        } catch (
          error
        ) {
          console.error(
            error
          );
        }
      };

    return (
      <div>

        <h1
          className="
            text-3xl
            font-bold
            mb-8
          "
        >
          Manage Home Page Sections
        </h1>


        <p className="mb-6 max-w-3xl text-sm leading-6 text-slate-600">
          Update homepage sections with editable settings. Sections without editable settings are hidden; automatically updated content is identified below.
        </p>
        <div
          className="
            bg-white
            rounded-xl
            shadow
            overflow-hidden
          "
        >
          <table className="w-full">

            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left">
                  Section
                </th>

                <th className="p-4 text-left">
                  Order
                </th>

                <th className="p-4 text-left">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {sections.map(
                (
                  section
                ) => (
                  <tr
                    key={
                      section._id
                    }
                    className="border-t"
                  >
                    <td className="p-4">
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
                    </td>

                    <td className="p-4">
                      <input
                        type="number"
                        value={
                          section.order
                        }
                        onChange={(
                          e
                        ) =>
                          handleOrderChange(
                            section._id,
                            e
                              .target
                              .value
                          )
                        }
                        className="
                          border
                          rounded-lg
                          px-3
                          py-2
                          w-24
                        "
                      />
                    </td>

                    <td className="p-4">
                      <Link
                        to={`/admin/sections/${section._id}`}
                        className="font-semibold text-blue-700 hover:text-blue-900"
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

        <button
          onClick={
            saveChanges
          }
          className="
            mt-6
            px-6
            py-3
            bg-blue-600
            text-white
            rounded-lg
          "
        >
          Save Changes
        </button>

      </div>
    );
  };

export default HomeSectionsPage;