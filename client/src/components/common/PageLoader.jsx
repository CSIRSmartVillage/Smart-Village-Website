import { Loader2 } from "lucide-react";

import csirLogo from "../../assets/logos/CSIR.jpg";
import smartVillageLogo from "../../assets/logos/SmartVillage.jpeg";

const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <div className="flex w-full max-w-md flex-col items-center px-8 text-center">
        {/* Logos */}
        <div className="mb-8 flex items-center justify-center gap-6">
          <img
            src={csirLogo}
            alt="CSIR-CBRI"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            className="h-20 w-20 rounded-full border border-slate-200 bg-white p-2 shadow-md"
          />

          <div className="h-12 w-px bg-slate-300" />

          <img
            src={smartVillageLogo}
            alt="Smart Village"
            decoding="async"
            fetchPriority="high"
            loading="eager"
            className="h-20 w-20 rounded-full border border-slate-200 bg-white p-2 shadow-md"
          />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-slate-900">
          Smart Village Portal
        </h2>

        <p className="mt-2 text-slate-600">
          CSIR-CBRI Roorkee
        </p>

        {/* Spinner */}
        <div className="mt-10">
          <Loader2
            className="animate-spin text-emerald-600"
            size={42}
          />
        </div>

        {/* Loading Text */}
        <p className="mt-6 text-sm text-slate-500">
          Loading content...
        </p>

        {/* Progress Animation */}
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
