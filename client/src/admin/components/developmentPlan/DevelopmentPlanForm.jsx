import { useEffect, useState } from "react";

import { getAllVillages } from "../../services/village.service";

const defaultValues = {
  village: "",
  title: "",
  description: "",
  isPublished: true,
};

const normalizeValues = (data = {}) => ({
  village: data.village?._id ?? data.village ?? "",
  title: data.title ?? "",
  description: data.description ?? "",
  isPublished: data.isPublished ?? true,
});

const DevelopmentPlanForm = ({
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const [values, setValues] = useState(() =>
    normalizeValues(initialValues)
  );
  const [villages, setVillages] = useState([]);
  const [villagesLoading, setVillagesLoading] =
    useState(true);

  useEffect(() => {
    const loadVillages = async () => {
      try {
        const data = await getAllVillages();
        setVillages(data);
      } catch (error) {
        console.error(error);
        alert("Failed to load villages.");
      } finally {
        setVillagesLoading(false);
      }
    };

    loadVillages();
  }, []);

  const handleChange = (field, value) => {
    setValues((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      village,
      title,
      description,
      isPublished,
    } = values;

    onSubmit?.({
      village,
      title,
      description,
      isPublished,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Development Plan
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Configure the village-level CSIR technology deployment plan.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Village
            </label>

            <select
              value={values.village}
              onChange={(e) =>
                handleChange("village", e.target.value)
              }
              disabled={villagesLoading}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">
                {villagesLoading
                  ? "Loading villages..."
                  : "Select village"}
              </option>

              {villages.map((village) => (
                <option
                  key={village._id}
                  value={village._id}
                >
                  {village.name?.en || village.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Title
            </label>

            <input
              type="text"
              value={values.title}
              onChange={(e) =>
                handleChange("title", e.target.value)
              }
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="CSIR Technology Deployment Plan"
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
              rows={5}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Describe the technology deployment goals for this village."
              required
            />
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) =>
                handleChange("isPublished", e.target.checked)
              }
              className="h-4 w-4 rounded border-slate-300"
            />

            <span>
              <span className="block font-medium text-slate-800">
                Published
              </span>
              <span className="text-sm text-slate-500">
                Show this development plan on the public portal.
              </span>
            </span>
          </label>
        </div>
      </section>

      <div className="flex justify-end gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Development Plan"}
        </button>
      </div>
    </form>
  );
};

export default DevelopmentPlanForm;
