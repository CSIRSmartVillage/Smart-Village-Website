import {
  Component,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const getLogoKey = (item, index) =>
  item._id ||
  item.logo.publicId ||
  `${item.logo.url}-${index}`;

const LogoGroup = ({
  logos,
  duplicate = false,
  measureRef,
  className = "",
  onLogoError,
}) => (
  <div
    ref={measureRef}
    aria-hidden={duplicate || undefined}
    className={`flex shrink-0 items-center gap-6 sm:gap-10 ${className}`}
  >
    {logos.map((item, index) => {
      const logoKey = getLogoKey(item, index);

      return (
        <div
          key={`${duplicate ? "copy" : "logo"}-${logoKey}`}
          className="flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:h-24 sm:w-48"
        >
          <img
            src={item.logo.url}
            alt={
              duplicate
                ? ""
                : `Supporter logo ${index + 1}`
            }
            loading="lazy"
            decoding="async"
            onError={() => onLogoError(logoKey)}
            className="h-full w-full object-contain"
          />
        </div>
      );
    })}
  </div>
);

const SupporterLogoStrip = ({ logos = [] }) => {
  const viewportRef = useRef(null);
  const measureRef = useRef(null);
  const [shouldScroll, setShouldScroll] =
    useState(false);
  const [failedLogoKeys, setFailedLogoKeys] =
    useState(() => new Set());

  const validLogos = useMemo(
    () => {
      const logoItems = Array.isArray(logos)
        ? logos
        : [];

      return logoItems.filter((item, index) => {
        const url = item?.logo?.url;

        return (
          typeof url === "string" &&
          url.trim().length > 0 &&
          !failedLogoKeys.has(
            getLogoKey(item, index)
          )
        );
      });
    },
    [failedLogoKeys, logos]
  );

  const handleLogoError = useCallback(
    (logoKey) => {
      setFailedLogoKeys((currentKeys) => {
        if (currentKeys.has(logoKey)) {
          return currentKeys;
        }

        const nextKeys = new Set(currentKeys);
        nextKeys.add(logoKey);
        return nextKeys;
      });
    },
    []
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    const measurement = measureRef.current;

    if (!viewport || !measurement) {
      return undefined;
    }

    let animationFrameId;

    const updateOverflow = () => {
      window.cancelAnimationFrame(
        animationFrameId
      );
      animationFrameId =
        window.requestAnimationFrame(() => {
          const nextShouldScroll =
            measurement.scrollWidth >
            viewport.clientWidth;

          setShouldScroll((currentValue) =>
            currentValue === nextShouldScroll
              ? currentValue
              : nextShouldScroll
          );
        });
    };

    updateOverflow();

    if (
      typeof ResizeObserver === "undefined"
    ) {
      window.addEventListener(
        "resize",
        updateOverflow
      );

      return () => {
        window.cancelAnimationFrame(
          animationFrameId
        );
        window.removeEventListener(
          "resize",
          updateOverflow
        );
      };
    }

    const observer = new ResizeObserver(
      updateOverflow
    );

    observer.observe(viewport);

    return () => {
      window.cancelAnimationFrame(
        animationFrameId
      );
      observer.disconnect();
    };
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
            onLogoError={handleLogoError}
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
                onLogoError={handleLogoError}
              />
              <LogoGroup
                logos={validLogos}
                duplicate
                className="pr-6 sm:pr-10"
                onLogoError={handleLogoError}
              />
            </div>
          ) : (
            <LogoGroup
              logos={validLogos}
              className="justify-center"
              onLogoError={handleLogoError}
            />
          )}
        </div>
      </div>
    </section>
  );
};

class SupporterLogoStripBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    if (import.meta.env.DEV) {
      console.error(
        "Supporter logo strip could not be rendered:",
        error,
        errorInfo
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return (
      <SupporterLogoStrip
        logos={this.props.logos}
      />
    );
  }
}

export default SupporterLogoStripBoundary;
