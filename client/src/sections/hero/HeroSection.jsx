import { useCallback, useEffect, useMemo, useState } from "react";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const HeroSection = ({ data = {} }) => {
  const {
    heading = "Smart Village Management Portal",

    subHeading =
      "Empowering Rural Communities Through Technology and Sustainable Development",

    buttonText = "Explore Villages",

    buttonLink = "/villages",

    heroImages = [],
  } = data;

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
            Fixed Glass Content Card
        ============================ */}

       <div
className="
hidden
md:block
pointer-events-none
absolute
left-8
top-[58%]
z-40
w-[400px]
lg:w-[480px]
-translate-y-1/2
lg:left-20
"
>
          <div className="
rounded-3xl
border
border-white/15
bg-black/45
p-8
text-white
shadow-[0_20px_45px_rgba(0,0,0,0.4)]
backdrop-blur-[3px]
"
          >
            <p
              className="
                mb-4
                text-base
                font-bold
                uppercase
                tracking-[0.35em]
                text-cyan-300
              "
            >
              CSIR-CBRI, Roorkee
            </p>

            <h1
              className="
                text-3xl
                font-bold
                leading-tight
                lg:text-4xl
              "
            >
              {heading}
            </h1>

            <p
              className="
                mt-6
                text-lg
                leading-8
                text-slate-200
              "
            >
              {subHeading}
            </p>

          </div>
        </div>

        {/* ===========================
              Embla Viewport
        ============================ */}

        <div
          className="overflow-hidden"
          ref={emblaRef}
        >
          <div className="flex">

            {heroImages.map((image, index) => {

              const active =
                index === selectedIndex;

              return (

                <div
                  key={image._id || index}
                  className="
                    min-w-0
                    flex-[0_0_88%]
                    pl-4
                    pr-4

                    md:flex-[0_0_82%]

                    lg:flex-[0_0_78%]

                    xl:flex-[0_0_76%]
                  "
                >

                  <div
                    className={`
                      relative
h-[280px]
sm:h-[340px]
md:h-[400px]
lg:h-[460px]
xl:h-[500px]
                      overflow-hidden
                      rounded-[32px]
                      transition-all
                      duration-700
                      ${active
                        ? "scale-100"
                        : "scale-[0.92]"
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
                      sizes="(min-width: 1280px) 76vw, (min-width: 1024px) 78vw, (min-width: 768px) 82vw, 88vw"
                      className={`
                        h-full
                        w-full
                        object-contain
                        transition-all
                        duration-[6000ms]
                        ease-linear
                        ${
                          active
                            ? "scale-110"
                            : "scale-100"
                        }
                      `}
                    />

                    {/* Overlay */}

                    <div
                      className={`
                        absolute
                        inset-0
                        transition-all
                        duration-700

                        ${
                          active
                            ? "bg-gradient-to-t from-black/55 via-black/15 to-transparent"
                            : "bg-black/55"
                        }
                      `}
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
