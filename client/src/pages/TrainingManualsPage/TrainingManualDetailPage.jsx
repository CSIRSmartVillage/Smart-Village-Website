import { useQuery } from "@tanstack/react-query";
import { Download, Eye, File, FileImage, FileText, Video } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getTrainingManual } from "../../services/trainingManual.service";

const fileIcon = (mime = "") => mime.startsWith("image/") ? FileImage : mime.startsWith("video/") ? Video : mime === "application/pdf" ? FileText : File;
const fileSize = (size) => size < 1024 * 1024 ? `${(size / 1024).toFixed(1)} KB` : `${(size / (1024 * 1024)).toFixed(1)} MB`;

const TrainingManualDetailPage = () => {
  const { id } = useParams();
  const { data: manual, isLoading, isError } = useQuery({ queryKey: ["training-manual", id], queryFn: () => getTrainingManual(id), enabled: Boolean(id) });
  return <MainLayout><main className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
    <Link to="/training-manuals" className="font-semibold text-blue-700 hover:text-blue-900">← Training Manuals</Link>
    {isLoading ? <div className="py-16 text-center text-slate-500">Loading training manual...</div>
    : isError || !manual ? <div className="py-16 text-center text-red-700">Training manual could not be loaded.</div>
    : <><section className="mt-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"><h1 className="text-3xl font-bold text-slate-950">{manual.technologyName}</h1>{manual.description && <p className="mt-4 whitespace-pre-line leading-7 text-slate-600">{manual.description}</p>}</section>
      <section className="mt-8"><h2 className="text-2xl font-bold text-slate-900">Resources</h2>{manual.files.length === 0 ? <p className="mt-5 rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">Resources will be added soon.</p> : <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{manual.files.map((file) => { const Icon = fileIcon(file.mimeType); return <article key={file._id} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex min-w-0 items-start gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Icon size={18} /></span><div className="min-w-0"><h3 title={file.originalName} className="truncate text-sm font-semibold text-slate-900">{file.originalName}</h3><p className="mt-1 text-xs uppercase text-slate-500">{file.extension?.replace(".", "") || "File"}{file.size ? ` · ${fileSize(file.size)}` : ""}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><a href={file.viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-md bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800"><Eye size={14} /> View</a><a href={file.downloadUrl} className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Download size={14} /> Download</a></div></article>; })}</div>}</section></>}
  </main></MainLayout>;
};

export default TrainingManualDetailPage;
