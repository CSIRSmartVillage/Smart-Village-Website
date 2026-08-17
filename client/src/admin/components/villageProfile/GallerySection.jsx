import { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import toast from "react-hot-toast";

import { uploadMedia } from "../../services/media.service";

const createGalleryItem = (sortOrder = 0) => ({
  image: "",
  caption: "",
  sortOrder,
});

export default function GallerySection({
  formData,
  media,
  setFormData,
}) {
  const [uploadedMedia, setUploadedMedia] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const imageMedia = Array.from(
    new Map(
      [...uploadedMedia, ...media]
        .filter((item) => item.resourceType === "image")
        .map((item) => [item._id, item])
    ).values()
  );

  const mediaById = new Map(
    imageMedia.map((item) => [item._id, item])
  );

  const updateGallery = (galleryImages) => {
    setFormData((prev) => ({
      ...prev,
      galleryImages,
    }));
  };

  const addImage = () => {
    updateGallery([
      ...formData.galleryImages,
      createGalleryItem(formData.galleryImages.length),
    ]);
  };

  const updateImage = (index, key, value) => {
    const updated = formData.galleryImages.map((item, itemIndex) =>
      itemIndex === index
        ? {
            ...item,
            [key]: key === "sortOrder" ? Number(value) : value,
          }
        : item
    );

    updateGallery(updated);
  };

  const removeImage = (index) => {
    updateGallery(
      formData.galleryImages.filter((_, i) => i !== index)
    );
  };

  const moveImage = (index, direction) => {
    const nextIndex = index + direction;

    if (
      nextIndex < 0 ||
      nextIndex >= formData.galleryImages.length
    ) {
      return;
    }

    const updated = [...formData.galleryImages];
    const [item] = updated.splice(index, 1);
    updated.splice(nextIndex, 0, item);

    updateGallery(
      updated.map((galleryItem, itemIndex) => ({
        ...galleryItem,
        sortOrder: itemIndex,
      }))
    );
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    try {
      setUploadingIndex(index);

      const uploaded = await uploadMedia(file);

      setUploadedMedia((current) =>
        current.some((item) => item._id === uploaded._id)
          ? current
          : [uploaded, ...current]
      );

      setFormData((prev) => ({
        ...prev,
        galleryImages: prev.galleryImages.map((galleryItem, itemIndex) =>
          itemIndex === index
            ? {
                ...galleryItem,
                image: uploaded._id,
              }
            : galleryItem
        ),
      }));

      toast.success("Image uploaded and selected.");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.error?.message ||
          error?.response?.data?.message ||
          error?.message ||
          "Failed to upload image."
      );
    } finally {
      setUploadingIndex(null);
    }
  };

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">
            Village Gallery
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Add Cloudinary images with captions and display order.
          </p>
        </div>

        <button
          type="button"
          onClick={addImage}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          + Add Image
        </button>
      </div>

      {formData.galleryImages.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <p className="text-sm font-medium text-slate-700">
            No gallery images selected.
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Add images to show them on the public Village Information page.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.galleryImages.map((item, index) => {
            const selectedMedia = mediaById.get(item.image);
            const previewUrl =
              selectedMedia?.url || selectedMedia?.secureUrl;

            return (
              <div
                key={`${item.image || "gallery"}-${index}`}
                className="grid gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-[140px_1fr_auto]"
              >
                <div className="aspect-video overflow-hidden rounded-lg border bg-white">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={selectedMedia?.originalName || "Gallery preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs font-medium text-slate-400">
                      Preview
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Image
                    </label>

                    <select
                      value={item.image}
                      onChange={(e) =>
                        updateImage(index, "image", e.target.value)
                      }
                      className="w-full rounded border px-3 py-2"
                    >
                      <option value="">
                        Select Image
                      </option>

                      {imageMedia.map((mediaItem) => (
                        <option
                          key={mediaItem._id}
                          value={mediaItem._id}
                        >
                          {mediaItem.originalName}
                        </option>
                      ))}
                    </select>

                    {formData._id ? (
                      <>
                    <div className="my-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                      <span className="h-px flex-1 bg-slate-200" />
                      <span>OR</span>
                      <span className="h-px flex-1 bg-slate-200" />
                    </div>

                    <label
                      htmlFor={`village-gallery-upload-${index}`}
                      className={`inline-flex w-full items-center justify-center gap-2 rounded border border-blue-600 bg-white px-3 py-2 text-sm font-medium text-blue-700 transition hover:bg-blue-50 ${
                        uploadingIndex !== null
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      {uploadingIndex === index ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Upload size={16} />
                      )}

                      {uploadingIndex === index
                        ? "Uploading..."
                        : "Upload Image"}
                    </label>

                    <input
                      id={`village-gallery-upload-${index}`}
                      type="file"
                      accept="image/*"
                      disabled={uploadingIndex !== null}
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        handleImageUpload(index, file);
                        event.target.value = "";
                      }}
                    />
                      </>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Sort Order
                    </label>

                    <input
                      type="number"
                      value={item.sortOrder}
                      onChange={(e) =>
                        updateImage(index, "sortOrder", e.target.value)
                      }
                      className="w-full rounded border px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium">
                      Caption
                    </label>

                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) =>
                        updateImage(index, "caption", e.target.value)
                      }
                      className="w-full rounded border px-3 py-2"
                      placeholder="Short image caption"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 lg:flex-col lg:items-stretch lg:justify-center">
                  <button
                    type="button"
                    onClick={() => moveImage(index, -1)}
                    disabled={index === 0 || uploadingIndex !== null}
                    className="rounded border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => moveImage(index, 1)}
                    disabled={
                      index === formData.galleryImages.length - 1 ||
                      uploadingIndex !== null
                    }
                    className="rounded border bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={uploadingIndex !== null}
                    className="rounded bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
