import {
  useEffect,
  useState,
} from "react";

import {
  getPages,
} from "../services/page.service";

import { Link }
  from "react-router-dom";

const PAGE_SLUGS_MANAGED_ELSEWHERE =
  new Set([
    "participating-labs",
    "news-updates",
    "nodal-lab",
    "csir-smart-village",
    "csir-laboratories",
  ]);


const PagesPage = () => {
  const [pages, setPages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadPages =
      async () => {
        try {
          const data =
            await getPages();

          setPages(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadPages();
  }, []);

  if (loading) {
    return (
      <h1>Loading...</h1>
    );
  }

  return (
    <div>

      <h1 className="text-4xl font-bold mb-8">
        Pages Management
      </h1>


      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-gray-50">

              <th className="text-left p-4">
                Title
              </th>

              <th className="text-left p-4">
                Status
              </th>

              <th className="text-left p-4">
                Visible
              </th>

              <th className="p-4">
                  Actions
            </th>

            </tr>

          </thead>

          <tbody>

            {pages
              .filter(
                (page) =>
                  !PAGE_SLUGS_MANAGED_ELSEWHERE.has(
                    page.slug
                  )
              )
              .map(
              (page) => (
                <tr
                  key={page._id}
                  className="border-b"
                >


                  <td className="p-4">
                    {page.title}
                  </td>

                  <td className="p-4">
                    {page.status}
                  </td>

                  <td className="p-4">
                    {page.isVisible
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    <Link
                      to={`/admin/pages/${page._id}`}
                      className="text-blue-600"
                    >
                       Edit
                   </Link>
                   <Link
                     to={`/admin/pages/${page._id}/sections`}
                     className="text-green-600 ml-4"
                    >
                     Sections
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

export default PagesPage;