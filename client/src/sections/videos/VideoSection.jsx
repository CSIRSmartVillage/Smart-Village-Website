import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Play,
  X,
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

const getYouTubeEmbedUrl = (url = "") => {
  if (!url) return "";

  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname.replace(/^www\./, "");
    let videoId = "";

    if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.split("/").filter(Boolean)[0] || "";
    } else if (
      hostname === "youtube.com" ||
      hostname === "m.youtube.com" ||
      hostname === "youtube-nocookie.com"
    ) {
      videoId = parsedUrl.searchParams.get("v") || "";

      if (!videoId) {
        const pathMatch = parsedUrl.pathname.match(
          /^\/(?:embed|shorts|live)\/([^/?]+)/
        );
        videoId = pathMatch?.[1] || "";
      }
    }

    if (!/^[\w-]{6,}$/.test(videoId)) return "";

    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
  } catch {
    return "";
  }
};


const VideoModal = ({
  isOpen,
  video,
  onClose,
  playerRef,
}) => {
  if (
    !isOpen ||
    !video ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const uploadedVideoUrl =
    getUploadedVideoUrl(video);
  const youTubeEmbedUrl =
    getYouTubeEmbedUrl(video.youtubeUrl);
  const thumbnailUrl = getThumbnailUrl(video);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        className="relative max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          autoFocus
          aria-label="Close video"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-white sm:right-4 sm:top-4"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-black">
          {uploadedVideoUrl ? (
            <video
              ref={playerRef}
              src={uploadedVideoUrl}
              poster={thumbnailUrl}
              controls
              autoPlay
              playsInline
              className="h-full w-full object-contain"
            />
          ) : youTubeEmbedUrl ? (
            <iframe
              src={youTubeEmbedUrl}
              title={video.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-white">
              This video is currently unavailable.
            </div>
          )}
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <h3
            id="video-modal-title"
            className="pr-10 text-2xl font-bold leading-tight text-slate-900 sm:text-3xl"
          >
            {video.title}
          </h3>

          {video.description && (
            <div className="mt-5 border-t border-slate-200 pt-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Description
              </h4>
              <p className="mt-3 whitespace-pre-line text-base leading-7 text-slate-700 sm:text-[17px]">
                {video.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

const VideoSection = () => {
  const [videos, setVideos] =
    useState([]);

  const [selectedVideo,
    setSelectedVideo] =
    useState(null);
  const [isModalOpen,
    setIsModalOpen] =
    useState(false);
  const videoPlayerRef = useRef(null);

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

  const handleOpenVideo = useCallback((video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    swiper?.autoplay?.stop();
  }, [swiper]);

  const closeVideo = useCallback(() => {
    videoPlayerRef.current?.pause();
    setIsModalOpen(false);
    setSelectedVideo(null);
    swiper?.autoplay?.start();
  }, [swiper]);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeVideo();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [isModalOpen, closeVideo]);

  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 text-center">
          <p className="uppercase tracking-widest text-blue-600">
            SMART Village Media
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            Videos & Documentaries
          </h2>

          <p className="mx-auto mt-4 max-w-3xl text-slate-600">
            Explore CSIR SMART Village
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

            return (
              <SwiperSlide
                key={video._id}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() =>
                    handleOpenVideo(video)
                  }
                  onKeyDown={(event) => {
                    if (
                      event.key === "Enter" ||
                      event.key === " "
                    ) {
                      event.preventDefault();
                      handleOpenVideo(video);
                    }
                  }}
                  aria-label={`Play ${video.title}`}
                  className="group h-full cursor-pointer overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <div className="relative block w-full overflow-hidden">
                    {thumbnailUrl ? (
                      <img
                        src={thumbnailUrl}
                        alt={video.title}
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : uploadedVideoUrl ? (
                      <video
                        src={uploadedVideoUrl}
                        muted
                        preload="metadata"
                        className="h-44 w-full object-cover"
                      />
                    ) : (
                      <span className="block h-44 w-full bg-slate-900" />
                    )}

                    <span className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white font-bold text-blue-600 shadow-lg">
                        <Play
                          size={20}
                          fill="currentColor"
                        />
                      </span>
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-slate-900">
                      {video.title}
                    </h3>

                    {video.description && (
                      <p className="line-clamp-2 text-sm text-slate-600">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <VideoModal
        isOpen={isModalOpen}
        video={selectedVideo}
        onClose={closeVideo}
        playerRef={videoPlayerRef}
      />
    </section>
  );
};

export default VideoSection;
