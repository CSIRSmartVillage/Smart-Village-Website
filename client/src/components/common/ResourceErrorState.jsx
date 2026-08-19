import { AlertTriangle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const ResourceErrorState = ({
  title,
  message,
  backTo,
  backLabel = "Go Back",
  onRetry,
}) => (
  <section className="mx-auto flex min-h-[420px] max-w-3xl items-center justify-center px-6 py-16">
    <div
      className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
      role="alert"
    >
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
        <AlertTriangle size={28} aria-hidden="true" />
      </span>
      <h1 className="mt-5 text-3xl font-bold text-slate-950">{title}</h1>
      <p className="mx-auto mt-3 max-w-xl leading-7 text-slate-600">
        {message}
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Try Again
          </button>
        ) : null}
        {backTo ? (
          <Link
            to={backTo}
            className="inline-flex items-center rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {backLabel}
          </Link>
        ) : null}
      </div>
    </div>
  </section>
);

export default ResourceErrorState;