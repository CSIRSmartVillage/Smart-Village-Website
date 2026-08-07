import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import StructuredContentEditor from "../components/sections/StructuredContentEditor";
import { getAllMedia } from "../services/media.service";
import { getSectionById, updateSection } from "../services/section.service";

const initialFormData = {
  title: "",
  subtitle: "",
  isVisible: true,
  content: {},
  metadata: {},
  sectionType: "",
};

const StructuredEditSectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const [section, mediaItems] = await Promise.all([
          getSectionById(id),
          getAllMedia("image"),
        ]);

        if (!active) return;
        setFormData({
          title: section.title || "",
          subtitle: section.subtitle || "",
          isVisible: section.isVisible ?? true,
          content: section.content || {},
          metadata: section.metadata || {},
          sectionType: section.sectionType || "",
        });
        setMedia(Array.isArray(mediaItems) ? mediaItems : []);
      } catch (loadError) {
        if (!active) return;
        setError(
          loadError?.response?.data?.error?.message ||
            loadError.message ||
            "Failed to load this section."
        );
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      setSuccess("");
      await updateSection(id, formData);
      setSuccess("Section updated successfully.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (saveError) {
      setError(
        saveError?.response?.data?.error?.message ||
          saveError.message ||
          "Failed to update this section."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-72 items-center justify-center text-slate-500">
        <Loader2 className="mr-2 animate-spin" size={22} />
        Loading section editor...
      </div>
    );
  }

  if (error && !formData.sectionType) {
    return (
      <div className="max-w-3xl rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle size={20} /> Unable to load section
        </div>
        <p className="mt-2 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"
          >
            <ArrowLeft size={17} /> Back to sections
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Edit Section
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Update the content and media displayed on the website.
          </p>
        </div>
      </div>

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} /> {success}
        </div>
      )}
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <StructuredContentEditor
          value={formData.content}
          media={media}
          sectionType={formData.sectionType}
          isVisible={formData.isVisible}
          onChange={(content) => updateField("content", content)}
          onVisibilityChange={(isVisible) =>
            updateField("isVisible", isVisible)
          }
          onMediaUploaded={(item) =>
            setMedia((current) => [item, ...current])
          }
        />

        <div className="sticky bottom-4 flex justify-end rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-40 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StructuredEditSectionPage;
