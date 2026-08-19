import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllVillageProfiles,
  deleteVillageProfile,
} from "../services/villageProfile.service";

export default function VillageProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);

      const data = await getAllVillageProfiles();

      setProfiles(data);
    } catch (error) {
      console.error(error);
      alert(
        getUserFriendlyError(error, "Unable to load village profiles. Please refresh the page.")
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this village profile?"
    );

    if (!confirmed) return;

    try {
      await deleteVillageProfile(id);

      alert("Village Profile Deleted Successfully.");

      loadProfiles();
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to delete the village profile. Please try again.")
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading Village Profiles...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Village Profiles
          </h1>

          <p className="text-gray-500">
            Manage all village profiles.
          </p>
        </div>

        <Link
          to="/admin/village-profiles/create"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          + Create Profile
        </Link>
      </div>

      {/* Empty State */}

      {profiles.length === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center">
          <h2 className="text-xl font-semibold">
            No Village Profiles Found
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first village profile.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full">

            <thead className="bg-gray-100">

              <tr>

                <th className="px-6 py-3 text-left">
                  Village
                </th>

                <th className="px-6 py-3 text-left">
                  State
                </th>

                <th className="px-6 py-3 text-left">
                  Hero Title
                </th>

                <th className="px-6 py-3 text-center">
                  Published
                </th>

                <th className="px-6 py-3 text-center">
                  Updated
                </th>

                <th className="px-6 py-3 text-center">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {profiles.map((profile) => (

                <tr
                  key={profile._id}
                  className="border-t"
                >

                  <td className="px-6 py-4">
                    {profile.village?.name?.en}
                  </td>

                  <td className="px-6 py-4">
                    {profile.village?.state?.name?.en}
                  </td>

                  <td className="px-6 py-4">
                    {profile.heroTitle}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {profile.isPublished
                      ? "✅"
                      : "❌"}
                  </td>

                  <td className="px-6 py-4 text-center">
                    {new Date(
                      profile.updatedAt
                    ).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">

                    <div className="flex justify-center gap-3">

                      <Link
                        to={`/admin/village-profiles/${profile._id}/edit`}
                        className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(profile._id)
                        }
                        className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}