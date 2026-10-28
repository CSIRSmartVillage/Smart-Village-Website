import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Download, File, FileImage, FileText, Pencil, Plus, Trash2, UploadCloud, Video } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmDialog from "../components/common/ConfirmDialog";
import { createTrainingManual, deleteTrainingManual, deleteTrainingManualFile, getAdminTrainingManuals, updateTrainingManual } from "../services/trainingManual.service";

const emptyForm = { technologyName: "", description: "", published: true, files: [] };
const icon = (mime = "") => mime.startsWith("image/") ? FileImage : mime.startsWith("video/") ? Video : mime === "application/pdf" ? FileText : File;

const TrainingManualsPage = () => {
  const client = useQueryClient();
  const { data: manuals = [], isLoading } = useQuery({ queryKey: ["admin-training-manuals"], queryFn: getAdminTrainingManuals });
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const reset = () => { setEditing(null); setForm(emptyForm); setProgress(0); };
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const refresh = () => client.invalidateQueries({ queryKey: ["admin-training-manuals"] });
  const submit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("technologyName", form.technologyName);
    data.append("description", form.description);
    data.append("published", String(form.published));
    form.files.forEach((file) => data.append("files", file));
    try { setSaving(true); setProgress(0); const update = (event) => event.total && setProgress(Math.round((event.loaded * 100) / event.total));
      if (editing) await updateTrainingManual(editing._id, data, update); else await createTrainingManual(data, update);
      toast.success(editing ? "Training manual updated." : "Training manual created."); reset(); refresh();
    } catch { toast.error("Unable to save the training manual. Please try again."); } finally { setSaving(false); }
  };
  const edit = (manual) => { setEditing(manual); setForm({ technologyName: manual.technologyName, description: manual.description || "", published: manual.published, files: [] }); };
  const deleteFile = async (manual, file) => { if (!window.confirm(`Delete ${file.originalName}?`)) return; try { await deleteTrainingManualFile(manual._id, file._id); toast.success("File deleted."); refresh(); } catch { toast.error("Unable to delete the file."); } };
  const confirmDelete = async () => { try { await deleteTrainingManual(deleteTarget._id); toast.success("Training manual deleted."); setDeleteTarget(null); refresh(); } catch { toast.error("Unable to delete the training manual."); } };

  return <div className="mx-auto max-w-7xl space-y-6"><section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><p className="text-sm font-semibold uppercase tracking-wider text-blue-700">Website Resources</p><h1 className="mt-2 text-3xl font-bold text-slate-950">Training Manuals</h1><p className="mt-3 text-slate-600">Create technology resources, add files and choose what appears on the public website.</p></section>
    <div className="grid items-start gap-6 xl:grid-cols-[390px_minmax(0,1fr)]"><form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center gap-3"><UploadCloud className="text-blue-700" /><h2 className="text-xl font-bold text-slate-950">{editing ? "Edit Training Manual" : "Add Training Manual"}</h2></div><div className="mt-6 space-y-5"><label className="block text-sm font-semibold text-slate-700">Technology Name<input required maxLength={200} value={form.technologyName} onChange={(e) => setValue("technologyName", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" /></label><label className="block text-sm font-semibold text-slate-700">Brief Description <span className="font-normal text-slate-400">(optional)</span><textarea rows={4} maxLength={2000} value={form.description} onChange={(e) => setValue("description", e.target.value)} className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500" /></label><label className="block text-sm font-semibold text-slate-700">Upload Files <span className="font-normal text-slate-400">(optional)</span><input type="file" multiple accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp,.mp4,.webm,.mov" onChange={(e) => setValue("files", Array.from(e.target.files || []))} className="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-blue-700" />{form.files.length > 0 && <p className="mt-2 text-xs font-normal text-slate-500">{form.files.length} file(s) selected</p>}</label><label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4"><span><span className="block font-semibold text-slate-800">Published</span><span className="text-xs font-normal text-slate-500">Show this resource publicly.</span></span><input type="checkbox" checked={form.published} onChange={(e) => setValue("published", e.target.checked)} className="h-5 w-5" /></label></div>{saving && progress > 0 && <p className="mt-4 text-sm text-blue-700">Uploading {progress}%</p>}<div className="mt-6 flex gap-3"><button disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"><UploadCloud size={17} />{saving ? "Saving..." : editing ? "Save Changes" : "Create Manual"}</button>{editing && <button type="button" onClick={reset} className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700">Cancel</button>}</div></form>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><div><h2 className="text-xl font-bold text-slate-950">Manuals</h2><p className="mt-1 text-sm text-slate-500">{manuals.length} technology resource{manuals.length === 1 ? "" : "s"}</p></div><Plus className="text-blue-700" /></div>{isLoading ? <p className="p-10 text-center text-slate-500">Loading training manuals...</p> : manuals.length === 0 ? <p className="p-10 text-center text-slate-500">No training manuals yet.</p> : <div className="divide-y divide-slate-100">{manuals.map((manual) => <article key={manual._id} className="p-5"><div className="flex flex-wrap items-start justify-between gap-4"><div><h3 className="font-bold text-slate-950">{manual.technologyName}</h3>{manual.description && <p className="mt-1 text-sm text-slate-600">{manual.description}</p>}<span className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${manual.published ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{manual.published ? "Published" : "Draft"}</span></div><div className="flex gap-2"><button onClick={() => edit(manual)} className="rounded-lg bg-blue-50 p-2 text-blue-700" aria-label="Edit manual"><Pencil size={17} /></button><button onClick={() => setDeleteTarget(manual)} className="rounded-lg bg-red-50 p-2 text-red-700" aria-label="Delete manual"><Trash2 size={17} /></button></div></div><div className="mt-4 space-y-2">{manual.files.map((file) => { const Icon = icon(file.mimeType); return <div key={file._id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm"><span className="flex min-w-0 items-center gap-2 text-slate-700"><Icon size={16} className="shrink-0 text-blue-700" /><span className="truncate">{file.originalName}</span></span><div className="flex gap-2"><a href={file.downloadUrl} className="text-blue-700" aria-label="Download file"><Download size={17} /></a><button onClick={() => deleteFile(manual, file)} className="text-red-600" aria-label="Delete file"><Trash2 size={17} /></button></div></div>; })}</div></article>)}</div>}</section></div>
    <ConfirmDialog open={Boolean(deleteTarget)} title="Delete Training Manual" message={`Delete “${deleteTarget?.technologyName || "this manual"}” and all its files? This action cannot be undone.`} confirmText="Delete" onCancel={() => setDeleteTarget(null)} onConfirm={confirmDelete} />
  </div>;
};

export default TrainingManualsPage;
