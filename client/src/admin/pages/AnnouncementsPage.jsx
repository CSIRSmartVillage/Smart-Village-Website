import {
  useEffect,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import {
  getAnnouncements,
  deleteAnnouncement,
} from "../services/announcement.service";

const AnnouncementsPage = () => {
  const [
    announcements,
    setAnnouncements,
  ] = useState([]);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements =
    async () => {
      try {
        const data =
          await getAnnouncements();

        setAnnouncements(
          data
        );
      } catch (error) {
        console.error(
          error
        );
      }
    };

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this announcement / update?"
        );

      if (!confirmed) {
        return;
      }

      try {
        await deleteAnnouncement(
          id
        );

        loadAnnouncements();
      } catch (error) {
        console.error(
          error
        );
      }
    };

  return (
    <div className="p-6">

      <div
        className="
          flex
          justify-between
          items-center
          mb-6
        "
      >
        <h1
          className="
            text-3xl
            font-bold
          "
        >
          Announcements / Updates
        </h1>

        <Link
          to="/admin/announcements/create"
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded
          "
        >
          Add Announcement / Update
        </Link>
      </div>

      <div
        className="
          bg-white
          rounded-lg
          shadow
          overflow-hidden
        "
      >
        <table
          className="
            w-full
            border-collapse
          "
        >
          <thead>
            <tr
              className="
                bg-gray-100
              "
            >
              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Featured
              </th>

              <th className="p-4 text-left">
                Active
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>

            {announcements.map(
              (
                announcement
              ) => (
                <tr
                  key={
                    announcement._id
                  }
                  className="
                    border-t
                  "
                >
                  <td className="p-4">
                    {
                      announcement.title
                    }
                  </td>

                  <td className="p-4">
                    {announcement.isFeatured
                      ? "Yes"
                      : "No"}
                  </td>

                  <td className="p-4">
                    {announcement.isActive
                      ? "Active"
                      : "Inactive"}
                  </td>

                  <td className="p-4 flex gap-3">

                    <Link
                      to={`/admin/announcements/edit/${announcement._id}`}
                      className="
                        text-blue-600
                      "
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() =>
                        handleDelete(
                          announcement._id
                        )
                      }
                      className="
                        text-red-600
                      "
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

export default AnnouncementsPage;