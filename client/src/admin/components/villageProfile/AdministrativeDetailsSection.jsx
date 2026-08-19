import { getUserFriendlyError } from "../../../utils/userFriendlyError";
import { useState } from "react";
import { Pencil } from "lucide-react";

const coordinateConfig = {
  latitude: {
    label: "Latitude",
    min: -90,
    max: 90,
    index: 1,
  },
  longitude: {
    label: "Longitude",
    min: -180,
    max: 180,
    index: 0,
  },
};

export default function AdministrativeDetailsSection({
  details,
  states,
  onChange,
  coordinates = [],
  onCoordinateSave,
}) {
  const inputClass = "w-full rounded-md border px-3 py-2";
  const [editingCoordinate, setEditingCoordinate] = useState(null);
  const [coordinateValue, setCoordinateValue] = useState("");
  const [coordinateError, setCoordinateError] = useState("");
  const [savingCoordinate, setSavingCoordinate] = useState(false);

  const startCoordinateEdit = (field) => {
    const { index } = coordinateConfig[field];

    setEditingCoordinate(field);
    setCoordinateValue(String(coordinates[index] ?? ""));
    setCoordinateError("");
  };

  const cancelCoordinateEdit = () => {
    setEditingCoordinate(null);
    setCoordinateValue("");
    setCoordinateError("");
  };

  const saveCoordinate = async () => {
    const config = coordinateConfig[editingCoordinate];
    const trimmedValue = coordinateValue.trim();
    const numericValue = Number(trimmedValue);

    if (
      trimmedValue === "" ||
      !Number.isFinite(numericValue) ||
      numericValue < config.min ||
      numericValue > config.max
    ) {
      setCoordinateError(
        `${config.label} must be between ${config.min} and ${config.max}.`
      );
      return;
    }

    try {
      setSavingCoordinate(true);
      setCoordinateError("");
      await onCoordinateSave(editingCoordinate, numericValue);
      cancelCoordinateEdit();
    } catch (error) {
      setCoordinateError(
        getUserFriendlyError(
          error,
          `Unable to update ${config.label.toLowerCase()}. Please try again.`
        )
      );
    } finally {
      setSavingCoordinate(false);
    }
  };

  const handleCoordinateKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      saveCoordinate();
    }

    if (event.key === "Escape") {
      event.preventDefault();
      cancelCoordinateEdit();
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Village Administrative Details
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            State
          </label>
          <select
            name="state"
            value={details.state}
            onChange={onChange}
            className={inputClass}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            District
          </label>
          <input
            type="text"
            name="district"
            value={details.district}
            onChange={onChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Block
          </label>
          <input
            type="text"
            name="block"
            value={details.block}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gram Panchayat
          </label>
          <input
            type="text"
            name="gramPanchayat"
            value={details.gramPanchayat}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        {Object.entries(coordinateConfig).map(([field, config]) => {
          const isEditing = editingCoordinate === field;
          const value = coordinates[config.index];

          return (
            <div key={field}>
              {isEditing ? (
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium">
                      {config.label}:
                    </span>
                    <input
                      type="number"
                      min={config.min}
                      max={config.max}
                      step="any"
                      value={coordinateValue}
                      onChange={(event) => {
                        setCoordinateValue(event.target.value);
                        setCoordinateError("");
                      }}
                      onKeyDown={handleCoordinateKeyDown}
                      aria-label={`Edit ${field}`}
                      className="w-40 rounded-md border px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={saveCoordinate}
                      disabled={savingCoordinate}
                      className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                    >
                      {savingCoordinate ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelCoordinateEdit}
                      disabled={savingCoordinate}
                      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                  {coordinateError ? (
                    <p className="mt-1.5 text-sm text-red-600">
                      {coordinateError}
                    </p>
                  ) : null}
                </div>
              ) : (
                <div className="flex min-h-10 items-center gap-2 text-slate-700">
                  <span className="text-sm font-medium text-slate-900">
                    {config.label}:
                  </span>
                  <span>{value ?? "Not set"}</span>
                  <button
                    type="button"
                    onClick={() => startCoordinateEdit(field)}
                    disabled={Boolean(editingCoordinate)}
                    aria-label={`Edit ${field}`}
                    title={`Edit ${config.label.toLowerCase()}`}
                    className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Pencil size={14} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}