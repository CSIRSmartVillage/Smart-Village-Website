import { useState } from "react";

import { uploadMedia } from "../../services/media.service";

const AnnouncementForm = ({
  initialData = {},
  onSubmit,
}) => {
  const [formData, setFormData] =
    useState({
      title:
        initialData.title || "",
      summary:
        initialData.summary || "",
      content:
        initialData.content || "",
      pdfUrl:
        initialData.pdfUrl || "",
      externalLink:
        initialData.externalLink ||
        "",
      isFeatured:
        initialData.isFeatured ||
        false,
      isActive:
        initialData.isActive ??
        true,
    });

    const [pdfFile, setPdfFile] =
  useState(null);

  const handleFileChange = (
  e
) => {
  setPdfFile(
    e.target.files[0]
  );
};

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

const handleSubmit =
  async (e) => {
    e.preventDefault();

    let pdfUrl =
      formData.pdfUrl;

    if (pdfFile) {
      const uploadedFile =
        await uploadMedia(
          pdfFile
        );

      pdfUrl =
        uploadedFile.url;
    }

    onSubmit({
      ...formData,
      pdfUrl,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div>
        <label className="block mb-2 font-medium">
          Title
        </label>

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={
            handleChange
          }
          className="w-full border p-3 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Summary
        </label>

        <textarea
          name="summary"
          value={formData.summary}
          onChange={
            handleChange
          }
          rows={3}
          className="w-full border p-3 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          Content
        </label>

        <textarea
          name="content"
          value={formData.content}
          onChange={
            handleChange
          }
          rows={8}
          className="w-full border p-3 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          PDF File
        </label>

        <input
         type="file"
    accept=".pdf"
    name="pdf"
   onChange={handleFileChange}
          className="w-full border p-3 rounded"
        />
      </div>

      <div>
        <label className="block mb-2 font-medium">
          External Link
        </label>

        <input
          type="text"
          name="externalLink"
          value={
            formData.externalLink
          }
          onChange={
            handleChange
          }
          className="w-full border p-3 rounded"
        />
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isFeatured"
            checked={
              formData.isFeatured
            }
            onChange={
              handleChange
            }
          />
          Featured
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={
              formData.isActive
            }
            onChange={
              handleChange
            }
          />
          Active
        </label>
      </div>

      <button
        type="submit"
        className="
          bg-blue-600
          text-white
          px-6
          py-3
          rounded
        "
      >
        Save Announcement / Update
      </button>
    </form>
  );
};

export default AnnouncementForm;