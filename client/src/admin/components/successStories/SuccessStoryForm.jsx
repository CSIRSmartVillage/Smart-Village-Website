import {
  useEffect,
  useState,
} from "react";

import {
  getAllVillages,
} from "../../services/village.service";

import MediaUploader
  from "../common/MediaUploader";

const SuccessStoryForm = ({
  initialValues,
  onSubmit,
}) => {
  const [formData, setFormData] =
    useState(initialValues);

  const [villages, setVillages] =
    useState([]);

  const [villagesLoading, setVillagesLoading] =
    useState(true);

  useEffect(() => {
    const loadData =
      async () => {
        try {
          const villagesData =
            await getAllVillages();

          setVillages(
            Array.isArray(villagesData)
              ? villagesData
              : []
          );
        } catch (error) {
          console.error(error);
          setVillages([]);
        } finally {
          setVillagesLoading(false);
        }
      };

    loadData();
  }, []);

  const handleChange =
    (e) => {
      const {
        name,
        value,
      } = e.target;

      setFormData({
        ...formData,
        [name]: value,
      });
    };

  const handleSubmit =
    (e) => {
      e.preventDefault();

      const mediaId =
        (item) =>
          typeof item === "string"
            ? item
            : item?._id || null;

      onSubmit({
        ...formData,
        featuredImage:
          mediaId(
            formData.featuredImage
          ),
        galleryImages:
          (formData.galleryImages || [])
            .map(mediaId)
            .filter(Boolean),
      });
    };

  const hasSelectedVillage =
    villages.some(
      (village) =>
        String(village._id) ===
        String(formData.village)
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div>
        <label className="block mb-2">
          Story Title
        </label>
        <input
          name="title"
          placeholder="Story Title"
          value={formData.title || ""}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2">
          Village
        </label>

        <select
          name="village"
          value={
            formData.village || ""
          }
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          {formData.village &&
            !hasSelectedVillage && (
              <option value={formData.village}>
                {formData.villageName
                  ? formData.villageName + " (current selection)"
                  : "Current village selection"}
              </option>
            )}

          <option value="">
            {villagesLoading
              ? "Loading villages..."
              : villages.length === 0
                ? "No villages available"
                : "Select Village"}
          </option>

          {villages.map(
            (village) => (
              <option
                key={village._id}
                value={village._id}
              >
                {village.name?.en ||
                  village.name?.regional ||
                  village.name ||
                  "Unnamed Village"}
              </option>
            )
          )}
        </select>
        {!villagesLoading &&
          villages.length === 0 && (
            <p className="mt-1 text-sm text-gray-500">
              No villages available
            </p>
          )}
      </div>

      <MediaUploader
        label="Featured Image"
        multiple={false}
        value={
          formData.featuredImage ||
          null
        }
        onChange={(featuredImage) =>
          setFormData((current) => ({
            ...current,
            featuredImage,
          }))
        }
      />

      <MediaUploader
        label="Village Gallery"
        multiple
        value={
          formData.galleryImages ||
          []
        }
        onChange={(galleryImages) =>
          setFormData((current) => ({
            ...current,
            galleryImages,
          }))
        }
      />

      <input
        name="videoUrl"
        placeholder="Video URL"
        value={
          formData.videoUrl || ""
        }
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <textarea
        name="summary"
        placeholder="Summary"
        value={
          formData.summary || ""
        }
        onChange={handleChange}
        rows="4"
        className="w-full border p-3 rounded"
      />

      <textarea
        name="story"
        placeholder="Story"
        value={
          formData.story || ""
        }
        onChange={handleChange}
        rows="10"
        className="w-full border p-3 rounded"
      />

      <textarea
        name="impact"
        placeholder="Impact"
        value={
          formData.impact || ""
        }
        onChange={handleChange}
        rows="4"
        className="w-full border p-3 rounded"
      />

      <div>
        <label className="block mb-2">
          Status
        </label>

        <select
          name="status"
          value={
            formData.status ||
            "DRAFT"
          }
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="DRAFT">
            Draft
          </option>
          <option value="PUBLISHED">
            Published
          </option>
          <option value="ARCHIVED">
            Archived
          </option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-3 rounded"
      >
        Save Story
      </button>
    </form>
  );
};

export default SuccessStoryForm;