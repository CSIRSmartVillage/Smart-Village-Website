import { useEffect, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  FileSpreadsheet,
  MapPin,
  RefreshCcw,
  Send,
  Trash2,
  UploadCloud,
} from "lucide-react";
import toast from "react-hot-toast";
import { getAllVillages } from "../services/village.service";
import { getAllStates } from "../services/state.service";
import {
  uploadSurvey,
  getSurveyHistory,
  updateSurveyPublication,
  deleteSurvey,
} from "../services/survey.service";

const SurveyManagementPage = () => {
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState("");
  const [villages, setVillages] = useState([]);
  const [filteredVillages, setFilteredVillages] = useState([]);
  const [villageId, setVillageId] = useState("");
  const [deferredVillageId, setDeferredVillageId] = useState("");
  const [year, setYear] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    getSurveyHistory()
      .then(setHistory)
      .catch(() => toast.error("Unable to load survey history."));
  };

  useEffect(() => {
    Promise.all([getAllStates(), getAllVillages()])
      .then(([statesList, villagesList]) => {
        setStates(statesList);
        setVillages(villagesList);
      })
      .catch(() => toast.error("Unable to load states or villages."));

    loadHistory();
  }, []);

  useEffect(() => {
    if (selectedStateId) {
      const filtered = villages.filter(
        (v) => (v.state?._id || v.state) === selectedStateId
      );
      setFilteredVillages(filtered);

      if (deferredVillageId) {
        const hasVillage = filtered.some((v) => v._id === deferredVillageId);
        if (hasVillage) {
          setVillageId(deferredVillageId);
        }
        setDeferredVillageId("");
      } else {
        setVillageId("");
      }
    } else {
      setFilteredVillages([]);
      setVillageId("");
    }
  }, [selectedStateId, villages, deferredVillageId]);

  const submit = async (event) => {
    event.preventDefault();
    if (!selectedStateId || !villageId || !year || !file) {
      return toast.error("Choose state, village, year, and workbook.");
    }

    setSaving(true);
    try {
      const data = new FormData();
      data.append("villageId", villageId);
      data.append("surveyYear", year);
      data.append("file", file);
      await uploadSurvey(data);
      toast.success("Survey processed and saved.");
      setFile(null);
      event.target.reset();
      loadHistory();
    } catch (error) {
      toast.error(error.response?.data?.error?.message || "Upload failed.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await updateSurveyPublication(id, !currentStatus);
      toast.success(
        `Survey ${!currentStatus ? "published" : "unpublished"} successfully.`
      );
      loadHistory();
    } catch (err) {
      toast.error("Failed to update publication status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;
    try {
      await deleteSurvey(id);
      toast.success("Survey deleted successfully.");
      loadHistory();
    } catch (err) {
      toast.error("Failed to delete survey.");
    }
  };

  const handleReplace = (survey) => {
    setSelectedStateId(survey.state?._id || survey.state);
    setDeferredVillageId(survey.village?._id || survey.village);
    setYear(survey.surveyYear);
    toast.success("Form populated to replace survey. Select a new Excel file.");
  };

  const fieldClass =
    "mt-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50 disabled:text-slate-400";

  const actionClass =
    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition";

  const publishedCount = history.filter((survey) => survey.isPublished).length;

  const renderStatus = (isPublished) => (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
        isPublished
          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          : "bg-amber-50 text-amber-700 ring-1 ring-amber-100"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );

  const renderActions = (survey) => (
    <>
      <a
        href={`/village/${survey.village?.slug}/indicators?year=${survey.surveyYear}`}
        target="_blank"
        rel="noreferrer"
        className={`${actionClass} bg-blue-50 text-blue-700 hover:bg-blue-100`}
      >
        <Eye size={14} />
        Preview
      </a>
      <button
        type="button"
        onClick={() => togglePublish(survey._id, survey.isPublished)}
        className={`${actionClass} bg-slate-100 text-slate-700 hover:bg-slate-200`}
      >
        <CheckCircle2 size={14} />
        {survey.isPublished ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        onClick={() => handleReplace(survey)}
        className={`${actionClass} bg-indigo-50 text-indigo-700 hover:bg-indigo-100`}
      >
        <RefreshCcw size={14} />
        Replace
      </button>
      <button
        type="button"
        onClick={() => handleDelete(survey._id)}
        className={`${actionClass} bg-red-50 text-red-700 hover:bg-red-100`}
      >
        <Trash2 size={14} />
        Delete
      </button>
    </>
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Village Data
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Survey Management
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Upload VDI workbooks, manage publication status, preview
              village indicators, and replace old survey files.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:flex">
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Records
              </p>
              <p className="mt-1 text-2xl font-bold text-slate-950">
                {history.length}
              </p>
            </div>

            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
                Published
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-700">
                {publishedCount}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)]">
        <form
          onSubmit={submit}
          className="h-fit rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
              <UploadCloud size={24} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-950">
                Upload Workbook
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Select a state, village, survey year, and .xlsx file.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <label className="block text-sm font-semibold text-slate-700">
              State
              <select
                required
                value={selectedStateId}
                onChange={(event) => setSelectedStateId(event.target.value)}
                className={fieldClass}
              >
                <option value="">Select state</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>
                    {state.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Village
              <select
                required
                disabled={!selectedStateId}
                value={villageId}
                onChange={(event) => setVillageId(event.target.value)}
                className={fieldClass}
              >
                <option value="">
                  {!selectedStateId ? "First select a state" : "Select village"}
                </option>
                {filteredVillages.map((village) => (
                  <option key={village._id} value={village._id}>
                    {village.name?.en}
                  </option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Survey year
              <input
                required
                type="number"
                min="1900"
                max="3000"
                value={year}
                onChange={(event) => setYear(event.target.value)}
                className={fieldClass}
                placeholder="2026"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Excel workbook
              <div className="mt-2 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 transition hover:border-blue-300 hover:bg-blue-50/40">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet size={22} className="text-blue-700" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-800">
                      {file?.name || "Choose .xlsx workbook"}
                    </p>
                    <p className="text-xs text-slate-500">
                      Excel workbook only
                    </p>
                  </div>
                </div>
                <input
                  required
                  type="file"
                  accept=".xlsx"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className="mt-4 block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-blue-800"
                />
              </div>
            </label>

            <button
              disabled={saving}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              <Send size={18} />
              {saving ? "Processing..." : "Process and save survey"}
            </button>
          </div>
        </form>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5">
            <h2 className="text-xl font-bold text-slate-950">
              Uploaded Surveys
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage publications, previews, replacements, and deletions.
            </p>
          </div>

          <div className="divide-y divide-slate-100 md:hidden">
            {history.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-slate-500">
                No surveys uploaded yet.
              </div>
            ) : (
              history.map((survey) => (
                <article key={survey._id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-950">
                        {survey.village?.name?.en || "Unnamed village"}
                      </h3>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
                        <MapPin size={14} />
                        {survey.state?.name || "State not available"}
                      </p>
                    </div>

                    {renderStatus(survey.isPublished)}
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Year
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {survey.surveyYear}
                      </p>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Uploaded
                      </p>
                      <p className="mt-1 font-semibold text-slate-800">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {renderActions(survey)}
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 font-semibold text-slate-500">
                  <th className="px-6 py-3.5">Village</th>
                  <th className="px-6 py-3.5">State</th>
                  <th className="px-6 py-3.5">Survey Year</th>
                  <th className="px-6 py-3.5">Upload Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center text-slate-400"
                    >
                      No surveys uploaded yet.
                    </td>
                  </tr>
                ) : (
                  history.map((survey) => (
                    <tr
                      key={survey._id}
                      className="transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {survey.village?.name?.en}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {survey.state?.name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays size={14} />
                          {survey.surveyYear}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(survey.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {renderStatus(survey.isPublished)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2 whitespace-nowrap">
                          {renderActions(survey)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SurveyManagementPage;
