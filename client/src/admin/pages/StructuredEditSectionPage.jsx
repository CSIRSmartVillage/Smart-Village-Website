import { getUserFriendlyError } from "../../utils/userFriendlyError";
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
import { getPageById } from "../services/page.service";
import { getSectionDisplayName } from "../utils/sectionPresentation";

const initialFormData = {
  title: "",
  subtitle: "",
  isVisible: true,
  content: {},
  metadata: {},
  sectionType: "",
};

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

const DEFAULT_SUCCESS_STORIES_DESCRIPTION =
  "Discover how innovation, science, community participation, and sustainable development initiatives are transforming villages under the CSIR Smart Village Mission.";

const StructuredEditSectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
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

        const pageReference =
          section.pageId?._id ||
          section.pageId;
        const pageData = pageReference
          ? await getPageById(
              pageReference
            ).catch(() => null)
          : null;

        const sectionContent = section.content || {};
        const editableContent =
          section.sectionType === "SUCCESS_STORIES_HERO" &&
          sectionContent.description == null
            ? {
                ...sectionContent,
                description: DEFAULT_SUCCESS_STORIES_DESCRIPTION,
              }
            : sectionContent;

        if (!active) return;
        setFormData({
          title: section.title || "",
          subtitle: section.subtitle || "",
          isVisible: section.isVisible ?? true,
          content: editableContent,
          metadata: section.metadata || {},
          sectionType: section.sectionType || "",
        });
        setMedia(Array.isArray(mediaItems) ? mediaItems : []);
        setPageTitle(pageData?.title || "");
      } catch (loadError) {
        if (!active) return;
        setError(
          getUserFriendlyError(loadError, "Unable to load this section. Please refresh the page.")
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

  const updateContentField = (field, value) => {
    setFormData((current) => ({
      ...current,
      content: {
        ...current.content,
        [field]: value,
      },
    }));
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
        getUserFriendlyError(saveError, "Unable to update this section. Please try again.")
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

  const sectionName =
    getSectionDisplayName(formData.sectionType);
  const isSuccessStoriesHero =
    formData.sectionType === "SUCCESS_STORIES_HERO";

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
            Edit {sectionName}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {pageTitle
              ? `Update this section on the ${pageTitle} page.`
              : "Update the content and media displayed on the website."}
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
        {isSuccessStoriesHero && (
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-900">
                Banner Text
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Edit the text displayed at the top of the Success Stories page.
              </p>
            </div>

            <div className="space-y-5">
              <label className="block space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Small top label
                </span>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(event) =>
                    updateField("subtitle", event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Main heading
                </span>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  className={fieldClass}
                />
              </label>

              <label className="block space-y-2">
                <span className="block text-sm font-medium text-slate-700">
                  Description
                </span>
                <textarea
                  rows={4}
                  value={formData.content.description || ""}
                  onChange={(event) =>
                    updateContentField("description", event.target.value)
                  }
                  className={fieldClass}
                />
              </label>
            </div>
          </section>
        )}

        <StructuredContentEditor
          value={formData.content}
          media={media}
          sectionType={formData.sectionType}
          hiddenFields={isSuccessStoriesHero ? ["description"] : []}
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
