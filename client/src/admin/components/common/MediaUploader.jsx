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
  compactHorizontal = false,
}) => {
  const inputRef = useRef(null);
const [uploading, setUploading] = useState(false);

  const images = Array.isArray(value)
    ? value
    : value
      ? [value]
      : [];
  const hasHorizontalPreview =
    compactHorizontal && images.length > 0;

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
      className={`rounded-2xl border border-dashed border-slate-300 bg-slate-50 ${
        compactHorizontal ? "p-3" : "p-6"
      } ${className}`}
    >

      {/* Header */}

      <div className={compactHorizontal ? "mb-3" : "mb-5"}>
        <h3
          className={`font-semibold text-slate-800 ${
            compactHorizontal ? "text-sm" : "text-lg"
          }`}
        >
          {label}
        </h3>

        <p
          className={`mt-1 text-slate-500 ${
            compactHorizontal ? "text-xs" : "text-sm"
          }`}
        >
          PNG, JPG, JPEG or WEBP
        </p>
      </div>

      {/* Upload Area */}

      <div
        className={
          hasHorizontalPreview
            ? "grid gap-3 sm:grid-cols-2 sm:items-stretch"
            : ""
        }
      >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white transition hover:border-blue-500 hover:bg-blue-50 ${
          compactHorizontal ? "min-h-28 p-3 sm:min-h-32" : "p-10"
        } ${uploadAreaClassName}`}
      >
          {uploading ? (
  <Loader2
    size={compactHorizontal ? 28 : 42}
    className="animate-spin text-blue-600"
  />
) : (
  <ImagePlus
    size={compactHorizontal ? 28 : 42}
    className="text-blue-600"
  />
)}

        <h4
          className={`font-semibold text-slate-800 ${
            compactHorizontal
              ? "mt-2 text-sm"
              : "mt-4 text-lg"
          }`}
        >
  {uploading
    ? "Uploading..."
    : "Click to Upload"}
</h4>

        <p
          className={`text-slate-500 ${
            compactHorizontal
              ? "mt-1 text-xs"
              : "mt-2 text-sm"
          }`}
        >
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
        <div
          className={
            compactHorizontal
              ? "mt-3 grid grid-cols-1 gap-3 sm:mt-0"
              : "mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
          }
        >

          {images.map((image, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl border bg-white"
            >
              <img
                src={image.url}
                alt=""
                className={`w-full ${
                  compactHorizontal
                    ? "h-28 object-contain sm:h-32"
                    : "h-36 object-cover"
                } ${previewImageClassName}`}
              />

              <button
                type="button"
                onClick={() =>
                  removeImage(index)
                }
                className={`absolute right-2 top-2 rounded-lg bg-red-600 p-2 text-white transition ${
                  compactHorizontal
                    ? "opacity-100"
                    : "opacity-0 group-hover:opacity-100"
                }`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

        </div>
      )}
      </div>

    </div>
  );
};

export default MediaUploader;
