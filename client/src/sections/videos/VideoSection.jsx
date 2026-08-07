import {
  useEffect,
  useState,
} from "react";

import {
  Play,
} from "lucide-react";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  getPublicVideos,
} from "../../services/video.service";

const getUploadedVideoUrl =
  (video) =>
    video.videoUrl ||
    video.media?.url ||
    "";

const getThumbnailUrl =
  (video) =>
    video.thumbnailUrl ||
    video.media?.thumbnailUrl ||
    "";

const VideoSection = () => {
  const [videos, setVideos] =
    useState([]);

  const [playingId,
    setPlayingId] =
    useState(null);

  const [swiper,
    setSwiper] =
    useState(null);

  useEffect(() => {
    const loadVideos =
      async () => {
        try {
          const data =
            await getPublicVideos();

          setVideos(
            Array.isArray(data)
              ? data
              : []
          );
        } catch (error) {
          console.error(error);
        }
      };

    loadVideos();
  }, []);

  const startPlaying = (id) => {
    setPlayingId(id);
    swiper?.autoplay?.stop();
  };

  const resumeCarousel = () => {
    setPlayingId(null);
    swiper?.autoplay?.start();
  };

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="uppercase tracking-widest text-blue-600">
            Smart Village Media
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Videos & Documentaries
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Explore CSIR Smart Village
            initiatives, success stories,
            technology demonstrations,
            and rural transformation
            journeys.
          </p>
        </div>

        <Swiper
          modules={[
            Autoplay,
            Navigation,
            Pagination,
          ]}
          onSwiper={setSwiper}
          observer
          observeParents
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          loop={videos.length > 3}
          navigation
          pagination={{
            clickable: true,
          }}
          spaceBetween={24}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
        >
          {videos.map((video) => {
            const uploadedVideoUrl =
              getUploadedVideoUrl(
                video
              );

            const thumbnailUrl =
              getThumbnailUrl(
                video
              );

            const isUploadedVideo =
              Boolean(
                uploadedVideoUrl
              );

            return (
              <SwiperSlide
                key={video._id}
              >
                <div className="h-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl">
                  {isUploadedVideo &&
                  playingId ===
                    video._id ? (
                    <video
                      src={
                        uploadedVideoUrl
                      }
                      poster={
                        thumbnailUrl
                      }
                      controls
                      autoPlay
                      playsInline
                      onEnded={
                        resumeCarousel
                      }
                      className="h-44 w-full bg-black object-cover"
                    />
                  ) : isUploadedVideo ? (
                    <button
                      type="button"
                      onClick={() =>
                        startPlaying(
                          video._id
                        )
                      }
                      className="group relative block w-full overflow-hidden"
                      aria-label={`Play ${video.title}`}
                    >
                      {thumbnailUrl ? (
                        <img
                          src={
                            thumbnailUrl
                          }
                          alt={video.title}
                          className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <video
                          src={
                            uploadedVideoUrl
                          }
                          muted
                          preload="metadata"
                          className="h-44 w-full object-cover"
                        />
                      )}

                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-blue-600 shadow-lg">
                          <Play
                            size={20}
                            fill="currentColor"
                          />
                        </span>
                      </span>
                    </button>
                  ) : (
                    <a
                      href={
                        video.youtubeUrl
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="group relative block overflow-hidden"
                    >
                      <img
                        src={
                          thumbnailUrl
                        }
                        alt={video.title}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-blue-600 shadow-lg">
                          <Play
                            size={20}
                            fill="currentColor"
                          />
                        </span>
                      </span>
                    </a>
                  )}

                  <div className="p-4">
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900">
                      {video.title}
                    </h3>

                    <p className="line-clamp-2 text-sm text-slate-600">
                      {
                        video.description
                      }
                    </p>

                    {isUploadedVideo ? (
                      <button
                        type="button"
                        onClick={() =>
                          startPlaying(
                            video._id
                          )
                        }
                        className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Watch Video →
                      </button>
                    ) : (
                      <a
                        href={
                          video.youtubeUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Watch Video →
                      </a>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default VideoSection;