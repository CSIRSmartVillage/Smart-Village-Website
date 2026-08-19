import { getUserFriendlyError } from "../../utils/userFriendlyError";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Film,
  Image as ImageIcon,
} from "lucide-react";

import {
  deleteMedia,
  getAllMedia,
  uploadMedia,
} from "../services/media.service";

const filters = [
  {
    label: "All Media",
    value: "all",
  },
  {
    label: "Images",
    value: "image",
  },
  {
    label: "Videos",
    value: "video",
  },
];

const getMediaType = (item) =>
  item.mediaType ||
  item.resourceType;

const formatFileSize = (size) => {
  if (!Number.isFinite(size)) {
    return "—";
  }

  if (size < 1024 * 1024) {
    return `${(
      size / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    size /
    (1024 * 1024)
  ).toFixed(1)} MB`;
};

const MediaLibraryPage = () => {
  const [media, setMedia] =
    useState([]);

  const [filter, setFilter] =
    useState("all");

  const [uploading, setUploading] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadMedia = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllMedia();

      setMedia(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (loadError) {
      setError(
        getUserFriendlyError(loadError, "Unable to load media. Please refresh the page.")
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    getAllMedia()
      .then((data) => {
        if (isActive) {
          setMedia(
            Array.isArray(data)
              ? data
              : []
          );
        }
      })
      .catch((loadError) => {
        if (isActive) {
          setError(
            getUserFriendlyError(loadError, "Unable to load media. Please refresh the page.")
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  const filteredMedia =
    useMemo(() => {
      if (filter === "all") {
        return media;
      }

      return media.filter(
        (item) =>
          getMediaType(item) ===
          filter
      );
    }, [filter, media]);

  const handleUpload = async (e) => {
    const file =
      e.target.files[0];

    if (!file) {
      return;
    }

    try {
      setUploading(true);
      setError("");

      await uploadMedia(file);
      await loadMedia();
    } catch (uploadError) {
      setError(
        getUserFriendlyError(uploadError, { action: "upload", fallback: "Unable to upload the media. Please try again." })
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete =
    async (id) => {
      const confirmed =
        window.confirm(
          "Delete this media?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setError("");
        await deleteMedia(id);
        await loadMedia();
      } catch (deleteError) {
        setError(
          getUserFriendlyError(deleteError, "Unable to delete the media. Please try again.")
        );
      }
    };

  const copyUrl = async (url) => {
    await navigator.clipboard
      .writeText(url);

    alert("URL copied");
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Media Library
        </h1>

        <label className="cursor-pointer rounded bg-blue-600 px-4 py-2 text-white">
          {uploading
            ? "Uploading..."
            : "Upload Media"}

          <input
            type="file"
            accept="image/*,video/mp4,video/webm,video/quicktime,.mov"
            disabled={uploading}
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() =>
              setFilter(
                item.value
              )
            }
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filter === item.value
                ? "bg-blue-600 text-white"
                : "border bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {error && (
        <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-slate-500">
          Loading media...
        </p>
      ) : filteredMedia.length === 0 ? (
        <p className="rounded-lg border bg-white p-8 text-center text-slate-500">
          No media found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredMedia.map(
            (item) => {
              const mediaType =
                getMediaType(item);

              return (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-lg border bg-white"
                >
                  <div className="h-40 bg-slate-100">
                    {mediaType ===
                    "video" ? (
                      item.thumbnailUrl ? (
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
                          controls
                          preload="metadata"
                          className="h-full w-full object-cover"
                        />
                      )
                    ) : (
                      <img
                        src={item.url}
                        alt={
                          item.originalName
                        }
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-700">
                        {mediaType ===
                        "video" ? (
                          <Film
                            size={14}
                          />
                        ) : (
                          <ImageIcon
                            size={14}
                          />
                        )}
                        {mediaType}
                      </span>

                      <span className="text-xs text-slate-500">
                        {formatFileSize(
                          item.size
                        )}
                      </span>
                    </div>

                    <p className="truncate text-sm font-medium text-slate-800">
                      {item.originalName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.createdAt
                        ? new Date(
                            item.createdAt
                          ).toLocaleDateString()
                        : ""}
                    </p>

                    <div className="mt-3 flex gap-2">
                      <button
                        onClick={() =>
                          copyUrl(
                            item.url
                          )
                        }
                        className="rounded bg-blue-600 px-3 py-1 text-white"
                      >
                        Copy URL
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(
                            item._id
                          )
                        }
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
    </div>
  );
};

export default MediaLibraryPage;