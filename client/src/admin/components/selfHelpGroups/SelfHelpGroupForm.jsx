import { useEffect, useState } from "react";
import { Plus, Trash2, Users } from "lucide-react";

import MediaUploader from "../common/MediaUploader";
import { getAllVillages } from "../../services/village.service";

const inputClass =
  "w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const defaultMember = () => ({
  _clientKey: `member-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`,
  name: "",
  role: "",
  mobileNumber: "",
  email: "",
  address: "",
});

const defaultValues = {
  groupName: "",
  village: "",
  description: "",
  featuredImage: null,
  isPublished: true,
  displayOrder: 0,
  leader: {
    name: "",
    designation: "",
    mobileNumber: "",
    email: "",
    address: "",
  },
  members: [],
  slug: "",
  status: "PUBLISHED",
};

const normalizeValues = (data = {}) => ({
  ...defaultValues,
  ...data,
  village: data.village?._id ?? data.village ?? "",
  featuredImage: data.featuredImage ?? null,
  isPublished: data.isPublished ?? true,
  displayOrder: data.displayOrder ?? 0,
  leader: {
    ...defaultValues.leader,
    ...(data.leader ?? {}),
  },
  members: Array.isArray(data.members)
    ? data.members.map((member) => ({
        ...defaultMember(),
        ...member,
      }))
    : [],
  slug: data.slug ?? "",
  status: data.status ?? "PUBLISHED",
});

const Field = ({
  label,
  children,
  required = false,
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-700">
      {label}
      {required ? (
        <span className="text-red-500"> *</span>
      ) : null}
    </label>
    {children}
  </div>
);

const SelfHelpGroupForm = ({
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
    setValues(normalizeValues(initialValues));
  }, [initialValues]);

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

  const handleNestedChange = (
    section,
    field,
    value
  ) => {
    setValues((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const addMember = () => {
    setValues((prev) => ({
      ...prev,
      members: [
        ...prev.members,
        defaultMember(),
      ],
    }));
  };

  const updateMember = (index, field, value) => {
    setValues((prev) => ({
      ...prev,
      members: prev.members.map((member, memberIndex) =>
        memberIndex === index
          ? {
              ...member,
              [field]: value,
            }
          : member
      ),
    }));
  };

  const removeMember = (index) => {
    setValues((prev) => ({
      ...prev,
      members: prev.members.filter(
        (_, memberIndex) => memberIndex !== index
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit?.({
      ...values,
      displayOrder: Number(
        values.displayOrder || 0
      ),
      slug: values.slug || undefined,
      members: values.members
        .filter((member) =>
          [
            member.name,
            member.role,
            member.mobileNumber,
            member.email,
            member.address,
          ].some(Boolean)
        )
        .map((member) => ({
          name: member.name,
          role: member.role,
          mobileNumber: member.mobileNumber,
          email: member.email,
          address: member.address,
        })),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Basic Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Group Name" required>
            <input
              type="text"
              value={values.groupName}
              onChange={(e) =>
                handleChange("groupName", e.target.value)
              }
              className={inputClass}
              placeholder="Enter SHG name"
              required
            />
          </Field>

          <Field label="Village" required>
            <select
              value={values.village}
              onChange={(e) =>
                handleChange("village", e.target.value)
              }
              disabled={villagesLoading}
              className={inputClass}
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
          </Field>

          <div className="md:col-span-2">
            <Field label="Description" required>
              <textarea
                value={values.description}
                onChange={(e) =>
                  handleChange(
                    "description",
                    e.target.value
                  )
                }
                rows={6}
                className={inputClass}
                placeholder="Describe the group, activities, livelihood work, and community impact."
                required
              />
            </Field>
          </div>

          <Field label="Display Order">
            <input
              type="number"
              value={values.displayOrder}
              onChange={(e) =>
                handleChange(
                  "displayOrder",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Status">
            <select
              value={values.status}
              onChange={(e) =>
                handleChange("status", e.target.value)
              }
              className={inputClass}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </Field>

          <Field label="Slug">
            <input
              type="text"
              value={values.slug}
              onChange={(e) =>
                handleChange("slug", e.target.value)
              }
              className={inputClass}
              placeholder="Auto-generated if empty"
            />
          </Field>

          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4">
            <input
              type="checkbox"
              checked={values.isPublished}
              onChange={(e) =>
                handleChange(
                  "isPublished",
                  e.target.checked
                )
              }
              className="h-4 w-4 rounded border-slate-300"
            />

            <span>
              <span className="block font-medium text-slate-800">
                Published
              </span>
              <span className="text-sm text-slate-500">
                Show this SHG publicly.
              </span>
            </span>
          </label>
        </div>
      </section>

      <section>
        <MediaUploader
          label="Featured Image"
          value={values.featuredImage}
          onChange={(media) =>
            handleChange("featuredImage", media)
          }
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-800">
          Leader Information
        </h2>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field label="Leader Name" required>
            <input
              type="text"
              value={values.leader.name}
              onChange={(e) =>
                handleNestedChange(
                  "leader",
                  "name",
                  e.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>

          <Field label="Designation">
            <input
              type="text"
              value={values.leader.designation}
              onChange={(e) =>
                handleNestedChange(
                  "leader",
                  "designation",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <Field label="Mobile Number" required>
            <input
              type="tel"
              value={values.leader.mobileNumber}
              onChange={(e) =>
                handleNestedChange(
                  "leader",
                  "mobileNumber",
                  e.target.value
                )
              }
              className={inputClass}
              required
            />
          </Field>

          <Field label="Email">
            <input
              type="email"
              value={values.leader.email}
              onChange={(e) =>
                handleNestedChange(
                  "leader",
                  "email",
                  e.target.value
                )
              }
              className={inputClass}
            />
          </Field>

          <div className="md:col-span-2">
            <Field label="Address" required>
              <textarea
                value={values.leader.address}
                onChange={(e) =>
                  handleNestedChange(
                    "leader",
                    "address",
                    e.target.value
                  )
                }
                rows={3}
                className={inputClass}
                required
              />
            </Field>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
              <Users size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Members
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Add SHG members and their contact details.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={addMember}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Member
          </button>
        </div>

        {values.members.length === 0 ? (
          <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No members added.
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {values.members.map((member, index) => (
              <div
                key={member._clientKey}
                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Member {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Name" required>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        updateMember(
                          index,
                          "name",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Role" required>
                    <input
                      type="text"
                      value={member.role}
                      onChange={(e) =>
                        updateMember(
                          index,
                          "role",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Mobile Number" required>
                    <input
                      type="tel"
                      value={member.mobileNumber}
                      onChange={(e) =>
                        updateMember(
                          index,
                          "mobileNumber",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Email">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) =>
                        updateMember(
                          index,
                          "email",
                          e.target.value
                        )
                      }
                      className={inputClass}
                    />
                  </Field>

                  <div className="md:col-span-2">
                    <Field label="Address">
                      <textarea
                        value={member.address}
                        onChange={(e) =>
                          updateMember(
                            index,
                            "address",
                            e.target.value
                          )
                        }
                        rows={2}
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Self Help Group"}
        </button>
      </div>
    </form>
  );
};

export default SelfHelpGroupForm;
