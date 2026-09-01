import { useQuery } from "@tanstack/react-query";
import {
  Download,
  Eye,
  File,
  FileImage,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { useOutletContext } from "react-router-dom";

import {
  getPublicGovernmentApprovals,
} from "../../../../services/governmentApproval.service";

const getFileIcon = (mimeType) => {
  if (mimeType?.startsWith("image/")) {
    return FileImage;
  }
  if (mimeType === "application/pdf") {
    return FileText;
  }
  return File;
};

const formatFileSize = (bytes = 0) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const GovernmentApprovalsPage = () => {
  const { village } = useOutletContext();
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [
      "government-approvals",
      village?.slug,
    ],
    queryFn: () =>
      getPublicGovernmentApprovals(village.slug),
    enabled: Boolean(village?.slug),
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 4 * 60 * 1000,
  });

  const approvals = Array.isArray(data) ? data : [];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-blue-100 bg-white p-7 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ShieldCheck size={25} />
          </span>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Government Approvals
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Published government approval documents for this village.
            </p>
          </div>
        </div>
      </section>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
          Loading approval documents...
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Unable to load Government Approvals
          </h2>
          <p className="mt-3 text-slate-500">
            Please try again after some time.
          </p>
        </div>
      ) : approvals.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <FileText
            size={42}
            className="mx-auto text-slate-300"
          />
          <h2 className="mt-4 text-xl font-semibold text-slate-800">
            No public approval documents available
          </h2>
          <p className="mt-2 text-slate-500">
            Published approval documents will appear here.
          </p>
        </div>
      ) : (
        <section className="grid gap-5 xl:grid-cols-2">
          {approvals.map((approval) => {
            const FileIcon = getFileIcon(
              approval.file?.mimeType
            );

            return (
              <article
                key={approval._id}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex min-w-0 items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <FileIcon size={23} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm font-semibold text-slate-800">
                      {approval.file?.originalName}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1">
                        {approval.file?.extension?.replace(
                          ".",
                          ""
                        ) || "File"}
                      </span>
                      {approval.file?.size > 0 && (
                        <span>
                          {formatFileSize(
                            approval.file.size
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {approval.title && (
                  <h2 className="mt-5 text-xl font-bold text-slate-950">
                    {approval.title}
                  </h2>
                )}

                {approval.description && (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
                    {approval.description}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap gap-3 pt-6">
                  {approval.viewUrl && (
                    <a
                      href={approval.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800"
                    >
                      <Eye size={17} />
                      View
                    </a>
                  )}
                  {approval.downloadUrl && (
                    <a
                      href={approval.downloadUrl}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      <Download size={17} />
                      Download
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
};

export default GovernmentApprovalsPage;
