import {
  useEffect,
  useState,
} from "react";

import {
  getAllMedia,
} from "../../services/media.service";

const normalizeList = (value) => {
  if (Array.isArray(value)) {
    return value.length > 0 ? value : [""];
  }

  if (!value) {
    return [""];
  }

  return String(value)
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split(/\s*(?:\n|(?=\d+[\).]\s*)|(?=\u2022\s*)|(?=-\s+))\s*/)
    .map((item) =>
      item
        .replace(/^\d+[\).]\s*/, "")
        .replace(/^[\u2022-]\s*/, "")
        .trim()
    )
    .filter(Boolean);
};

const LaboratoryForm = ({
  initialValues,
  onSubmit,
}) => {
  const [formData, setFormData] =
    useState({
      ...initialValues,
      researchAreas: normalizeList(
        initialValues.researchAreas
      ),
      contributions: normalizeList(
        initialValues.contributions
      ),
    });

  const [media, setMedia] =
    useState([]);

  useEffect(() => {
    const loadMedia = async () => {
      const data = await getAllMedia();

      setMedia(data);
    };

    loadMedia();
  }, []);

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      ...formData,
      researchAreas:
        normalizeList(
          formData.researchAreas
        ).filter(Boolean),
      contributions:
        normalizeList(
          formData.contributions
        ).filter(Boolean),
    });
  };

  const updateListItem = (
    field,
    index,
    value
  ) => {
    const updated = [
      ...(formData[field] || []),
    ];

    updated[index] = value;

    setFormData({
      ...formData,
      [field]: updated,
    });
  };

  const addListItem = (field) => {
    setFormData({
      ...formData,
      [field]: [
        ...(formData[field] || []),
        "",
      ],
    });
  };

  const removeListItem = (
    field,
    index
  ) => {
    const updated =
      (formData[field] || []).filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

    setFormData({
      ...formData,
      [field]:
        updated.length > 0
          ? updated
          : [""],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <input
        name="name"
        placeholder="Laboratory Name"
        value={formData.name}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="slug"
        placeholder="Slug"
        value={formData.slug}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      >
        <option value="">
          Select Type
        </option>
        <option value="NODAL">
          Nodal
        </option>
        <option value="PARTICIPATING">
          Participating
        </option>
      </select>

      <div>
        <label className="block mb-2">
          Hero Image
        </label>

        <select
          name="heroImage"
          value={formData.heroImage || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="">
            Select Image
          </option>

          {media
            .filter(
              (item) =>
                item.resourceType ===
                "image"
            )
            .map((item) => (
              <option
                key={item._id}
                value={item._id}
              >
                {item.originalName}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="directorName"
          className="mb-2 block font-medium text-slate-700"
        >
          Director Name
        </label>
        <input
          id="directorName"
          name="directorName"
          placeholder="Enter director name"
          value={formData.directorName || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
        <p className="mt-1 text-sm text-slate-500">
          Shown as Director: [Director Name] in Contact Information.
        </p>
      </div>

      <textarea
        name="overview"
        placeholder="Overview"
        rows="5"
        value={formData.overview}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <ListField
        title="Research Areas"
        helper="Add one research area per row. Commas are allowed inside a row."
        items={formData.researchAreas || [""]}
        placeholder="Research on safer, stronger, and more sustainable structures"
        onChange={(index, value) =>
          updateListItem(
            "researchAreas",
            index,
            value
          )
        }
        onAdd={() =>
          addListItem("researchAreas")
        }
        onRemove={(index) =>
          removeListItem(
            "researchAreas",
            index
          )
        }
      />

      <ListField
        title="Key Contributions"
        helper="Add each contribution as a separate point. Commas are allowed inside a point."
        items={formData.contributions || [""]}
        placeholder="Leads planning, coordination, and implementation"
        onChange={(index, value) =>
          updateListItem(
            "contributions",
            index,
            value
          )
        }
        onAdd={() =>
          addListItem("contributions")
        }
        onRemove={(index) =>
          removeListItem(
            "contributions",
            index
          )
        }
      />

      <textarea
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
        rows={4}
        className="w-full border p-3 rounded"
      />

      <input
        name="phone"
        placeholder="Phone"
        value={formData.phone}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        name="website"
        placeholder="Website"
        value={formData.website}
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.isPublished || false}
          onChange={(e) =>
            setFormData({
              ...formData,
              isPublished:
                e.target.checked,
            })
          }
        />
        Published
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Save Laboratory
      </button>
    </form>
  );
};

const ListField = ({
  title,
  helper,
  items,
  placeholder,
  onChange,
  onAdd,
  onRemove,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4">
      <label className="block font-semibold text-slate-900">
        {title}
      </label>
      <p className="mt-1 text-sm text-slate-500">
        {helper}
      </p>
    </div>

    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex gap-3"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
            {index + 1}
          </div>

          <input
            type="text"
            value={item || ""}
            placeholder={placeholder}
            onChange={(e) =>
              onChange(
                index,
                e.target.value
              )
            }
            className="w-full border p-3 rounded"
          />

          <button
            type="button"
            onClick={() =>
              onRemove(index)
            }
            className="rounded border border-red-200 px-4 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      ))}
    </div>

    <button
      type="button"
      onClick={onAdd}
      className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
    >
      Add {title.slice(0, -1)}
    </button>
  </div>
);

export default LaboratoryForm;
