import { useCallback, useEffect, useMemo, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeroSection = ({ data = {} }) => {
  const { heroImages = [] } = data;
  /* --------------------------------------- */

  const autoplay = useMemo(
    () =>
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    []
  );

  const [emblaRef, emblaApi] =
    useEmblaCarousel(
      {
        loop: true,
        align: "center",
        duration: 30,
      },
      [autoplay]
    );

  /* --------------------------------------- */

  const [selectedIndex, setSelectedIndex] =
    useState(0);

  const [scrollSnaps, setScrollSnaps] =
    useState([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;

    setSelectedIndex(
      emblaApi.selectedScrollSnap()
    );
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    setScrollSnaps(
      emblaApi.scrollSnapList()
    );

    onSelect();

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  /* --------------------------------------- */

  const scrollPrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  if (!heroImages.length) return null;

  const previousIndex =
    (selectedIndex - 1 + heroImages.length) %
    heroImages.length;
  const nextIndex =
    (selectedIndex + 1) % heroImages.length;

  return (
    <section
      className="
      relative
      overflow-hidden
      bg-slate-950
      py-4 lg:py-6
    "
    >
      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-slate-800
        via-slate-800
        to-blue-900
      "
      />

      {/* Blur */}

      <div
        className="
        absolute
        -left-32
        top-20
        h-80
        w-80
        rounded-full
        bg-blue-500/20
        blur-[140px]
      "
      />

      <div
        className="
        absolute
        -right-32
        bottom-10
        h-80
        w-80
        rounded-full
        bg-cyan-500/20
        blur-[140px]
      "
      />

      <div
        className="
        relative
        z-20
        mx-auto
        max-w-[1800px]
      "
      >
        {/* ===========================
              Embla Viewport
        ============================ */}

        <div
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex items-center">

            {heroImages.map((image, index) => {

              const active =
                index === selectedIndex;

              const side = active
                ? "active"
                : index === previousIndex
                  ? "previous"
                  : index === nextIndex
                    ? "next"
                    : "other";

              return (

                <div
                  key={image._id || index}
                  className="
                    min-w-0
                    flex-[0_0_auto]
                    pl-4
                    pr-4
                  "
                >

                  <div
                    className={`
                      relative
                      w-fit
                      overflow-hidden
                      rounded-[32px]
                      transition-[transform,box-shadow]
                      duration-700
                      ease-in-out
                      ${active
                        ? "z-20 scale-100 shadow-[0_24px_70px_rgba(0,0,0,0.38)]"
                        : `z-10 scale-[0.92] ${
                            side === "previous"
                              ? "origin-right"
                              : side === "next"
                                ? "origin-left"
                                : ""
                          }`
                      }
                    `}
                  >

                    {/* Image */}

                    <img
                      src={image.url}
                      alt={
                        image.originalName ||
                        "Hero"
                      }
                      decoding="async"
                      fetchPriority={
                        index === 0
                          ? "high"
                          : "low"
                      }
                      loading={
                        index === 0
                          ? "eager"
                          : "lazy"
                      }
                      sizes="(min-width: 1280px) 68vw, (min-width: 1024px) 70vw, (min-width: 768px) 76vw, 86vw"
                      className="
                        block
                        relative
                        z-[1]
                        h-auto
                        w-auto
                        max-h-[280px]
                        max-w-[86vw]
                        object-contain
                        object-center
                        sm:max-h-[340px]
                        sm:max-w-[82vw]
                        md:max-h-[400px]
                        md:max-w-[76vw]
                        lg:max-h-[460px]
                        lg:max-w-[70vw]
                        xl:max-h-[500px]
                        xl:max-w-[min(68vw,1100px)]
                      "
                    />

                    {/* Directional edge fades for the neighboring previews */}

                    <div
                      aria-hidden="true"
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        z-[2]
                        transition-opacity
                        duration-700
                        ease-in-out
                        [--hero-side-fade-start:90%]
                        sm:[--hero-side-fade-start:88%]
                        md:[--hero-side-fade-start:84%]
                        lg:[--hero-side-fade-start:82%]
                        ${side === "previous" ? "opacity-100" : "opacity-0"}
                      `}
                      style={{
                        backgroundImage:
                          "linear-gradient(to right, var(--color-slate-800) 0%, color-mix(in srgb, var(--color-slate-800) 70%, transparent) 12%, color-mix(in srgb, var(--color-slate-800) 30%, transparent) 25%, transparent 42%)",
                      }}
                    />

                    <div
                      aria-hidden="true"
                      className={`
                        pointer-events-none
                        absolute
                        inset-0
                        z-[2]
                        transition-opacity
                        duration-700
                        ease-in-out
                        [--hero-side-fade-start:90%]
                        sm:[--hero-side-fade-start:88%]
                        md:[--hero-side-fade-start:84%]
                        lg:[--hero-side-fade-start:82%]
                        ${side === "next" ? "opacity-100" : "opacity-0"}
                      `}
                      style={{
                        backgroundImage:
                          "linear-gradient(to left, var(--color-slate-800) 0%, color-mix(in srgb, var(--color-slate-800) 70%, transparent) 12%, color-mix(in srgb, var(--color-slate-800) 30%, transparent) 25%, transparent 42%)",
                      }}
                    />

                    {/* Active Border */}

                    <div
                      className={`
                        absolute
                        inset-0
                        rounded-[32px]
                        border

                        ${
                          active
                            ? "border-white/20"
                            : "border-white/5"
                        }
                      `}
                    />

                  </div>

                </div>

              );

            })}

          </div>
        </div>
                {/* ===========================
            Navigation Buttons
        ============================ */}

        <button
          onClick={scrollPrev}
          aria-label="Previous Slide"
          className="
            absolute
            left-6
            top-1/2
            z-50
            hidden
            h-14
            w-14
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-white/10
            text-white
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-300
            hover:scale-110
            hover:bg-white
            hover:text-slate-900
            lg:flex
          "
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={scrollNext}
          aria-label="Next Slide"
          className="
            absolute
            right-6
            top-1/2
            z-50
            hidden
            h-14
            w-14
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            border
            border-white/20
            bg-white/10
            text-white
            shadow-xl
            backdrop-blur-xl
            transition-all
            duration-300
            hover:scale-110
            hover:bg-white
            hover:text-slate-900
            lg:flex
          "
        >
          <ChevronRight size={24} />
        </button>

        {/* ===========================
              Pagination
        ============================ */}

        <div
          className="
            mt-8
            flex
            justify-center
            gap-3
          "
        >
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-2.5
                rounded-full
                transition-all
                duration-500
                ${
                  selectedIndex === index
                    ? "w-12 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/80"
                }
              `}
            />
          ))}
        </div>

      </div>

    </section>
  );
};

export default HeroSection;
