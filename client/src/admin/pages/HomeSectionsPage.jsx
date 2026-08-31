import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import {
  getSectionsByPage,
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

      </div>
    );
  };

export default HomeSectionsPage;
