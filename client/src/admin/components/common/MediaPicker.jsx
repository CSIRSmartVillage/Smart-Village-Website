import {
  useEffect,
  useState,
} from "react";

import {
  Film,
  Loader2,
  Play,
  X,
} from "lucide-react";

import {
  getAllMedia,
} from "../../services/media.service";

const getMediaType = (item) =>
  item.mediaType ||
  item.resourceType;

const MediaPicker = ({
  open,
  onClose,
  onSelect,
  type = "video",
}) => {
  const [media, setMedia] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    const loadMedia =
      async () => {
        try {
          setLoading(true);
          setError("");

          const data =
            await getAllMedia(
              type
            );

          setMedia(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (loadError) {
          setError(
            loadError?.response?.data
              ?.error?.message ||
              loadError.message ||
              "Failed to load media."
          );
        } finally {
          setLoading(false);
        }
      };

    loadMedia();
  }, [open, type]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[85vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Select Video
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Choose an uploaded video from the Media Library.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Close media picker"
          >
            <X size={22} />
          </button>
        </div>

        <div className="max-h-[calc(85vh-92px)] overflow-y-auto p-5">
          {loading && (
            <div className="flex min-h-48 items-center justify-center text-slate-500">
              <Loader2
                className="mr-2 animate-spin"
                size={22}
              />
              Loading videos...
            </div>
          )}

          {!loading && error && (
            <p className="rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            media.length === 0 && (
              <div className="flex min-h-48 flex-col items-center justify-center text-center text-slate-500">
                <Film
                  size={42}
                  className="mb-3"
                />

                <p>
                  No uploaded videos found.
                </p>

                <p className="mt-1 text-sm">
                  Upload a video in the Media Library first.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            media.length > 0 && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {media
                  .filter(
                    (item) =>
                      getMediaType(
                        item
                      ) === type
                  )
                  .map((item) => (
                    <button
                      key={item._id}
                      type="button"
                      onClick={() => {
                        onSelect(item);
                        onClose();
                      }}
                      className="overflow-hidden rounded-xl border bg-white text-left transition hover:border-blue-500 hover:shadow-md"
                    >
                      <div className="relative h-40 bg-slate-900">
                        {item.thumbnailUrl ? (
                          <img
                            src={
                              item.thumbnailUrl
                            }
                            alt={
                              item.originalName
                            }
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <video
                            src={item.url}
                            muted
                            preload="metadata"
                            className="h-full w-full object-cover"
                          />
                        )}

                        <span className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <span className="rounded-full bg-white p-3 text-blue-600 shadow">
                            <Play
                              size={20}
                              fill="currentColor"
                            />
                          </span>
                        </span>
                      </div>

                      <p className="truncate p-3 text-sm font-medium text-slate-800">
                        {item.originalName}
                      </p>
                    </button>
                  ))}
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default MediaPicker;