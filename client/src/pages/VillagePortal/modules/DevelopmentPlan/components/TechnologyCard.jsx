import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const statusStyles = {
  PLANNED: "bg-slate-100 text-slate-700",
  IN_PROGRESS: "bg-blue-100 text-blue-700",
  DEPLOYED: "bg-cyan-100 text-cyan-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  ON_HOLD: "bg-amber-100 text-amber-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const ProgressBar = ({ value = 0 }) => {
  const progress = Math.min(Math.max(Number(value) || 0, 0), 100);

  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-600">Progress</span>
        <span className="font-semibold text-blue-700">{progress}%</span>
      </div>

      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-700 to-cyan-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const TechnologyCard = ({ technology }) => {
  const image =
    technology.image?.url ||
    technology.image?.secureUrl ||
    "https://placehold.co/800x500?text=CSIR+Technology";
  const status = technology.status || "PLANNED";
  const descriptionRef = useRef(null);
  const [isPreviewOpen, setIsPreviewOpen] =
    useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] =
    useState(false);
  const [canExpandDescription, setCanExpandDescription] =
    useState(false);
  const [descriptionHeight, setDescriptionHeight] =
    useState(0);

  useEffect(() => {
    const description = descriptionRef.current;

    if (!description) {
      setCanExpandDescription(false);
      return undefined;
    }

    const measureDescription = () => {
      setDescriptionHeight(
        description.scrollHeight
      );

      if (isDescriptionOpen) {
        return;
      }

      setCanExpandDescription(
        description.scrollHeight >
          description.clientHeight + 1
      );
    };

    measureDescription();

    window.addEventListener(
      "resize",
      measureDescription
    );

    return () =>
      window.removeEventListener(
        "resize",
        measureDescription
      );
  }, [isDescriptionOpen, technology.description]);

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [isPreviewOpen]);

  return (
    <>
      <article className="overflow-hidden rounded-3xl border border-blue-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-950/10">
        <div className="grid gap-0 md:grid-cols-[240px_1fr]">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="group h-56 overflow-hidden bg-slate-100 p-3 text-left md:h-64"
            aria-label={`Preview ${technology.technologyName} image`}
          >
            <div className="h-full min-h-52 overflow-hidden rounded-2xl shadow-md">
              <img
                src={image}
                alt={technology.technologyName}
                className="h-full w-full cursor-pointer object-contain object-center transition duration-500 group-hover:scale-105"
              />
            </div>
          </button>

          <div className="flex min-w-0 flex-col p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-semibold uppercase text-blue-700">
                  {technology.labName}
                </p>

                <h4 className="mt-1 text-xl font-bold text-slate-900">
                  {technology.technologyName}
                </h4>
              </div>

              <span
                className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[status] || statusStyles.PLANNED}`}
              >
                {status.replaceAll("_", " ")}
              </span>
            </div>

            {technology.description && (
              <div className="mt-4">
                <div
                  className="overflow-hidden transition-all duration-300 ease-out"
                  style={{
                    maxHeight:
                      isDescriptionOpen
                        ? `${descriptionHeight}px`
                        : "6rem",
                  }}
                >
                  <div
                    ref={descriptionRef}
                    className="overflow-hidden"
                    style={{
                      display: isDescriptionOpen
                        ? "block"
                        : "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp:
                        isDescriptionOpen
                          ? "unset"
                          : 2,
                    }}
                  >
                    <SmartTextRenderer
                      text={technology.description}
                      className="max-w-none [&_p]:mb-0 [&_p]:leading-7"
                    />
                  </div>
                </div>

                {canExpandDescription && (
                  <button
                    type="button"
                    onClick={() =>
                      setIsDescriptionOpen(
                        (current) => !current
                      )
                    }
                    className="mt-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900"
                  >
                    {isDescriptionOpen
                      ? "Read Less"
                      : "Read More"}
                  </button>
                )}
              </div>
            )}

            {technology.showProgress !== false && (
              <div className="mt-5">
                <ProgressBar value={technology.progress} />
              </div>
            )}
          </div>
        </div>
      </article>

      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"
          onMouseDown={() => setIsPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl"
            onMouseDown={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute -right-2 -top-12 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-800 shadow-lg transition hover:bg-blue-50"
              aria-label="Close image preview"
            >
              <X size={22} />
            </button>

            <div className="overflow-hidden rounded-3xl bg-white p-3 shadow-2xl">
              <img
                src={image}
                alt={technology.technologyName}
                className="max-h-[82vh] w-full rounded-2xl object-contain object-center"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TechnologyCard;
export { ProgressBar };
