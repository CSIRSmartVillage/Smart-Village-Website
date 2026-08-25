import { useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const AboutGallery = ({
  data,
}) => {
  const [activeImage, setActiveImage] =
    useState(null);

  const imageAlt = (image) =>
    image?.alt ||
    image?.title ||
    image?.caption ||
    "Gallery image";

  return (
    <>
      <section className="pt-10 pb-20 bg-slate-50">

      <div className="max-w-7xl mx-auto px-6">



        <Swiper
          modules={[
            Autoplay,
            Pagination,
          ]}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          spaceBetween={24}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },

            768: {
              slidesPerView: 2,
            },

            1200: {
              slidesPerView: 3,
            },
          }}
        >
          {data?.images?.map(
            (
              image,
              index
            ) => (
              <SwiperSlide
                key={index}
              >
                <div
                  className="
                    group
                    rounded-2xl
                    overflow-hidden
                    shadow-none
                    transition-shadow
                    duration-[350ms]
                    ease-out
                    hover:shadow-lg
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(image)
                    }
                    aria-label={
                      "Enlarge " +
                      imageAlt(image)
                    }
                    className="block w-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-blue-600"
                  >
                    <img
                      src={
                        image.imageUrl
                      }
                      alt={imageAlt(image)}
                      className="
                        w-full
                        h-[300px]
                        object-contain
                        transform-gpu
                        origin-center
                        transition-transform
                        duration-[350ms]
                        ease-out
                        group-hover:scale-110
                      "
                    />
                  </button>
                </div>
              </SwiperSlide>
            )
          )}
        </Swiper>

      </div>

      </section>

      <Lightbox
        open={Boolean(activeImage)}
        close={() => setActiveImage(null)}
        slides={
          activeImage
            ? [
                {
                  src: activeImage.imageUrl,
                  alt: imageAlt(activeImage),
                },
              ]
            : []
        }
        controller={{
          closeOnBackdropClick: true,
        }}
        render={{
          buttonPrev: () => null,
          buttonNext: () => null,
        }}
        styles={{
          container: {
            backgroundColor:
              "rgba(2, 6, 23, 0.86)",
          },
        }}
      />
    </>
  );
};

export default AboutGallery;