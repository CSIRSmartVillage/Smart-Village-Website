import {
  useState,
} from "react";

import {
  Film,
  Play,
} from "lucide-react";

import MediaPicker
  from "../common/MediaPicker";

const VideoForm = ({
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const initialMedia =
    initialData.media &&
    typeof initialData.media ===
      "object"
      ? initialData.media
      : initialData.media
      ? {
          _id:
            initialData.media,
          url:
            initialData.videoUrl,
          thumbnailUrl:
            initialData.thumbnailUrl,
          originalName:
            "Selected video",
        }
      : null;

  const [videoSource,
    setVideoSource] =
    useState(
      initialMedia
        ? "media"
        : initialData.youtubeUrl
        ? "external"
        : "media"
    );

  const [formData,
    setFormData] =
    useState({
      title:
        initialData.title || "",

      youtubeUrl:
        initialData.youtubeUrl || "",

      thumbnailUrl:
        initialData.thumbnailUrl || "",

      description:
        initialData.description || "",

      displayOrder:
        initialData.displayOrder || 0,

      isActive:
        initialData.isActive ?? true,
    });

  const [selectedMedia,
    setSelectedMedia] =
    useState(initialMedia);

  const [pickerOpen,
    setPickerOpen] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData(
      (previous) => ({
        ...previous,

        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      })
    );
  };

  const handleSourceChange =
    (e) => {
      setVideoSource(
        e.target.value
      );

      setError("");
    };

  const handleSubmit =
    async (e) => {
      e.preventDefault();
      setError("");

      const {
        youtubeUrl,
        thumbnailUrl,
        ...metadata
      } = formData;

      const payload = {
        ...metadata,
      };

      if (
        videoSource ===
        "external"
      ) {
        if (!youtubeUrl.trim()) {
          setError(
            "Enter a valid external video URL."
          );
          return;
        }

        payload.media = null;
        payload.youtubeUrl =
          youtubeUrl.trim();
        payload.thumbnailUrl =
          thumbnailUrl.trim();
      } else {
        if (!selectedMedia) {
          setError(
            "Select an uploaded video from the Media Library."
          );
          return;
        }

        payload.media =
          selectedMedia._id;
      }

      await onSubmit(payload);
    };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div>
          <label className="mb-2 block font-medium">
            Video Source
          </label>

          <div className="flex flex-wrap gap-6 rounded-lg border bg-slate-50 p-4">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="videoSource"
                value="external"
                checked={
                  videoSource ===
                  "external"
                }
                onChange={
                  handleSourceChange
                }
              />

              <span>
                Use External Video URL
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="videoSource"
                value="media"
                checked={
                  videoSource ===
                  "media"
                }
                onChange={
                  handleSourceChange
                }
              />

              <span>
                Select Uploaded Media
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Title
          </label>

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
            required
          />
        </div>

        {videoSource ===
        "external" ? (
          <>
            <div>
              <label className="mb-2 block font-medium">
                Video URL
              </label>

              <input
                type="url"
                name="youtubeUrl"
                value={
                  formData.youtubeUrl
                }
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Thumbnail URL
              </label>

              <input
                type="url"
                name="thumbnailUrl"
                value={
                  formData.thumbnailUrl
                }
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Optional for YouTube videos"
              />

              <p className="mt-2 text-sm text-slate-500">
                YouTube thumbnails are generated automatically when this is left blank.
              </p>
            </div>
          </>
        ) : (
          <div>
            <label className="mb-2 block font-medium">
              Video
            </label>

            {selectedMedia ? (
              <div className="overflow-hidden rounded-xl border bg-white">
                <div className="relative h-64 bg-slate-900">
                  {selectedMedia.thumbnailUrl ? (
                    <img
                      src={
                        selectedMedia.thumbnailUrl
                      }
                      alt={
                        selectedMedia.originalName ||
                        formData.title
                      }
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <video
                      src={
                        selectedMedia.url
                      }
                      controls
                      preload="metadata"
                      className="h-full w-full object-contain"
                    />
                  )}

                  {selectedMedia.thumbnailUrl && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
                      <span className="rounded-full bg-white p-4 text-blue-600 shadow-lg">
                        <Play
                          size={24}
                          fill="currentColor"
                        />
                      </span>
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {
                        selectedMedia.originalName
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      Media Library video
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setPickerOpen(true)
                    }
                    className="shrink-0 rounded-lg border px-4 py-2 font-medium text-blue-600 hover:bg-blue-50"
                  >
                    Change Video
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setPickerOpen(true)
                }
                className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 transition hover:border-blue-500 hover:bg-blue-50"
              >
                <Film
                  size={42}
                  className="text-blue-600"
                />

                <span className="mt-3 text-lg font-semibold text-slate-800">
                  Select Uploaded Media
                </span>

                <span className="mt-1 text-sm text-slate-500">
                  Choose an uploaded video from the Media Library
                </span>
              </button>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-red-600">
            {error}
          </p>
        )}

        <div>
          <label className="mb-2 block font-medium">
            Description
          </label>

          <textarea
            rows="4"
            name="description"
            value={
              formData.description
            }
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Display Order
          </label>

          <input
            type="number"
            name="displayOrder"
            value={
              formData.displayOrder
            }
            onChange={handleChange}
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            checked={
              formData.isActive
            }
            onChange={handleChange}
          />

          <label>Active</label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Saving..."
            : "Save Video"}
        </button>
      </form>

      <MediaPicker
        open={pickerOpen}
        onClose={() =>
          setPickerOpen(false)
        }
        onSelect={
          setSelectedMedia
        }
        type="video"
      />
    </>
  );
};

export default VideoForm;