import {
  useEffect,
  useState,
} from "react";

import { Link }
  from "react-router-dom";

import {
  getAllStories,
  deleteStory,
} from "../services/successStory.service";

const SuccessStoriesPage = () => {
  const [stories, setStories] =
    useState([]);

  const loadStories =
    async () => {
      const data =
        await getAllStories();

      setStories(data);
    };

  useEffect(() => {
    let isActive = true;

    getAllStories()
      .then((data) => {
        if (isActive) {
          setStories(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this story?"
        );

      if (!confirmed) {
        return;
      }

      await deleteStory(id);

      loadStories();
    };

  return (
    <div>

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-4xl font-bold">
          Success Stories Management
        </h1>

        <Link
          to="/admin/success-stories/create"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Story
        </Link>

      </div>

      <div className="bg-white rounded-xl shadow">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Slug
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {stories.map(
              (story) => (
                <tr
                  key={story._id}
                  className="border-b"
                >

                  <td className="p-4">
                    {story.title ||
                      "Untitled Success Story"}
                  </td>

                  <td className="p-4">
                    {story.slug}
                  </td>

                  <td className="p-4 space-x-4">

                    <Link
                      to={`/admin/success-stories/${story._id}`}
                      className="text-blue-600"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          story._id
                        )
                      }
                      className="text-red-600"
                    >
                      Delete
                    </button>

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

export default SuccessStoriesPage;