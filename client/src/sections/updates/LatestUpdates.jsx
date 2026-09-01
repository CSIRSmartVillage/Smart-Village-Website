import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
} from "react-router-dom";

import {
  getAllNews,
} from "../../services/news.service";

import {
  getPublicAnnouncements,
} from "../../services/announcement.service";

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
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const LatestUpdates = ({
  data = {},
}) => {
  const {
    heading =
      "Latest Updates",

    description =
      "Stay informed about recent developments, announcements, initiatives and activities under the SMART Village Mission.",
  } = data;


  const navigate =
  useNavigate();


  const [
    updates,
    setUpdates,
  ] = useState([]);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates =
    async () => {
      try {
        const news =
          await getAllNews();

        const announcements =
          await getPublicAnnouncements();

        const formattedNews =
          news.map((item) => ({
            ...item,
            type: "NEWS",
          }));

        const formattedAnnouncements =
          announcements.map(
            (item) => ({
              ...item,
              type:
                "ANNOUNCEMENT",
            })
          );

       const merged = [
  ...formattedNews,
  ...formattedAnnouncements,
].sort(
  (a, b) =>
    new Date(
      b.createdAt ||
      b.publishDate
    ) -
    new Date(
      a.createdAt ||
      a.publishDate
    )
);

        setUpdates(
          merged.slice(0, 4)
        );
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <section
      id="updates"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span
            className="
              text-blue-700
              font-semibold
              uppercase
              tracking-wider
            "
          >
            LATEST UPDATES
          </span>

          <h2
            className="
              text-4xl
              font-bold
              text-slate-900
              mt-3
            "
          >
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="mt-4 max-w-3xl"
          />

        </div>

       <Swiper
  modules={[
    Autoplay,
    Pagination,
  ]}
  autoplay={{
    delay: 2000,
    pauseOnMouseEnter: true,
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
  {updates.map((item) => (
    <SwiperSlide
      key={item._id}
    >
      <div
        onClick={() => {
          if (
            item.type ===
            "NEWS"
          ) {
            navigate(
              `/news/${item.slug}`
            );
          } else {
            navigate(
              `/announcements/${item.slug}`
            );
          }
        }}
        className="
          bg-white
          border
          border-slate-200
          rounded-2xl
          p-6
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-2
          hover:shadow-xl
          cursor-pointer
          h-[320px]
          flex
          flex-col
        "
      >
        <span
          className={
            item.type ===
            "NEWS"
              ? `
                inline-flex
                w-fit
                items-center
                bg-blue-100
                text-blue-700
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
              `
              : `
                inline-flex
                w-fit
                items-center
                bg-orange-100
                text-orange-700
                px-3
                py-1
                rounded-full
                text-xs
                font-semibold
              `
          }
        >
          {item.type ===
          "NEWS"
            ? "📰 NEWS"
            : "📢 ANNOUNCEMENT"}
        </span>

        <p
          className="
            text-xs
            text-slate-500
            mt-3
          "
        >
          {new Date(
            item.createdAt ||
              item.publishDate
          ).toLocaleDateString(
            "en-IN"
          )}
        </p>

       <h3
  className="
    text-lg
    font-semibold
    text-slate-900
    mt-2
    mb-3
    line-clamp-2
    min-h-[56px]
  "
>
          {item.title}
        </h3>

        <p
  className="
    text-slate-600
    text-sm
    line-clamp-4
    min-h-[96px]
  "
>
          {item.summary ||
            item.description ||
            item.content}
        </p>

        <div
          className="
            mt-auto
            pt-4
          "
        >
          <span
            className="
              text-blue-600
              font-semibold
            "
          >
            Read More →
          </span>
        </div>
      </div>
    </SwiperSlide>
  ))}
</Swiper>


      </div>
    </section>
  );
};

export default LatestUpdates;
