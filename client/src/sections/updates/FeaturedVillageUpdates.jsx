import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import SmartTextRenderer from "../../components/common/SmartTextRenderer";
import { getHomePageNews } from "../../services/event.service";

const formatType = (type = "EVENT") =>
  type.charAt(0) + type.slice(1).toLowerCase();

const FeaturedVillageUpdates = ({
  data = {},
}) => {
  const {
    heading = "Latest Updates",
    description =
      "Stay informed about recent developments, announcements, initiatives and activities under the SMART Village Mission.",
  } = data;

  const navigate = useNavigate();
  const [updates, setUpdates] = useState([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    const loadUpdates = async () => {
      try {
        const events = await getHomePageNews();
        setUpdates(events);
      } catch (error) {
        console.error(error);
        setUpdates([]);
      }
    };

    loadUpdates();
  }, []);

  const openUpdate = (item) => {
    const villageSlug = item.village?.slug;

    if (!villageSlug) return;

    navigate(
      `/village/${villageSlug}/events/${item.slug}`
    );
  };

  return (
    <section
      id="updates"
      className="bg-slate-50 py-24"
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="font-semibold uppercase tracking-wider text-blue-700">
            LATEST UPDATES
          </span>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="mt-4 max-w-3xl"
          />
        </div>

        {updates.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">
            No featured News & Updates are available at this time.
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              aria-label="Previous news item"
              onClick={() => swiperRef.current?.slidePrev()}
              className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white text-xl font-semibold text-blue-700 shadow-md transition hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:left-3"
            >
              ←
            </button>

            <button
              type="button"
              aria-label="Next news item"
              onClick={() => swiperRef.current?.slideNext()}
              className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-blue-200 bg-white text-xl font-semibold text-blue-700 shadow-md transition hover:bg-blue-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:right-3"
            >
              →
            </button>

            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
            modules={[Autoplay, Pagination]}
            autoplay={{
              delay: 2000,
              pauseOnMouseEnter: true,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            loop={updates.length > 3}
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
              {updates.map((item) => (
                <SwiperSlide key={item._id}>
                <div
                  onClick={() => openUpdate(item)}
                  className="flex h-[320px] cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <span className="inline-flex w-fit items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                    📰 {formatType(item.type).toUpperCase()}
                  </span>

                  <p className="mt-3 text-xs text-slate-500">
                    {new Date(
                      item.eventDate || item.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>

                  <h3 className="mb-3 mt-2 min-h-[56px] line-clamp-2 text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>

                  <SmartTextRenderer
                    text={
                      item.summary ||
                      item.description
                    }
                    className="min-h-[96px] max-w-none space-y-0 [&_p]:mb-0 [&_p]:line-clamp-4 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-slate-600 [&_p]:text-left"
                  />

                  <div className="mt-auto pt-4">
                    <span className="font-semibold text-blue-600">
                      Read More →
                    </span>
                  </div>
                </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedVillageUpdates;
