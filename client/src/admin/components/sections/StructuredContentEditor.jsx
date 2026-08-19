import { getUserFriendlyError } from "../../../utils/userFriendlyError";
import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { uploadMedia } from "../../services/media.service";
import { getSectionFieldPolicy } from "./sectionFieldPolicies";

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const arrayTemplates = {
  cards: { title: "", description: "" },
  features: { title: "", description: "" },
  objectives: { title: "", description: "" },
  stats: { label: "", value: 0, suffix: "" },
  timeline: { year: "", title: "", description: "" },
  links: { title: "", description: "", path: "" },
  updates: { title: "", date: "", description: "" },
  policies: { title: "", category: "", description: "" },
  villages: { name: "", district: "", state: "", slug: "" },
};

const isObject = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const humanize = (key) =>
  String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const singularize = (label) =>
  /ies$/i.test(label)
    ? label.replace(/ies$/i, "y")
    : label.replace(/s$/i, "");

const isLongText = (key, value) =>
  /(description|body|overview|content|message|summary|biography|bio|details|text)/i.test(
    key
  ) || String(value).length > 120;

const isImageKey = (key) =>
  /(image|photo|logo|thumbnail|gallery)/i.test(key) &&
  !/(alt|caption|title|description)$/i.test(key);

const isImageArrayKey = (key) => /(images|gallery|photos)/i.test(key);

const inputType = (key) => {
  if (/(^|_)(date|day)$|date$|publishedAt|eventDate/i.test(key)) return "date";
  if (/email/i.test(key)) return "email";
  if (/phone|mobile|telephone/i.test(key)) return "tel";
  if (/(url|link|website)/i.test(key)) return "url";
  return "text";
};

const isSettingsKey = (key, value) =>
  typeof value === "boolean" ||
  /(visible|enabled|active|autoplay|interval|speed|order|limit|layout|align|theme|color|style)/i.test(key);


const blankShape = (value) => {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (value === null) return null;
  if (Array.isArray(value)) return [];
  if (!isObject(value)) return null;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, blankShape(child)])
  );
};

const objectArrayTemplate = (key, sectionType) => {
  if (key === "items" && sectionType === "OBJECTIVES_FOCUS_AREAS") {
    return { title: "", description: "" };
  }

  return arrayTemplates[key.toLowerCase()];
};

const imageUrl = (value, media) => {
  if (typeof value === "string") {
    if (/^(https?:)?\/\//i.test(value)) return value;
    return media.find((item) => String(item._id) === value)?.url || "";
  }

  if (!isObject(value)) return "";

  return (
    value.imageUrl ||
    value.url ||
    value.secureUrl ||
    media.find(
      (item) => String(item._id) === String(value._id || value.id)
    )?.url ||
    ""
  );
};

const encodeImage = (item, sample, key, arrayValue = false) => {
  if (isObject(sample)) {
    if (Object.prototype.hasOwnProperty.call(sample, "imageUrl")) {
      return { ...sample, imageUrl: item.url };
    }
    return { ...sample, url: item.url };
  }

  const normalizedKey = key.toLowerCase();
  if (normalizedKey === "heroimage" || normalizedKey === "heroimages") {
    return item._id;
  }
  if (arrayValue && normalizedKey === "images") {
    return { imageUrl: item.url };
  }
  return item.url;
};

const reorder = (items, from, to) => {
  if (to < 0 || to >= items.length) return items;
  const updated = [...items];
  const [item] = updated.splice(from, 1);
  updated.splice(to, 0, item);
  return updated;
};

const FieldShell = ({ label, hint, children }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-slate-700">{label}</label>
    {hint && <p className="text-xs text-slate-500">{hint}</p>}
    {children}
  </div>
);


const EditorPanel = ({ title, description, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-5">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

const EmptyContent = () => (
  <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
    There is no editable content in this section.
  </p>
);

const UploadButton = ({ multiple = false, uploading, inputRef }) => (
  <button
    type="button"
    onClick={() => inputRef.current?.click()}
    disabled={uploading}
    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
  >
    {uploading ? (
      <Loader2 className="animate-spin" size={16} />
    ) : (
      <ImagePlus size={16} />
    )}
    Upload {multiple ? "images" : "image"}
  </button>
);

const MediaSelect = ({ media, label, onSelect }) => (
  <select
    className={fieldClass}
    value=""
    onChange={(event) => {
      const selected = media.find(
        (item) => String(item._id) === event.target.value
      );
      if (selected) onSelect(selected);
    }}
  >
    <option value="">{label}</option>
    {media.map((item) => (
      <option key={item._id} value={item._id}>
        {item.originalName}
      </option>
    ))}
  </select>
);

const ImageField = ({ fieldKey, label, value, media, onChange, onMediaUploaded }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setError("");
      const uploaded = await uploadMedia(file);
      onMediaUploaded(uploaded);
      onChange(encodeImage(uploaded, value, fieldKey));
    } catch (uploadError) {
      setError(
        getUserFriendlyError(uploadError, { action: "upload", fallback: "Unable to upload the image. Please try again." })
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const previewUrl = imageUrl(value, media);
  return (
    <FieldShell label={label}>
      <div className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-[160px_1fr]">
        <div className="flex h-32 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-white">
          {previewUrl ? (
            <img src={previewUrl} alt={`${label} preview`} className="h-full w-full object-cover" />
          ) : (
            <div className="text-center text-slate-400">
              <ImagePlus className="mx-auto mb-2" size={28} />
              <span className="text-xs">No image selected</span>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <MediaSelect
            media={media}
            label="Choose from Media Library"
            onSelect={(item) => onChange(encodeImage(item, value, fieldKey))}
          />
          <div className="flex flex-wrap gap-2">
            <UploadButton uploading={uploading} inputRef={inputRef} />
            {value !== null && value !== "" && (
              <button
                type="button"
                onClick={() => onChange(null)}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <Trash2 size={16} /> Remove
              </button>
            )}
          </div>
          <input ref={inputRef} hidden type="file" accept="image/*" onChange={handleUpload} />
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </FieldShell>
  );
};

const ImageArrayField = ({
  fieldKey,
  label,
  value,
  media,
  onChange,
  onMediaUploaded,
}) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const sample = value[0];

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      setError("");
      const uploadedItems = [];
      for (const file of files) {
        const uploaded = await uploadMedia(file);
        uploadedItems.push(uploaded);
        onMediaUploaded(uploaded);
      }
      onChange([
        ...value,
        ...uploadedItems.map((item) => encodeImage(item, sample, fieldKey, true)),
      ]);
    } catch (uploadError) {
      setError(
        getUserFriendlyError(uploadError, { action: "upload", fallback: "Unable to upload the image. Please try again." })
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  return (
    <FieldShell
      label={label}
      hint="Upload, remove, or reorder images. The saved reference format is preserved."
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        {value.length ? (
          <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {value.map((image, index) => {
              const previewUrl = imageUrl(image, media);
              return (
                <div
                  key={`${previewUrl || "image"}-${index}`}
                  className="overflow-hidden rounded-lg border border-slate-200 bg-white"
                >
                  <div className="flex h-32 items-center justify-center bg-slate-100">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt={`${label} ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-slate-500">Preview unavailable</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-2 p-2">
                    <span className="text-xs font-medium text-slate-600">Image {index + 1}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onChange(reorder(value, index, index - 1))}
                        disabled={index === 0}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        aria-label={`Move image ${index + 1} up`}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onChange(reorder(value, index, index + 1))}
                        disabled={index === value.length - 1}
                        className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
                        aria-label={`Move image ${index + 1} down`}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          onChange(value.filter((_, itemIndex) => itemIndex !== index))
                        }
                        className="rounded p-1.5 text-red-600 hover:bg-red-50"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mb-4 rounded-lg border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
            No images added yet.
          </div>
        )}
        <div className="flex flex-col gap-2 sm:flex-row">
          <MediaSelect
            media={media}
            label="Add from Media Library"
            onSelect={(item) =>
              onChange([...value, encodeImage(item, sample, fieldKey, true)])
            }
          />
          <UploadButton multiple uploading={uploading} inputRef={inputRef} />
        </div>
        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </FieldShell>
  );
};

const ItemActions = ({ index, count, onMove, onRemove, itemLabel }) => (
  <div className="flex shrink-0 gap-1">
    <button
      type="button"
      onClick={() => onMove(index - 1)}
      disabled={index === 0}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
      aria-label={`Move ${itemLabel} up`}
    >
      <ArrowUp size={16} />
    </button>
    <button
      type="button"
      onClick={() => onMove(index + 1)}
      disabled={index === count - 1}
      className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-30"
      aria-label={`Move ${itemLabel} down`}
    >
      <ArrowDown size={16} />
    </button>
    <button
      type="button"
      onClick={onRemove}
      className="rounded-lg border border-red-200 bg-white p-2 text-red-600 hover:bg-red-50"
      aria-label={`Delete ${itemLabel}`}
    >
      <Trash2 size={16} />
    </button>
  </div>
);

const PrimitiveArrayField = ({ fieldKey, label, value, onChange }) => {
  const itemType = typeof value[0];
  const newItem = itemType === "number" ? 0 : itemType === "boolean" ? false : "";

  return (
    <FieldShell label={label}>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {value.map((item, index) => (
          <div key={`${fieldKey}-${index}`} className="flex items-start gap-2">
            {typeof item === "boolean" ? (
              <label className="flex min-h-10 flex-1 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-2">
                <input
                  type="checkbox"
                  checked={item}
                  onChange={(event) => {
                    const updated = [...value];
                    updated[index] = event.target.checked;
                    onChange(updated);
                  }}
                  className="h-4 w-4 accent-blue-600"
                />
                <span className="text-sm text-slate-700">
                  {singularize(label)} {index + 1}
                </span>
              </label>
            ) : (
              <textarea
                rows={2}
                value={item}
                placeholder={`${singularize(label)} ${index + 1}`}
                onChange={(event) => {
                  const updated = [...value];
                  updated[index] =
                    typeof item === "number"
                      ? Number(event.target.value)
                      : event.target.value;
                  onChange(updated);
                }}
                className={fieldClass}
              />
            )}
            <ItemActions
              index={index}
              count={value.length}
              itemLabel={`${singularize(label)} ${index + 1}`}
              onMove={(to) => onChange(reorder(value, index, to))}
              onRemove={() =>
                onChange(value.filter((_, itemIndex) => itemIndex !== index))
              }
            />
          </div>
        ))}
        {!value.length && (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
            No items added yet.
          </p>
        )}
        <button
          type="button"
          onClick={() => onChange([...value, newItem])}
          className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
        >
          <Plus size={16} /> Add {singularize(label)}
        </button>
      </div>
    </FieldShell>
  );
};


const FlexibleArrayField = ({
  fieldKey,
  label,
  value,
  media,
  sectionType,
  onChange,
  onMediaUploaded,
}) => (
  <FieldShell label={label}>
    <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      {value.map((item, index) => (
        <article
          key={fieldKey + "-" + index}
          className="rounded-xl border border-slate-200 bg-white p-4"
        >
          <div className="mb-3 flex items-center justify-between gap-3">
            <h4 className="font-semibold text-slate-800">
              {singularize(label)} {index + 1}
            </h4>
            <ItemActions
              index={index}
              count={value.length}
              itemLabel={singularize(label) + " " + (index + 1)}
              onMove={(to) => onChange(reorder(value, index, to))}
              onRemove={() =>
                onChange(value.filter((_, itemIndex) => itemIndex !== index))
              }
            />
          </div>

          {typeof item === "string" && (
            <textarea
              rows={3}
              value={item}
              onChange={(event) => {
                const updated = [...value];
                updated[index] = event.target.value;
                onChange(updated);
              }}
              className={fieldClass}
            />
          )}
          {typeof item === "number" && (
            <input
              type="number"
              value={item}
              onChange={(event) => {
                const updated = [...value];
                updated[index] = Number(event.target.value);
                onChange(updated);
              }}
              className={fieldClass}
            />
          )}
          {typeof item === "boolean" && (
            <label className="flex items-center gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={item}
                onChange={(event) => {
                  const updated = [...value];
                  updated[index] = event.target.checked;
                  onChange(updated);
                }}
                className="h-4 w-4 accent-blue-600"
              />
              Enabled
            </label>
          )}
          {isObject(item) && (
            <ObjectEditor
              value={item}
              media={media}
              sectionType={sectionType}
              onChange={(nextItem) => {
                const updated = [...value];
                updated[index] = nextItem;
                onChange(updated);
              }}
              onMediaUploaded={onMediaUploaded}
            />
          )}
          {Array.isArray(item) && (
            <FieldEditor
              fieldKey="items"
              value={item}
              media={media}
              sectionType={sectionType}
              onChange={(nextItem) => {
                const updated = [...value];
                updated[index] = nextItem;
                onChange(updated);
              }}
              onMediaUploaded={onMediaUploaded}
            />
          )}
        </article>
      ))}
      {!value.length && (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
          No items added yet.
        </p>
      )}
      <button
        type="button"
        onClick={() =>
          onChange([...value, value.length ? blankShape(value[0]) : ""])
        }
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        <Plus size={16} /> Add new {singularize(label)}
      </button>
    </div>
  </FieldShell>
);

const ObjectArrayCard = ({
  label,
  item,
  index,
  count,
  media,
  sectionType,
  policy,
  onChange,
  onMove,
  onRemove,
  onMediaUploaded,
}) => {
  const [editing, setEditing] = useState(true);

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <h4 className="font-semibold text-slate-800">
          {singularize(label)} {index + 1}
        </h4>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-50"
          >
            <Pencil size={14} /> {editing ? "Close" : "Edit"}
          </button>
          <ItemActions
            index={index}
            count={count}
            itemLabel={`${singularize(label)} ${index + 1}`}
            onMove={onMove}
            onRemove={onRemove}
          />
        </div>
      </div>
      {editing && (
        <div className="p-4">
          <ObjectEditor
            value={item}
            media={media}
            sectionType={sectionType}
            policy={policy}
            onChange={onChange}
            onMediaUploaded={onMediaUploaded}
          />
        </div>
      )}
    </article>
  );
};

const ObjectArrayField = ({
  fieldKey,
  label,
  value,
  media,
  sectionType,
  policy,
  onChange,
  onMediaUploaded,
}) => {
  const template = value[0] || objectArrayTemplate(fieldKey, sectionType);

  return (
    <FieldShell label={label}>
      <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
        {value.map((item, index) => (
          <ObjectArrayCard
            key={`${fieldKey}-${index}`}
            label={label}
            item={item}
            index={index}
            count={value.length}
            media={media}
            sectionType={sectionType}
            policy={policy}
            onChange={(nextItem) => {
              const updated = [...value];
              updated[index] = nextItem;
              onChange(updated);
            }}
            onMove={(to) => onChange(reorder(value, index, to))}
            onRemove={() =>
              onChange(value.filter((_, itemIndex) => itemIndex !== index))
            }
            onMediaUploaded={onMediaUploaded}
          />
        ))}
        {!value.length && (
          <p className="rounded-lg border border-dashed border-slate-300 bg-white p-4 text-center text-sm text-slate-500">
            No {label.toLowerCase()} added yet.
          </p>
        )}
        <button
          type="button"
          onClick={() => onChange([...value, blankShape(template)])}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={16} /> Add new {singularize(label)}
        </button>
      </div>
    </FieldShell>
  );
};

function ObjectEditor({
  value,
  media,
  sectionType,
  policy,
  onChange,
  onMediaUploaded,
}) {
  const entries = Object.entries(value);
  const hasPolicy = isObject(policy);
  const visibleEntries = hasPolicy
    ? entries.filter(([fieldKey]) =>
        Object.prototype.hasOwnProperty.call(policy, fieldKey)
      )
    : entries;

  if (!visibleEntries.length) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
        No editable content is available for this section.
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {visibleEntries.map(([fieldKey, fieldValue]) => (
        <FieldEditor
          key={fieldKey}
          fieldKey={fieldKey}
          value={fieldValue}
          media={media}
          sectionType={sectionType}
          policy={hasPolicy ? policy[fieldKey] : undefined}
          onChange={(nextValue) => onChange({ ...value, [fieldKey]: nextValue })}
          onMediaUploaded={onMediaUploaded}
        />
      ))}
    </div>
  );
}

function FieldEditor({
  fieldKey,
  value,
  media,
  sectionType,
  policy,
  onChange,
  onMediaUploaded,
}) {
  const label = humanize(fieldKey);

  if (
    isImageKey(fieldKey) &&
    !Array.isArray(value) &&
    (value === null || typeof value === "string" || isObject(value))
  ) {
    return (
      <ImageField
        fieldKey={fieldKey}
        label={label}
        value={value}
        media={media}
        onChange={onChange}
        onMediaUploaded={onMediaUploaded}
      />
    );
  }

  if (typeof value === "string") {
    return (
      <FieldShell label={label}>
        {isLongText(fieldKey, value) ? (
          <textarea
            rows={5}
            value={value}
            placeholder={`Enter ${label.toLowerCase()}`}
            onChange={(event) => onChange(event.target.value)}
            className={`${fieldClass} leading-6`}
          />
        ) : (
          <input
            type={inputType(fieldKey)}
            value={value}
            placeholder={`Enter ${label.toLowerCase()}`}
            onChange={(event) => onChange(event.target.value)}
            className={fieldClass}
          />
        )}
      </FieldShell>
    );
  }

  if (typeof value === "number") {
    return (
      <FieldShell label={label}>
        <input
          type="number"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className={fieldClass}
        />
      </FieldShell>
    );
  }

  if (typeof value === "boolean") {
    return (
      <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div>
          <p className="text-sm font-medium text-slate-700">{label}</p>
          <p className="mt-1 text-xs text-slate-500">
            {value ? "Enabled" : "Disabled"}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition ${
            value ? "bg-blue-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition ${
              value ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>
    );
  }

  if (Array.isArray(value)) {
    if (isImageArrayKey(fieldKey)) {
      return (
        <ImageArrayField
          fieldKey={fieldKey}
          label={label}
          value={value}
          media={media}
          onChange={onChange}
          onMediaUploaded={onMediaUploaded}
        />
      );
    }

    const template = objectArrayTemplate(fieldKey, sectionType);
    const objectItems = value.length
      ? value.every(isObject)
      : Boolean(template);
    if (objectItems) {
      return (
        <ObjectArrayField
          fieldKey={fieldKey}
          label={label}
          value={value}
          media={media}
          sectionType={sectionType}
          policy={isObject(policy) ? policy : undefined}
          onChange={onChange}
          onMediaUploaded={onMediaUploaded}
        />
      );
    }

    const types = new Set(value.map((item) => typeof item));
    const primitiveItems = value.every((item) =>
      ["string", "number", "boolean"].includes(typeof item)
    );
    if (!value.length || (primitiveItems && types.size <= 1)) {
      return (
        <PrimitiveArrayField
          fieldKey={fieldKey}
          label={label}
          value={value}
          onChange={onChange}
        />
      );
    }

    return (
      <FlexibleArrayField
        fieldKey={fieldKey}
        label={label}
        value={value}
        media={media}
        sectionType={sectionType}
        onChange={onChange}
        onMediaUploaded={onMediaUploaded}
      />
    );
  }

  if (isObject(value)) {
    return (
      <section className="rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <h3 className="mb-4 text-base font-semibold text-slate-800">{label}</h3>
        <ObjectEditor
          value={value}
          media={media}
          sectionType={sectionType}
          policy={isObject(policy) ? policy : undefined}
          onChange={onChange}
          onMediaUploaded={onMediaUploaded}
        />
      </section>
    );
  }

  return null;
}

const StructuredContentEditor = ({
  value,
  media = [],
  sectionType,
  isVisible = true,
  onChange,
  onVisibilityChange,
  onMediaUploaded,
}) => {
  const contentValue = isObject(value) ? value : {};
  const policy = getSectionFieldPolicy(sectionType);
  const hasPolicy = isObject(policy);
  const visibleEntries = Object.entries(contentValue).filter(
    ([fieldKey]) =>
      !hasPolicy || Object.prototype.hasOwnProperty.call(policy, fieldKey)
  );
  const mediaEntries = visibleEntries.filter(
    ([fieldKey]) => isImageKey(fieldKey) || isImageArrayKey(fieldKey)
  );
  const settingsEntries = visibleEntries.filter(
    ([fieldKey, fieldValue]) =>
      !isImageKey(fieldKey) &&
      !isImageArrayKey(fieldKey) &&
      isSettingsKey(fieldKey, fieldValue)
  );
  const contentEntries = visibleEntries.filter(
    ([fieldKey, fieldValue]) =>
      !isImageKey(fieldKey) &&
      !isImageArrayKey(fieldKey) &&
      !isSettingsKey(fieldKey, fieldValue)
  );

  const renderEntries = (entries) =>
    entries.map(([fieldKey, fieldValue]) => (
      <FieldEditor
        key={fieldKey}
        fieldKey={fieldKey}
        value={fieldValue}
        media={media}
        sectionType={sectionType}
        policy={hasPolicy ? policy[fieldKey] : undefined}
        onChange={(nextValue) =>
          onChange({ ...contentValue, [fieldKey]: nextValue })
        }
        onMediaUploaded={onMediaUploaded}
      />
    ));

  return (
    <div className="space-y-6">
      <EditorPanel
        title="Section Content"
        description="Manage the text and repeatable content displayed in this section."
      >
        {contentEntries.length ? renderEntries(contentEntries) : <EmptyContent />}
      </EditorPanel>

      {mediaEntries.length > 0 && (
        <EditorPanel
          title="Media"
          description="Choose, upload, remove, and reorder the images used here."
        >
          {renderEntries(mediaEntries)}
        </EditorPanel>
      )}

      <EditorPanel
        title="Settings"
        description="Control how this section appears on the website."
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-slate-700">
              Visible on website
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Hide this section without deleting its content.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isVisible}
            onClick={() => onVisibilityChange(!isVisible)}
            className={
              "relative h-6 w-11 rounded-full transition " +
              (isVisible ? "bg-blue-600" : "bg-slate-300")
            }
          >
            <span
              className={
                "absolute top-1 h-4 w-4 rounded-full bg-white shadow transition " +
                (isVisible ? "left-6" : "left-1")
              }
            />
          </button>
        </div>
        {renderEntries(settingsEntries)}
      </EditorPanel>
    </div>
  );
};

export default StructuredContentEditor;
