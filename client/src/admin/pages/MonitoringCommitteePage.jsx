import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUp,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { getUserFriendlyError } from "../../utils/userFriendlyError";
import ConfirmDialog from "../components/common/ConfirmDialog";
import MediaUploader from "../components/common/MediaUploader";
import {
  createMonitoringCommitteeMember,
  deleteMonitoringCommitteeMember,
  getMonitoringCommitteeMembers,
  getMonitoringCommitteeSettingsAdmin,
  reorderMonitoringCommitteeMembers,
  updateMonitoringCommitteeSettingsAdmin,
  updateMonitoringCommitteeMember,
} from "../services/monitoringCommittee.service";

const DEFAULT_HEADER_SUBTITLE =
  "Committee structure and contact information for monitoring the SMART Village Mission.";

const ROLE_SECTIONS = [
  {
    value: "CHAIRMAN",
    label: "Chairman",
    description: "The top-level committee chairperson.",
    accent: "border-blue-200 bg-blue-50/50",
  },
  {
    value: "MEMBER",
    label: "Flowchart Members",
    description: "Members displayed beneath the Chairman.",
    accent: "border-slate-200 bg-slate-50",
  },
  {
    value: "CONVENER",
    label: "Conveners",
    description: "Conveners displayed in their own section.",
    accent: "border-orange-200 bg-orange-50/50",
  },
  {
    value: "HEAD",
    label: "Head",
    description: "Heads displayed in their own section.",
    accent: "border-emerald-200 bg-emerald-50/50",
  },
];

const emptyForm = (role = "MEMBER") => ({
  photo: null,
  name: "",
  designation: "",
  phone: "",
  email: "",
  role,
  displayOrder: "",
});

const sortByOrder = (items) =>
  [...items].sort(
    (a, b) =>
      Number(a.displayOrder || 0) -
      Number(b.displayOrder || 0)
  );

const MonitoringCommitteePage = () => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm());
  const [editingId, setEditingId] = useState(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [movingId, setMovingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [subtitleDraft, setSubtitleDraft] = useState(null);
  const [savingHeader, setSavingHeader] = useState(false);

  const {
    data: rawMembers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-monitoring-committee"],
    queryFn: getMonitoringCommitteeMembers,
  });
  const {
    data: headerSettings = {},
    isError: headerSettingsError,
  } = useQuery({
    queryKey: ["admin-monitoring-committee-settings"],
    queryFn: getMonitoringCommitteeSettingsAdmin,
  });

  const members = useMemo(
    () => (Array.isArray(rawMembers) ? rawMembers : []),
    [rawMembers]
  );
  const subtitleValue =
    subtitleDraft ??
    (typeof headerSettings.subtitle === "string"
      ? headerSettings.subtitle
      : DEFAULT_HEADER_SUBTITLE);
  const grouped = useMemo(
    () =>
      Object.fromEntries(
        ROLE_SECTIONS.map(({ value }) => [
          value,
          sortByOrder(
            members.filter((member) => member.role === value)
          ),
        ])
      ),
    [members]
  );

  const openCreate = (role = "MEMBER") => {
    setEditingId(null);
    setForm(emptyForm(role));
    setEditorOpen(true);
  };

  const openEdit = (member) => {
    setEditingId(member._id);
    setForm({
      photo: member.photo || null,
      name: member.name || "",
      designation: member.designation || "",
      phone: member.phone || "",
      email: member.email || "",
      role: member.role || "MEMBER",
      displayOrder: member.displayOrder ?? "",
    });
    setEditorOpen(true);
  };

  const closeEditor = (force = false) => {
    if (saving && !force) return;
    setEditorOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    const payload = {
      photo: form.photo?._id || null,
      name: form.name.trim(),
      designation: form.designation.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      role: form.role,
    };

    if (form.displayOrder !== "") {
      payload.displayOrder = Number(form.displayOrder);
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateMonitoringCommitteeMember(editingId, payload);
        toast.success("Committee member updated successfully.");
      } else {
        await createMonitoringCommitteeMember(payload);
        toast.success("Committee member added successfully.");
      }

      await queryClient.invalidateQueries({
        queryKey: ["admin-monitoring-committee"],
      });
      queryClient.invalidateQueries({
        queryKey: ["monitoring-committee"],
      });
      closeEditor(true);
    } catch (error) {
      console.error(error);
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to save the committee member. Please try again."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMove = async (role, index, direction) => {
    const roleMembers = grouped[role];
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= roleMembers.length) return;

    const reordered = [...roleMembers];
    [reordered[index], reordered[nextIndex]] = [
      reordered[nextIndex],
      reordered[index],
    ];

    try {
      setMovingId(roleMembers[index]._id);
      const updated = await reorderMonitoringCommitteeMembers(
        role,
        reordered.map((member) => member._id)
      );
      queryClient.setQueryData(
        ["admin-monitoring-committee"],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["monitoring-committee"],
      });
      toast.success("Display order updated.");
    } catch (error) {
      console.error(error);
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to update the display order."
        )
      );
    } finally {
      setMovingId(null);
    }
  };

  const handleHeaderSave = async () => {
    try {
      setSavingHeader(true);
      const updated =
        await updateMonitoringCommitteeSettingsAdmin(
          subtitleValue
        );

      queryClient.setQueryData(
        ["admin-monitoring-committee-settings"],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["monitoring-committee-settings"],
      });
      setSubtitleDraft(null);
      toast.success("Page header updated successfully.");
    } catch (error) {
      console.error(error);
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to update the page header."
        )
      );
    } finally {
      setSavingHeader(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);
      await deleteMonitoringCommitteeMember(deleteTarget._id);
      toast.success("Committee member deleted successfully.");
      setDeleteTarget(null);
      await queryClient.invalidateQueries({
        queryKey: ["admin-monitoring-committee"],
      });
      queryClient.invalidateQueries({
        queryKey: ["monitoring-committee"],
      });
    } catch (error) {
      console.error(error);
      toast.error(
        getUserFriendlyError(
          error,
          "Unable to delete the committee member."
        )
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Monitoring Committee
          </h1>
          <p className="mt-2 text-slate-500">
            Manage the Chairman, flowchart members, Conveners, and Head.
          </p>
        </div>

        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Committee Member
        </button>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Page Header
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            The “Monitoring Committee” title is fixed. Edit the
            subtitle displayed below it.
          </p>
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-700">
          Header Subtitle
          <textarea
            rows={3}
            maxLength={500}
            value={subtitleValue}
            onChange={(event) =>
              setSubtitleDraft(event.target.value)
            }
            className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 leading-6 outline-none focus:border-blue-500"
          />
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs text-slate-500">
              {subtitleValue.length}/500 characters
            </p>
            {headerSettingsError && (
              <p className="mt-1 text-sm text-red-600">
                The saved subtitle could not be loaded. You can still
                enter and save a new value.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleHeaderSave}
            disabled={savingHeader}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {savingHeader ? "Saving..." : "Save Header"}
          </button>
        </div>
      </section>

      {editorOpen && (
        <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Committee Member" : "Add Committee Member"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Only the name is required. All other fields are optional.
              </p>
            </div>
            <button
              type="button"
              onClick={closeEditor}
              disabled={saving}
              aria-label="Close editor"
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
              <MediaUploader
                label="Photo (Optional)"
                value={form.photo}
                onChange={(value) => updateField("photo", value)}
                uploadAreaClassName="p-6"
                previewImageClassName="object-contain bg-white"
              />

              <div className="grid content-start gap-5 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">
                  Name <span className="text-red-600">*</span>
                  <input
                    required
                    maxLength={200}
                    value={form.name}
                    onChange={(event) =>
                      updateField("name", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Designation
                  <input
                    maxLength={300}
                    value={form.designation}
                    onChange={(event) =>
                      updateField("designation", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Phone
                  <input
                    type="tel"
                    maxLength={50}
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Role / Section
                  <select
                    value={form.role}
                    onChange={(event) =>
                      updateField("role", event.target.value)
                    }
                    className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500"
                  >
                    {ROLE_SECTIONS.map((section) => (
                      <option
                        key={section.value}
                        value={section.value}
                        disabled={
                          section.value === "CHAIRMAN" &&
                          grouped.CHAIRMAN.length > 0 &&
                          !grouped.CHAIRMAN.some(
                            (member) => member._id === editingId
                          )
                        }
                      >
                        {section.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="text-sm font-medium text-slate-700">
                  Display Order
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.displayOrder}
                    onChange={(event) =>
                      updateField("displayOrder", event.target.value)
                    }
                    placeholder="Added automatically"
                    className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                  />
                </label>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={closeEditor}
                disabled={saving}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Member"}
              </button>
            </div>
          </form>
        </section>
      )}

      {isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-14 text-center text-slate-500">
          Loading Monitoring Committee...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-14 text-center text-red-700">
          Unable to load the Monitoring Committee.
        </div>
      ) : (
        <div className="space-y-6">
          {ROLE_SECTIONS.map((section) => {
            const roleMembers = grouped[section.value];
            const chairmanExists =
              section.value === "CHAIRMAN" && roleMembers.length > 0;

            return (
              <section
                key={section.value}
                className={
                  "rounded-2xl border p-5 shadow-sm sm:p-6 " +
                  section.accent
                }
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {section.label}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      {section.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openCreate(section.value)}
                    disabled={chairmanExists}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plus size={16} />
                    {chairmanExists ? "Chairman Added" : "Add " + section.label}
                  </button>
                </div>

                {roleMembers.length === 0 ? (
                  <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-white/70 px-5 py-8 text-center text-sm text-slate-500">
                    No {section.label.toLowerCase()} added yet.
                  </div>
                ) : (
                  <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="min-w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Person
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Contact
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Order
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roleMembers.map((member, index) => (
                          <tr key={member._id}>
                            <td className="px-4 py-4">
                              <div className="flex min-w-56 items-center gap-3">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                                  {member.photo?.url ? (
                                    <img
                                      src={member.photo.url}
                                      alt={member.name || "Committee member"}
                                      className="h-full w-full object-contain"
                                    />
                                  ) : (
                                    <UserRound
                                      size={24}
                                      className="text-slate-300"
                                    />
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-slate-800">
                                    {member.name}
                                  </p>
                                  {member.designation && (
                                    <p className="mt-1 text-sm text-slate-500">
                                      {member.designation}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-slate-600">
                              {member.phone && <p>{member.phone}</p>}
                              {member.email && (
                                <p className="mt-1 break-all">{member.email}</p>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMove(section.value, index, -1)
                                  }
                                  disabled={index === 0 || movingId === member._id}
                                  aria-label={"Move " + member.name + " up"}
                                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                                >
                                  <ArrowUp size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMove(section.value, index, 1)
                                  }
                                  disabled={
                                    index === roleMembers.length - 1 ||
                                    movingId === member._id
                                  }
                                  aria-label={"Move " + member.name + " down"}
                                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
                                >
                                  <ArrowDown size={16} />
                                </button>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => openEdit(member)}
                                className="mr-2 inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                              >
                                <Pencil size={15} />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(member)}
                                className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                              >
                                <Trash2 size={15} />
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Committee Member"
        message={
          'Delete "' +
          (deleteTarget?.name || "this committee member") +
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

export default MonitoringCommitteePage;
