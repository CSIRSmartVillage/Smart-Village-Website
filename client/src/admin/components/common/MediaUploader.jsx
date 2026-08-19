import { getUserFriendlyError } from "../../../utils/userFriendlyError";
import { useState, useRef } from "react";
import { Loader2, ImagePlus, Trash2 } from "lucide-react";
import { uploadMedia } from "../../services/media.service";

const MediaUploader = ({
  label = "Upload Images",
  multiple = false,
  value = [],
  onChange,
  className = "",
  uploadAreaClassName = "",
  previewImageClassName = "",
}) => {
  const inputRef = useRef(null);
const [uploading, setUploading] = useState(false);

  const images = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];

const handleSelect = async (e) => {
  const files = Array.from(e.target.files);

  if (!files.length) return;

  try {
    setUploading(true);

    if (multiple) {
      const uploadedMedia = [];

      for (const file of files) {
        const media = await uploadMedia(file);
        uploadedMedia.push(media);
      }

      onChange?.([...images, ...uploadedMedia]);
    } else {
      const media = await uploadMedia(files[0]);

      onChange?.(media);
    }
  } catch (error) {
    console.error(error);

    alert(
      getUserFriendlyError(error, { action: "upload", fallback: "Unable to upload the image. Please try again." })
    );
  } finally {
    setUploading(false);
    e.target.value = "";
  }
};

  const removeImage = (index) => {
    if (!multiple) {
      onChange?.(null);
      return;
    }

    const updated = [...images];
    updated.splice(index, 1);

    onChange?.(updated);
  };

  return (
    <div
      className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 ${className}`}
    >

      {/* Header */}

      <div className="mb-5">
        <h3 className="text-lg font-semibold text-slate-800">
          {label}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          PNG, JPG, JPEG or WEBP
        </p>
      </div>

      {/* Upload Area */}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 transition hover:border-blue-500 hover:bg-blue-50 ${uploadAreaClassName}`}
      >
          {uploading ? (
  <Loader2
    size={42}
    className="animate-spin text-blue-600"
  />
) : (
  <ImagePlus
    size={42}
    className="text-blue-600"
  />
)}

        <h4 className="mt-4 text-lg font-semibold text-slate-800">
  {uploading
    ? "Uploading..."
    : "Click to Upload"}
</h4>

        <p className="mt-2 text-sm text-slate-500">
          {multiple
            ? "Upload one or multiple images"
            : "Upload a featured image"}
        </p>
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleSelect}
      />

      {/* Preview */}

      {images.length > 0 && (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-white"
            >
              <img
                src={image.url}
                alt=""
                className={`h-36 w-full object-cover ${previewImageClassName}`}
              />

              <button
                type="button"
                onClick={() =>
                  removeImage(index)
                }
                className="absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white opacity-0 transition group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default MediaUploader;
