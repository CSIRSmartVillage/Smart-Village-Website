import { useState } from "react";

import MediaUploader from "../common/MediaUploader";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const defaultValues = {
  type: "NGO",
  name: "",
  link: "",
  logo: null,
  about: "",
};

const normalizeValues = (values = {}) => ({
  ...defaultValues,
  ...values,
  logo: values.logo || null,
});

const Field = ({
  label,
  error,
  required = false,
  children,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
      {required ? (
        <span className="text-red-500"> *</span>
      ) : null}
    </label>

    {children}

    {error ? (
      <p className="mt-1.5 text-sm text-red-600">
        {error}
      </p>
    ) : null}
  </div>
);

const isValidExternalLink = (value) => {
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

const SupporterForm = ({
  initialValues,
  onSubmit,
  loading = false,
}) => {
  const [values, setValues] = useState(() =>
    normalizeValues(initialValues)
  );
  const [errors, setErrors] = useState({});


  const updateField = (field, value) => {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!["NGO", "DONOR"].includes(values.type)) {
      nextErrors.type = "Select a supporter type.";
    }

    if (values.name.trim().length < 2) {
      nextErrors.name =
        "Supporter name must be at least 2 characters.";
    }

    if (!isValidExternalLink(values.link.trim())) {
      nextErrors.link =
        "Enter a complete http:// or https:// link.";
    }

    if (!values.logo?.url || !values.logo?.publicId) {
      nextErrors.logo = "Upload a supporter logo or image.";
    }

    if (values.about.trim().length < 10) {
      nextErrors.about =
        "About must be at least 10 characters.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validate()) return;

    const name = values.name.trim();

    onSubmit?.({
      type: values.type,
      name,
      link: values.link.trim(),
      logo: {
        url: values.logo.url,
        publicId: values.logo.publicId,
        alt: (values.logo.alt || name + " logo").slice(0, 200),
      },
      about: values.about.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      noValidate
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Supporter Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Supporter Type"
            error={errors.type}
            required
          >
            <select
              value={values.type}
              onChange={(event) =>
                updateField("type", event.target.value)
              }
              className={inputClass}
            >
              <option value="NGO">NGO</option>
              <option value="DONOR">Donor</option>
            </select>
          </Field>

          <Field
            label="Name"
            error={errors.name}
            required
          >
            <input
              type="text"
              value={values.name}
              onChange={(event) =>
                updateField("name", event.target.value)
              }
              className={inputClass}
              maxLength={200}
              placeholder="Enter organisation or supporter name"
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              label="Website / Link"
              error={errors.link}
              required
            >
              <input
                type="url"
                value={values.link}
                onChange={(event) =>
                  updateField("link", event.target.value)
                }
                className={inputClass}
                maxLength={2048}
                placeholder="https://www.example.org"
              />
            </Field>
          </div>

          <div className="md:col-span-2">
            <Field
              label="About"
              error={errors.about}
              required
            >
              <textarea
                value={values.about}
                onChange={(event) =>
                  updateField("about", event.target.value)
                }
                className={inputClass}
                rows={6}
                maxLength={3000}
                placeholder="Add a short description about the supporter."
              />
            </Field>
          </div>
        </div>
      </section>

      <section>
        <MediaUploader
          label="Logo / Image"
          value={values.logo}
          onChange={(logo) => updateField("logo", logo)}
          previewImageClassName="object-contain bg-white p-3"
        />

        {errors.logo ? (
          <p className="mt-2 text-sm text-red-600">
            {errors.logo}
          </p>
        ) : null}
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Supporter"}
        </button>
      </div>
    </form>
  );
};

export default SupporterForm;