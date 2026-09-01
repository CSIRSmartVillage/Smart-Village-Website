import { useMemo, useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  Globe2,
  Lock,
  Pencil,
  Search,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { getUserFriendlyError } from "../../utils/userFriendlyError";
import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import {
  createGovernmentApproval,
  deleteGovernmentApproval,
  getGovernmentApprovals,
  updateGovernmentApproval,
} from "../services/governmentApproval.service";
import { getAllVillages } from "../services/village.service";

const EMPTY_LIST = [];

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith("image/")) {
    return FileImage;
  }
  if (mimeType === "application/pdf") {
    return FileText;
  }
  return File;
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const villageName = (village) =>
  village?.name?.en || village?.name || "Unknown village";

const GovernmentApprovalsPage = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [villageFilter, setVillageFilter] =
    useState("");
  const [visibilityFilter, setVisibilityFilter] =
    useState("");
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] =
    useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fileInputKey, setFileInputKey] =
    useState(0);
  const [form, setForm] = useState({
    village: "",
    title: "",
    description: "",
    showOnWebsite: false,
    file: null,
  });

  const queryParams = useMemo(
    () => ({
      page,
      limit: 25,
      ...(search.trim()
        ? { search: search.trim() }
        : {}),
      ...(villageFilter
        ? { village: villageFilter }
        : {}),
      ...(visibilityFilter
        ? { showOnWebsite: visibilityFilter }
        : {}),
    }),
    [page, search, villageFilter, visibilityFilter]
  );

  const {
    data: villagesData,
    isLoading: villagesLoading,
  } = useQuery({
    queryKey: ["admin-villages"],
    queryFn: getAllVillages,
  });

  const {
    data: approvalsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "admin-government-approvals",
      queryParams,
    ],
    queryFn: () =>
      getGovernmentApprovals(queryParams),
    refetchInterval: 4 * 60 * 1000,
  });

  const villages = Array.isArray(villagesData)
    ? villagesData
    : EMPTY_LIST;
  const approvals = Array.isArray(
    approvalsData?.data
  )
    ? approvalsData.data
    : EMPTY_LIST;
  const pagination = approvalsData?.pagination
    ? {
        ...approvalsData.pagination,
        pages: approvalsData.pagination.totalPages,
      }
    : null;

  const updateForm = (key, value) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setEditing(null);
    setForm({
      village: "",
      title: "",
      description: "",
      showOnWebsite: false,
      file: null,
    });
    setFileInputKey((current) => current + 1);
  };

  const beginEdit = (approval) => {
    setEditing(approval);
    setForm({
      village:
        approval.village?._id || approval.village || "",
      title: approval.title || "",
      description: approval.description || "",
      showOnWebsite: Boolean(
        approval.showOnWebsite
      ),
      file: null,
    });
    setFileInputKey((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event) => {
    event.preventDefault();

    if (!editing && !form.village) {
      toast.error("Please select a village.");
      return;
    }
    if (!editing && !form.file) {
      toast.error("Please select a document to upload.");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title.trim());
    payload.append(
      "description",
      form.description.trim()
    );
    payload.append(
      "showOnWebsite",
      String(form.showOnWebsite)
    );

    if (!editing) {
      payload.append("village", form.village);
    }
    if (form.file) {
      payload.append("file", form.file);
    }

    try {
      setSaving(true);

      if (editing) {
        await updateGovernmentApproval(
          editing._id,
          payload
        );
        toast.success(
          "Government approval updated successfully."
        );
      } else {
        await createGovernmentApproval(payload);
        toast.success(
          "Government approval uploaded successfully."
        );
      }

      resetForm();
      await queryClient.invalidateQueries({
        queryKey: ["admin-government-approvals"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["government-approvals"],
      });
    } catch (error) {
      toast.error(
        getUserFriendlyError(error, {
          action: "upload",
          fallback:
            "Unable to save the government approval.",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleVisibility = async (approval) => {
    try {
      await updateGovernmentApproval(approval._id, {
        showOnWebsite: !approval.showOnWebsite,
      });
      toast.success("Visibility updated successfully.");
      await queryClient.invalidateQueries({
        queryKey: ["admin-government-approvals"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["government-approvals"],
      });
    } catch (error) {
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to update document visibility."
        )
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteGovernmentApproval(
        deleteTarget._id
      );
      toast.success(
        "Government approval deleted successfully."
      );
      setDeleteTarget(null);
      await queryClient.invalidateQueries({
        queryKey: ["admin-government-approvals"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["government-approvals"],
      });
    } catch (error) {
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to delete the government approval."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-100 disabled:text-slate-500";
  const actionClass =
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition";

  return (
    <div className="mx-auto max-w-[1500px] space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          SMART Village · Village Modules
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Government Approvals
        </h1>
        <p className="mt-3 max-w-3xl leading-7 text-slate-600">
          Upload and manage village approval documents. Private
          documents remain available only to authenticated admins.
        </p>
      </section>

      <section className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]">
        <form
          onSubmit={submit}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              {editing ? (
                <Pencil size={23} />
              ) : (
                <UploadCloud size={24} />
              )}
            </span>
            <div>
              <h2 className="text-xl font-bold text-slate-950">
                {editing
                  ? "Edit document"
                  : "Upload document"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                PDF, Word and common image formats are supported.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              Village
              <select
                required={!editing}
                disabled={Boolean(editing) || villagesLoading}
                value={form.village}
                onChange={(event) =>
                  updateForm("village", event.target.value)
                }
                className={fieldClass}
              >
                <option value="">Select village</option>
                {villages.map((village) => (
                  <option
                    key={village._id}
                    value={village._id}
                  >
                    {villageName(village)}
                    {village.district
                      ? ` — ${village.district}`
                      : ""}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              File {editing ? "(optional replacement)" : ""}
              <input
                key={fileInputKey}
                required={!editing}
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tif,.tiff"
                onChange={(event) =>
                  updateForm(
                    "file",
                    event.target.files?.[0] || null
                  )
                }
                className={`${fieldClass} file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700`}
              />
              {editing && (
                <span className="mt-2 block break-all text-xs font-normal text-slate-500">
                  Current file: {editing.file?.originalName}
                </span>
              )}
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Title <span className="font-normal text-slate-400">(optional)</span>
              <input
                type="text"
                maxLength={200}
                value={form.title}
                onChange={(event) =>
                  updateForm("title", event.target.value)
                }
                className={fieldClass}
                placeholder="Approval title"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Description <span className="font-normal text-slate-400">(optional)</span>
              <textarea
                rows={4}
                maxLength={2000}
                value={form.description}
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                className={fieldClass}
                placeholder="Short document description"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Show on Website
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-500">
                  Off keeps this document private and admin-only.
                </span>
              </span>
              <input
                type="checkbox"
                checked={form.showOnWebsite}
                onChange={(event) =>
                  updateForm(
                    "showOnWebsite",
                    event.target.checked
                  )
                }
                className="h-5 w-5 rounded border-slate-300 text-blue-700 focus:ring-blue-500"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <UploadCloud size={18} />
              {saving
                ? "Saving..."
                : editing
                ? "Save Changes"
                : "Upload Document"}
            </button>

            {editing && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <X size={17} />
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="min-w-0 space-y-5">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_220px_190px]">
              <label className="relative block">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <span className="sr-only">Search documents</span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  placeholder="Search file, title or description"
                />
              </label>

              <select
                value={villageFilter}
                onChange={(event) => {
                  setVillageFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All villages</option>
                {villages.map((village) => (
                  <option key={village._id} value={village._id}>
                    {villageName(village)}
                  </option>
                ))}
              </select>

              <select
                value={visibilityFilter}
                onChange={(event) => {
                  setVisibilityFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
              >
                <option value="">All visibility</option>
                <option value="true">Public</option>
                <option value="false">Private</option>
              </select>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-xl font-bold text-slate-950">
                Document Manager
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {pagination?.total || 0} approval document
                {pagination?.total === 1 ? "" : "s"}
              </p>
            </div>

            {isLoading ? (
              <div className="p-12 text-center text-slate-500">
                Loading government approvals...
              </div>
            ) : isError ? (
              <div className="p-12 text-center text-red-600">
                Unable to load government approvals.
              </div>
            ) : approvals.length === 0 ? (
              <div className="p-12 text-center">
                <FileText
                  size={38}
                  className="mx-auto text-slate-300"
                />
                <p className="mt-4 font-semibold text-slate-800">
                  No approval documents found
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a document or change the current filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-[1150px] w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-4 py-3">File</th>
                      <th className="px-4 py-3">Village</th>
                      <th className="px-4 py-3">Title</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Type</th>
                      <th className="px-4 py-3">Visibility</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {approvals.map((approval) => {
                      const FileIcon = getFileIcon(
                        approval.file?.mimeType
                      );

                      return (
                        <tr
                          key={approval._id}
                          className="align-top transition hover:bg-slate-50"
                        >
                          <td className="max-w-[220px] px-4 py-4">
                            <div className="flex items-start gap-3">
                              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                                <FileIcon size={19} />
                              </span>
                              <div className="min-w-0">
                                <p className="break-all text-sm font-semibold text-slate-900">
                                  {approval.file?.originalName}
                                </p>
                                {approval.file?.size > 0 && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {formatFileSize(
                                      approval.file.size
                                    )}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-slate-700">
                            {villageName(approval.village)}
                          </td>
                          <td className="max-w-[180px] px-4 py-4 text-sm text-slate-700">
                            {approval.title || "—"}
                          </td>
                          <td className="max-w-[240px] px-4 py-4 text-sm leading-6 text-slate-600">
                            <p className="line-clamp-3">
                              {approval.description || "—"}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase text-slate-700">
                              {approval.file?.extension?.replace(
                                ".",
                                ""
                              ) || "File"}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                toggleVisibility(approval)
                              }
                              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                                approval.showOnWebsite
                                  ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                  : "bg-amber-50 text-amber-700 hover:bg-amber-100"
                              }`}
                            >
                              {approval.showOnWebsite ? (
                                <Globe2 size={14} />
                              ) : (
                                <Lock size={14} />
                              )}
                              {approval.showOnWebsite
                                ? "Public"
                                : "Admin Only"}
                            </button>
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex flex-wrap justify-end gap-2">
                              <a
                                href={approval.viewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`${actionClass} bg-blue-50 text-blue-700 hover:bg-blue-100`}
                              >
                                <Eye size={14} />
                                View
                              </a>
                              <a
                                href={approval.downloadUrl}
                                className={`${actionClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100`}
                              >
                                <Download size={14} />
                                Download
                              </a>
                              <button
                                type="button"
                                onClick={() => beginEdit(approval)}
                                className={`${actionClass} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
                              >
                                <Pencil size={14} />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeleteTarget(approval)
                                }
                                className={`${actionClass} bg-red-50 text-red-700 hover:bg-red-100`}
                              >
                                <Trash2 size={14} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Government Approval"
        message={`Delete “${
          deleteTarget?.title ||
          deleteTarget?.file?.originalName ||
          "this document"
        }”? The file will also be removed from private storage.`}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default GovernmentApprovalsPage;
