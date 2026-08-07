import { useEffect, useMemo, useState } from "react";
import { Loader2, MapPinned, X } from "lucide-react";
import toast from "react-hot-toast";

import MediaUploader from "../common/MediaUploader";
import { createVillage } from "../../services/village.service";
import { createVillageProfile } from "../../services/villageProfile.service";
import { createVillageLocation } from "../../services/villageLocation.service";

const EMPTY_FORM = {
  name: "",
  state: "",
  district: "",
  block: "",
  gramPanchayat: "",
  pinCode: "",
  latitude: "",
  longitude: "",
  shortDescription: "",
  coverImage: null,
  isActive: true,
};

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const getErrorMessage = (error) =>
  error?.response?.data?.error?.message ||
  error?.response?.data?.message ||
  "Unable to create the village. Please try again.";

const FieldError = ({ children }) =>
  children ? (
    <p className="mt-1 text-xs font-medium text-red-600">{children}</p>
  ) : null;

export default function AddVillageModal({
  open,
  states,
  villages,
  onClose,
  onCreated,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const selectedState = useMemo(
    () => states.find((state) => state._id === form.state),
    [form.state, states]
  );

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        setForm(EMPTY_FORM);
        setErrors({});
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, open, saving]);

  if (!open) return null;

  const closeAndReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    onClose();
  };

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};
    const normalizedName = form.name.trim().toLocaleLowerCase();

    if (form.name.trim().length < 2) {
      nextErrors.name = "Village name is required.";
    }
    if (!form.state) nextErrors.state = "State is required.";
    if (form.district.trim().length < 2) {
      nextErrors.district = "District is required.";
    }
    if (
      villages.some(
        (village) =>
          village.name?.en?.trim().toLocaleLowerCase() === normalizedName
      )
    ) {
      nextErrors.name = "A village with this name already exists.";
    }
    if (form.pinCode && !/^\d{6}$/.test(form.pinCode)) {
      nextErrors.pinCode = "Enter a valid 6-digit PIN code.";
    }

    const hasLatitude = form.latitude !== "";
    const hasLongitude = form.longitude !== "";
    if (hasLatitude !== hasLongitude) {
      nextErrors.coordinates =
        "Enter both latitude and longitude, or leave both blank.";
    } else if (hasLatitude) {
      const latitude = Number(form.latitude);
      const longitude = Number(form.longitude);
      if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
        nextErrors.latitude = "Latitude must be between -90 and 90.";
      }
      if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
        nextErrors.longitude = "Longitude must be between -180 and 180.";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving || !validate()) return;

    const name = form.name.trim();
    const slugBase = slugify(name) || "village";
    const existingSlugs = new Set(
      villages.map((village) => village.slug).filter(Boolean)
    );
    const slug = existingSlugs.has(slugBase)
      ? slugBase + "-" + Date.now().toString(36).slice(-6)
      : slugBase;
    const stateCode = selectedState?.code || "VLG";
    const villageCode = (stateCode + "-" + slug).toUpperCase().slice(0, 50);
    const coverImageId = form.coverImage?._id || form.coverImage?.id || null;
    const isPublished = form.isActive;

    const payload = {
      state: form.state,
      name: { en: name, regional: "" },
      slug,
      villageCode,
      district: form.district.trim(),
      block: form.block.trim(),
      gramPanchayat: form.gramPanchayat.trim(),
      pinCode: form.pinCode.trim(),
      coverImage: coverImageId,
      status: form.isActive ? "ACTIVE" : "INACTIVE",
      isPublished,
    };

    if (form.latitude !== "" && form.longitude !== "") {
      payload.location = {
        type: "Point",
        coordinates: [Number(form.longitude), Number(form.latitude)],
      };
    }

    try {
      setSaving(true);
      const village = await createVillage(payload);

      // Singleton modules get real empty records. Collection modules are empty
      // by design and become editable via the shared village selector.
      const moduleResults = await Promise.allSettled([
        createVillageProfile({
          village: village._id,
          heroTitle: name,
          heroImage: coverImageId,
          overview: form.shortDescription.trim(),
          aboutHeading: "About Village",
          galleryImages: [],
          contactPersons: [],
          isPublished,
        }),
        createVillageLocation({
          village: village._id,
          overview: "",
          zoomLevel: 15,
          googleMapsLink: "",
          nearbyFacilities: [],
          isPublished,
        }),
      ]);

      onCreated(village);
      closeAndReset();

      const failedModules = moduleResults.filter(
        (result) => result.status === "rejected"
      ).length;
      if (failedModules) {
        toast.success(
          name +
            " was created. " +
            failedModules +
            " empty module record" +
            (failedModules > 1 ? "s" : "") +
            " can be added later."
        );
      } else {
        toast.success(name + " was created and is ready for content.");
      }
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";
  const labelClass = "text-sm font-semibold text-slate-700";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-village-title"
    >
      <div className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MapPinned size={21} />
            </span>
            <div>
              <h2
                id="add-village-title"
                className="text-xl font-bold text-slate-950"
              >
                Add Village
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Create the village now; add detailed module content later.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeAndReset}
            disabled={saving}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close add village form"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="max-h-[calc(92vh-73px)] overflow-y-auto"
        >
          <div className="space-y-6 p-5 sm:p-6">
            <section>
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Required information
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className={labelClass + " sm:col-span-2"}>
                  Village Name <span className="text-red-600">*</span>
                  <input
                    autoFocus
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    className={inputClass}
                    placeholder="Enter village name"
                    maxLength={100}
                  />
                  <FieldError>{errors.name}</FieldError>
                </label>
                <label className={labelClass}>
                  State <span className="text-red-600">*</span>
                  <select
                    value={form.state}
                    onChange={(event) =>
                      updateField("state", event.target.value)
                    }
                    className={inputClass}
                  >
                    <option value="">Select state</option>
                    {states.map((state) => (
                      <option key={state._id} value={state._id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  <FieldError>{errors.state}</FieldError>
                </label>
                <label className={labelClass}>
                  District <span className="text-red-600">*</span>
                  <input
                    value={form.district}
                    onChange={(event) =>
                      updateField("district", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter district"
                  />
                  <FieldError>{errors.district}</FieldError>
                </label>
              </div>
            </section>

            <section className="border-t border-slate-200 pt-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
                Optional details
              </h3>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Block / Tehsil
                  <input
                    value={form.block}
                    onChange={(event) =>
                      updateField("block", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter block or tehsil"
                  />
                </label>
                <label className={labelClass}>
                  Gram Panchayat
                  <input
                    value={form.gramPanchayat}
                    onChange={(event) =>
                      updateField("gramPanchayat", event.target.value)
                    }
                    className={inputClass}
                    placeholder="Enter gram panchayat"
                  />
                </label>
                <label className={labelClass}>
                  PIN Code
                  <input
                    inputMode="numeric"
                    value={form.pinCode}
                    onChange={(event) =>
                      updateField(
                        "pinCode",
                        event.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className={inputClass}
                    placeholder="6-digit PIN code"
                  />
                  <FieldError>{errors.pinCode}</FieldError>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={labelClass}>
                    Latitude
                    <input
                      type="number"
                      step="any"
                      value={form.latitude}
                      onChange={(event) =>
                        updateField("latitude", event.target.value)
                      }
                      className={inputClass}
                      placeholder="e.g. 28.61"
                    />
                    <FieldError>{errors.latitude}</FieldError>
                  </label>
                  <label className={labelClass}>
                    Longitude
                    <input
                      type="number"
                      step="any"
                      value={form.longitude}
                      onChange={(event) =>
                        updateField("longitude", event.target.value)
                      }
                      className={inputClass}
                      placeholder="e.g. 77.21"
                    />
                    <FieldError>{errors.longitude}</FieldError>
                  </label>
                  <div className="col-span-2">
                    <FieldError>{errors.coordinates}</FieldError>
                  </div>
                </div>
                <label className={labelClass + " sm:col-span-2"}>
                  Short Description
                  <textarea
                    value={form.shortDescription}
                    onChange={(event) =>
                      updateField("shortDescription", event.target.value)
                    }
                    className={inputClass + " min-h-24 resize-y"}
                    placeholder="Add a brief introduction (can also be completed later)"
                    maxLength={1000}
                  />
                </label>
                <div className="sm:col-span-2">
                  <MediaUploader
                    label="Cover Image (Optional)"
                    value={form.coverImage}
                    onChange={(media) => updateField("coverImage", media)}
                    className="p-4"
                    uploadAreaClassName="p-6"
                    previewImageClassName="h-24"
                  />
                </div>
                <label className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                  <span>
                    <span className="block text-sm font-semibold text-slate-800">
                      Active village
                    </span>
                    <span className="mt-0.5 block text-xs text-slate-500">
                      Inactive villages stay saved but are not published publicly.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(event) =>
                      updateField("isActive", event.target.checked)
                    }
                    className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              </div>
            </section>
          </div>

          <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <button
              type="button"
              onClick={closeAndReset}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || states.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving && <Loader2 size={17} className="animate-spin" />}
              {saving ? "Creating Village..." : "Create Village"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
