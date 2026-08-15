import { useMemo, useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { ExternalLink, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import ConfirmDialog from "../components/common/ConfirmDialog";

import {
  deleteSupporter,
  getAdminSupporters,
} from "../services/supporter.service";

const SupportersPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const {
    data: supporters = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-supporters"],
    queryFn: () => getAdminSupporters(),
  });

  const visibleSupporters = useMemo(
    () =>
      typeFilter === "ALL"
        ? supporters
        : supporters.filter(
            (supporter) => supporter.type === typeFilter
          ),
    [supporters, typeFilter]
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteSupporter(deleteTarget._id);

      toast.success("Supporter deleted successfully.");
      setDeleteTarget(null);

      queryClient.invalidateQueries({
        queryKey: ["admin-supporters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-supporters"],
      });
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to delete supporter."
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Supporters
          </h1>

          <p className="mt-2 text-slate-500">
            Manage NGOs and donors displayed on the Our Supporters page.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/supporters/create")
          }
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Supporter
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <label className="text-sm font-medium text-slate-700">
          Supporter Type
        </label>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          className="ml-3 rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        >
          <option value="ALL">All supporters</option>
          <option value="NGO">NGOs</option>
          <option value="DONOR">Donors</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">
            Loading supporters...
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-600">
            Unable to load supporters.
          </div>
        ) : visibleSupporters.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No supporters found for this category.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Logo
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Link
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    About
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {visibleSupporters.map((supporter) => (
                  <tr key={supporter._id}>
                    <td className="px-5 py-4">
                      <img
                        src={supporter.logo?.url}
                        alt={
                          supporter.logo?.alt ||
                          supporter.name + " logo"
                        }
                        className="h-14 w-20 rounded-lg border border-slate-200 bg-white object-contain p-2"
                      />
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {supporter.name}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                        {supporter.type === "DONOR"
                          ? "Donor"
                          : "NGO"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={supporter.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:underline"
                      >
                        Visit
                        <ExternalLink size={14} />
                      </a>
                    </td>

                    <td className="max-w-sm px-5 py-4 text-sm leading-6 text-slate-600">
                      {supporter.about}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            "/admin/supporters/" +
                              supporter._id +
                              "/edit"
                          )
                        }
                        className="mr-4 font-medium text-blue-700 hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget(supporter)
                        }
                        className="font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Supporter"
        message={
          'Delete "' +
          (deleteTarget?.name || "this supporter") +
          '"? This action cannot be undone.'
        }
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SupportersPage;