import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const LogoGroup = ({
  logos,
  duplicate = false,
  measureRef,
  className = "",
}) => (
  <div
    ref={measureRef}
    aria-hidden={duplicate || undefined}
    className={`flex shrink-0 items-center gap-6 sm:gap-10 ${className}`}
  >
    {logos.map((item, index) => (
      <div
        key={`${item._id}-${index}`}
        className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:h-24 sm:w-48"
      >
        <img
          src={item.logo?.url}
          alt={
            duplicate
              ? ""
              : `Supporter logo ${index + 1}`
          }
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    ))}
  </div>
);

const SupporterLogoStrip = ({ logos = [] }) => {
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const [shouldScroll, setShouldScroll] =
    useState(false);

  const validLogos = useMemo(
    () =>
      logos.filter(
        (item) => item.logo?.url
      ),
    [logos]
  );

  useLayoutEffect(() => {
    const updateOverflow = () => {
      if (
        !viewportRef.current ||
        !measureRef.current
      ) {
        return;
      }

      setShouldScroll(
        measureRef.current.scrollWidth >
          viewportRef.current.clientWidth
      );
    };

    updateOverflow();

    if (
      typeof ResizeObserver === "undefined"
    ) {
      window.addEventListener(
        "resize",
        updateOverflow
      );

      return () =>
        window.removeEventListener(
          "resize",
          updateOverflow
        );
    }

    const observer = new ResizeObserver(
      updateOverflow
    );

    observer.observe(viewportRef.current);
    observer.observe(measureRef.current);

    return () => observer.disconnect();
  }, [validLogos.length]);

  if (!validLogos.length) {
    return null;
  }

  const animationDuration = `${Math.max(
    18,
    validLogos.length * 4
  )}s`;

  return (
    <section
      aria-label="Supporter logos"
      className="overflow-hidden border-b border-slate-200 bg-white py-6 sm:py-8"
    >
      <div className="mx-auto max-w-[1800px] px-6 sm:px-8">
        <div
          ref={viewportRef}
          className="relative overflow-hidden"
        >
          <LogoGroup
            logos={validLogos}
            duplicate
            measureRef={measureRef}
            className="invisible absolute w-max"
          />

          {shouldScroll ? (
            <div
              className="flex w-max animate-[lab-marquee_30s_linear_infinite] items-center"
              style={{
                animationDuration,
              }}
            >
              <LogoGroup
                logos={validLogos}
                className="pr-6 sm:pr-10"
              />
              <LogoGroup
                logos={validLogos}
                duplicate
                className="pr-6 sm:pr-10"
              />
            </div>
          ) : (
            <LogoGroup
              logos={validLogos}
              className="justify-center"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default SupporterLogoStrip;
