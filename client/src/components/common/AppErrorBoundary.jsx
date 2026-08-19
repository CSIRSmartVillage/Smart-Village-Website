import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

class AppErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error("Unexpected application error:", error, errorInfo);
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-16">
        <section
          className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm"
          role="alert"
        >
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-700">
            <AlertTriangle size={28} aria-hidden="true" />
          </span>
          <h1 className="mt-5 text-3xl font-bold text-slate-950">
            Something went wrong
          </h1>
          <p className="mt-3 leading-7 text-slate-600">
            We were unable to load this section. Please refresh the page and try again.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <RefreshCw size={18} aria-hidden="true" />
            Refresh Page
          </button>
        </section>
      </main>
    );
  }
}

export default AppErrorBoundary;