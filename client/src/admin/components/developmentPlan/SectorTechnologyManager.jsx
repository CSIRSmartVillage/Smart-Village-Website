import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

import MediaUploader from "../common/MediaUploader";
import {
  createSector,
  updateSector,
  deleteSector,
  createTechnology,
  updateTechnology,
  deleteTechnology,
} from "../../services/developmentPlan.service";

const statusOptions = [
  "PLANNED",
  "IN_PROGRESS",
  "DEPLOYED",
  "COMPLETED",
  "ON_HOLD",
  "CANCELLED",
];

const emptySector = {
  title: "",
  description: "",
  order: 0,
};

const emptyTechnology = {
  labName: "",
  technologyName: "",
  description: "",
  image: null,
  progress: 0,
  showProgress: true,
  status: "PLANNED",
  order: 0,
};

const ProgressBar = ({ value = 0 }) => (
  <div className="flex items-center gap-3">
    <div className="h-2 w-32 overflow-hidden rounded-full bg-slate-200">
      <div
        className="h-full rounded-full bg-blue-600"
        style={{
          width: `${Math.min(Math.max(value, 0), 100)}%`,
        }}
      />
    </div>
    <span className="text-sm font-semibold text-slate-700">
      {value}%
    </span>
  </div>
);

const SectorModal = ({
  initialValue,
  onClose,
  onSubmit,
  saving,
}) => {
  const [values, setValues] = useState({
    ...emptySector,
    ...initialValue,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl"
      >
        <h3 className="text-xl font-semibold text-slate-800">
          {initialValue?._id ? "Edit Sector" : "Create Sector"}
        </h3>

        <div className="mt-6 space-y-4">
          <input
            value={values.title}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
            placeholder="Sector title"
            required
          />

          <textarea
            value={values.description}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
            placeholder="Description"
            rows={4}
          />

          <input
            type="number"
            value={values.order}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                order: Number(e.target.value),
              }))
            }
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5"
            placeholder="Display order"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Sector"}
          </button>
        </div>
      </form>
    </div>
  );
};

const TechnologyModal = ({
  initialValue,
  onClose,
  onSubmit,
  saving,
}) => {
  const modalRef = useRef(null);
  const firstInputRef = useRef(null);
  const [values, setValues] = useState({
    ...emptyTechnology,
    ...initialValue,
    showProgress: initialValue?.showProgress ?? true,
  });

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    firstInputRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (
        event.key !== "Tab" ||
        !modalRef.current
      ) {
        return;
      }

      const focusableElements = [
        ...modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ),
      ].filter(
        (element) =>
          !element.disabled &&
          element.getAttribute("aria-hidden") !==
            "true"
      );

      if (!focusableElements.length) {
        return;
      }

      const firstElement =
        focusableElements[0];
      const lastElement =
        focusableElements[
          focusableElements.length - 1
        ];

      if (
        event.shiftKey &&
        document.activeElement === firstElement
      ) {
        event.preventDefault();
        lastElement.focus();
      }

      if (
        !event.shiftKey &&
        document.activeElement === lastElement
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
      role="presentation"
    >
      <form
        ref={modalRef}
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-[95vw] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:w-[85vw] lg:max-w-[950px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="technology-modal-title"
      >
        <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
          <h3
            id="technology-modal-title"
            className="text-xl font-semibold text-slate-900"
          >
            {initialValue?._id
              ? "Edit Technology"
              : "Create Technology"}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Configure lab technology details for this development plan sector.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Lab Name
              </label>
              <input
                ref={firstInputRef}
                value={values.labName}
                onChange={(e) =>
                  handleChange("labName", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Lab Name"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Technology Name
              </label>
              <input
                value={values.technologyName}
                onChange={(e) =>
                  handleChange("technologyName", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Technology Name"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={values.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Description"
                rows={5}
              />
            </div>

            <div className="md:col-span-2">
              <MediaUploader
                label="Technology Image"
                value={values.image}
                onChange={(image) =>
                  handleChange("image", image)
                }
                className="border-blue-100 bg-blue-50/40 p-6"
                uploadAreaClassName="min-h-52 border-blue-200 shadow-inner hover:shadow-sm"
                previewImageClassName="h-44"
              />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label className="block text-sm font-medium text-slate-700">
                  Progress: {values.progress}%
                </label>
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={values.showProgress}
                    onChange={(e) =>
                      handleChange("showProgress", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Show
                </label>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={values.progress}
                  disabled={!values.showProgress}
                  onChange={(e) =>
                    handleChange(
                      "progress",
                      Number(e.target.value)
                    )
                  }
                  className="w-full accent-blue-600 disabled:opacity-40"
                />
                <p className="mt-2 text-xs text-slate-500">
                  Turn off Show to hide the progress bar on the village portal.
                </p>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                value={values.status}
                onChange={(e) =>
                  handleChange("status", e.target.value)
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {statusOptions.map((status) => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Sort Order
              </label>
              <input
                type="number"
                value={values.order}
                onChange={(e) =>
                  handleChange("order", Number(e.target.value))
                }
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Display Order"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] sm:px-8">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Technology"}
          </button>
        </div>
      </form>
    </div>
  );
};

const SectorTechnologyManager = ({
  plan,
  onPlanChange,
}) => {
  const queryClient = useQueryClient();
  const [openSectorId, setOpenSectorId] = useState(null);
  const [sectorModal, setSectorModal] = useState(null);
  const [technologyModal, setTechnologyModal] = useState(null);
  const [saving, setSaving] = useState(false);

  const applyPlanUpdate = (updated) => {
    onPlanChange(updated);
    queryClient.setQueryData(
      ["admin-development-plan", plan._id],
      updated
    );
    queryClient.setQueryData(
      ["admin-development-plans"],
      (current) =>
        current
          ? {
              ...current,
              plans: (current.plans || []).map((item) =>
                item._id === updated._id ? updated : item
              ),
            }
          : current
    );
  };

  const sectors = useMemo(
    () =>
      [...(plan.sectors || [])].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      ),
    [plan.sectors]
  );

  const saveSector = async (values) => {
    try {
      setSaving(true);
      const updated = values._id
        ? await updateSector(plan._id, values._id, values)
        : await createSector(plan._id, values);
      applyPlanUpdate(updated);
      setSectorModal(null);
    } catch (error) {
      console.error(error);
      alert("Failed to save sector.");
    } finally {
      setSaving(false);
    }
  };

  const removeSector = async (sectorId) => {
    if (!window.confirm("Delete this sector?")) return;

    try {
      const updated = await deleteSector(plan._id, sectorId);
      applyPlanUpdate(updated);
    } catch (error) {
      console.error(error);
      alert("Failed to delete sector.");
    }
  };

  const saveTechnology = async (values) => {
    try {
      setSaving(true);
      const { sectorId, ...payload } = values;
      const updated = payload._id
        ? await updateTechnology(
            plan._id,
            sectorId,
            payload._id,
            payload
          )
        : await createTechnology(plan._id, sectorId, payload);

      applyPlanUpdate(updated);
      setTechnologyModal(null);
      setOpenSectorId(sectorId);
    } catch (error) {
      console.error(error);
      alert("Failed to save technology.");
    } finally {
      setSaving(false);
    }
  };

  const removeTechnology = async (
    sectorId,
    technologyId
  ) => {
    if (!window.confirm("Delete this technology?")) return;

    try {
      const updated = await deleteTechnology(
        plan._id,
        sectorId,
        technologyId
      );
      applyPlanUpdate(updated);
      setOpenSectorId(sectorId);
    } catch (error) {
      console.error(error);
      alert("Failed to delete technology.");
    }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">
            Sectors & Technologies
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage CSIR sector deployments and lab technologies.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSectorModal(emptySector)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          Create Sector
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {sectors.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No sectors added yet.
          </div>
        ) : (
          sectors.map((sector) => {
            const isOpen = openSectorId === sector._id;
            const technologies = [
              ...(sector.technologies || []),
            ].sort(
              (a, b) => (a.order || 0) - (b.order || 0)
            );

            return (
              <div
                key={sector._id}
                className="overflow-hidden rounded-xl border border-slate-200"
              >
                <div className="flex flex-col gap-4 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenSectorId(isOpen ? null : sector._id)
                    }
                    className="flex items-center gap-3 text-left"
                  >
                    {isOpen ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <span>
                      <span className="block font-semibold text-slate-800">
                        {sector.title}
                      </span>
                      <span className="text-sm text-slate-500">
                        Order {sector.order || 0} · {technologies.length} technologies
                      </span>
                    </span>
                  </button>

                  <div className="flex flex-wrap items-center gap-3">
                    {sector.showProgress !== false && (
                      <ProgressBar value={sector.progress || 0} />
                    )}

                    <button
                      type="button"
                      onClick={() => setSectorModal(sector)}
                      className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      title="Edit sector"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => removeSector(sector._id)}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                      title="Delete sector"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-sm text-slate-600">
                        {sector.description || "No description"}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setTechnologyModal({
                            ...emptyTechnology,
                            sectorId: sector._id,
                          })
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                      >
                        <Plus size={14} />
                        Add Technology
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead className="bg-slate-100 text-slate-600">
                          <tr>
                            <th className="px-4 py-3 text-left">Lab</th>
                            <th className="px-4 py-3 text-left">Technology</th>
                            <th className="px-4 py-3 text-left">Status</th>
                            <th className="px-4 py-3 text-left">Progress</th>
                            <th className="px-4 py-3 text-left">Order</th>
                            <th className="px-4 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {technologies.map((technology) => (
                            <tr
                              key={technology._id}
                              className="border-b"
                            >
                              <td className="px-4 py-3 font-medium">
                                {technology.labName}
                              </td>
                              <td className="px-4 py-3">
                                {technology.technologyName}
                              </td>
                              <td className="px-4 py-3">
                                {technology.status?.replaceAll("_", " ")}
                              </td>
                              <td className="px-4 py-3">
                                {technology.showProgress === false ? (
                                  <span className="text-sm text-slate-400">
                                    Hidden
                                  </span>
                                ) : (
                                  <ProgressBar
                                    value={technology.progress || 0}
                                  />
                                )}
                              </td>
                              <td className="px-4 py-3">
                                {technology.order || 0}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setTechnologyModal({
                                        ...technology,
                                        sectorId: sector._id,
                                      })
                                    }
                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                    title="Edit technology"
                                  >
                                    <Pencil size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeTechnology(
                                        sector._id,
                                        technology._id
                                      )
                                    }
                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    title="Delete technology"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {technologies.length === 0 && (
                        <div className="rounded-b-lg border border-t-0 border-slate-200 p-6 text-center text-slate-500">
                          No technologies in this sector.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {sectorModal && (
        <SectorModal
          initialValue={sectorModal}
          onClose={() => setSectorModal(null)}
          onSubmit={saveSector}
          saving={saving}
        />
      )}

      {technologyModal && (
        <TechnologyModal
          initialValue={technologyModal}
          onClose={() => setTechnologyModal(null)}
          onSubmit={saveTechnology}
          saving={saving}
        />
      )}
    </section>
  );
};

export default SectorTechnologyManager;
