import { ChevronDown, Cpu, Layers3 } from "lucide-react";
import { useMemo } from "react";

import TechnologyCard, { ProgressBar } from "./TechnologyCard";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const SectorAccordion = ({
  sector,
  isOpen,
  onToggle,
}) => {
  const technologies = useMemo(
    () =>
      [...(sector.technologies || [])].sort(
        (a, b) => (a.order || 0) - (b.order || 0)
      ),
    [sector.technologies]
  );

  return (
    <section className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-6 text-left transition hover:bg-blue-50/60"
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
              <Layers3 size={24} />
            </div>

            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                {sector.title}
              </h3>

              {sector.description && (
                <SmartTextRenderer
                  text={sector.description}
                  className="mt-2 max-w-3xl"
                />
              )}

              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                <Cpu size={15} />
                {technologies.length} technolog
                {technologies.length === 1 ? "y" : "ies"}
              </div>
            </div>
          </div>

          <div className="flex min-w-64 items-center justify-end gap-5">
            {sector.showProgress !== false && (
              <div className="flex-1">
                <ProgressBar value={sector.progress} />
              </div>
            )}

            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-700 text-white transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`}
            >
              <ChevronDown size={20} />
            </div>
          </div>
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-5 border-t border-blue-100 bg-slate-50 p-6">
            {technologies.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                No technologies added in this sector yet.
              </div>
            ) : (
              technologies.map((technology) => (
                <TechnologyCard
                  key={technology._id}
                  technology={technology}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectorAccordion;
