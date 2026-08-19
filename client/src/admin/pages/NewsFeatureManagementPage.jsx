import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getAdminNewsItems,
  toggleHomePageFeature,
} from "../services/event.service";

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const NewsFeatureManagementPage = () => {
  const [updatingId, setUpdatingId] = useState(null);
  const queryClient = useQueryClient();
  const {
    data: items = [],
    isLoading: loading,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: ["admin-news-event-items"],
    queryFn: getAdminNewsItems,
  });
  const error = queryError
    ? getUserFriendlyError(queryError, "Unable to load News & Updates items. Please refresh the page.")
    : "";

  const handleFeatureChange = async (item, checked) => {
    try {
      setUpdatingId(item._id);

      const updated = await toggleHomePageFeature(
        item._id,
        checked
      );

      queryClient.setQueryData(
        ["admin-news-event-items"],
        (current = []) =>
          current.map((currentItem) =>
            currentItem._id === item._id
              ? {
                  ...currentItem,
                  featureOnHomePage:
                    updated.featureOnHomePage,
                }
              : currentItem
          )
      );

      toast.success(
        checked
          ? "Item added to Home Page News & Announcements."
          : "Item removed from Home Page News & Announcements."
      );
    } catch (requestError) {
      console.error(requestError);
      toast.error(
        getUserFriendlyError(requestError, "Unable to update the Home Page feature status. Please try again.")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          News Management
        </h1>

        <p className="mt-1 text-slate-500">
          Select which published village Events, Achievements, and Visits
          appear in Home Page News & Announcements.
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-3 p-12 text-slate-600">
            <Loader2 className="animate-spin" size={20} />
            Loading News & Updates...
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-medium text-slate-700">
              No village Events, Achievements, or Visits found.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Create them from Events & Achievements first.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Title
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Village
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Type
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Event Date
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Public Status
                  </th>
                  <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                    Feature on Home Page
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {item.title}
                      </p>
                      {item.summary ? (
                        <p className="mt-1 max-w-sm truncate text-sm text-slate-500">
                          {item.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-700">
                      {item.village?.name?.en ||
                        item.village?.name ||
                        "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {item.type}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(item.eventDate)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          item.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.published
                          ? "Published"
                          : "Unpublished"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <label className="inline-flex cursor-pointer items-center gap-3">
                        <input
                          type="checkbox"
                          checked={Boolean(
                            item.featureOnHomePage
                          )}
                          disabled={updatingId === item._id}
                          onChange={(event) =>
                            handleFeatureChange(
                              item,
                              event.target.checked
                            )
                          }
                          className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 disabled:cursor-wait"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          {updatingId === item._id
                            ? "Updating..."
                            : "Feature on Home Page"}
                        </span>
                      </label>

                      {!item.published &&
                      item.featureOnHomePage ? (
                        <p className="mt-1 text-xs text-amber-700">
                          It will remain hidden until published.
                        </p>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsFeatureManagementPage;
