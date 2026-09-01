import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link, useParams } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getStoriesByVillageSlug,
} from "../../services/successStory.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const VillageSuccessStoriesPage = () => {
  const { villageSlug } = useParams();

  const [village, setVillage] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] =
    useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const data =
          await getStoriesByVillageSlug(
            villageSlug
          );

        setVillage(data.village);
        setStories(data.stories || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [villageSlug]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  const villageDescription =
    village?.fullDescription ||
    village?.shortDescription ||
    "Village description will be updated soon.";

  const shouldShowReadMore = useMemo(() => {
    return villageDescription.length > 700;
  }, [villageDescription]);

  const displayedDescription =
    showFullDescription || !shouldShowReadMore
      ? villageDescription
      : `${villageDescription.slice(0, 700)}...`;

  if (loading) {
    return <VillageSuccessStoriesSkeleton />;
  }

  if (!village) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-normal">
            Village not found
          </h1>
          <p className="text-slate-500 mt-2">The success story village profile you are looking for could not be found.</p>
          <Link to="/success-stories" className="inline-flex mt-6 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
            ← Back to Success Stories
          </Link>
        </div>
      </MainLayout>
    );
  }

  const bannerImage =
    village.bannerImage?.url ||
    village.coverImage?.url ||
    "";

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen">
        {/* HERO BANNER - Dynamic background with logo/branding and a refined overlay back button */}
        <section className="relative overflow-hidden">
          <div className="h-[280px] md:h-[380px] lg:h-[450px] bg-slate-900">
            {bannerImage ? (
              <img
                src={bannerImage}
                alt={village.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900" />
            )}
          </div>

          {/* overlay vignette */}
          <div className="absolute inset-0 bg-black/35" />

          {/* back button cleanly positioned and blur background */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6">
            <Link
              to="/success-stories"
              className="inline-flex items-center gap-2 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/50 px-4 py-2 text-xs md:text-sm font-semibold text-slate-800 shadow-sm hover:shadow hover:bg-white active:scale-95 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              ← Back to Success Stories
            </Link>
          </div>
        </section>

        {/* TWO-COLUMN GRID BELOW BANNER: OVERVIEW (LEFT) + VIDEO (RIGHT STICKY) */}
        <section className="max-w-7xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-12 items-start">
            {/* LEFT COLUMN: OVERVIEW */}
            <div>
              <span className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700 mb-2 block">
                Village Profile & Overview
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-normal leading-tight">
                About {village.name}’s transformation
              </h1>

              <div className="mt-6 border-l-2 border-slate-200 pl-5">
                <SmartTextRenderer
                  text={displayedDescription}
                  className="max-w-none"
                />
              </div>

              {shouldShowReadMore && (
                <button
                  type="button"
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-950 transition outline-none focus-visible:underline"
                >
                  {showFullDescription ? "Read less" : "Read more"}
                </button>
              )}
            </div>

            {/* RIGHT COLUMN: VIDEO (STICKY ON DESKTOP) */}
            {village.video && (
              <div className="lg:sticky lg:top-24">
                <span className="text-xs font-bold tracking-[0.16em] uppercase text-blue-750 mb-3 block lg:hidden">
                  Transformation Video
                </span>
                {renderVillageVideo(village.video, village.name, village)}
              </div>
            )}
          </div>
        </section>

        {/* STORIES SECTION GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-20 md:pb-28">
          <div className="mb-10 max-w-3xl border-t border-slate-200/60 pt-10">
            <span className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700 mb-2 block">
              Success Initiatives
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-normal">
              Impact Stories from {village.name}
            </h2>

            <p className="text-slate-600 mt-2 text-sm md:text-base leading-relaxed">
              Explore the innovative scientific modules, outcomes, and community participation frameworks emerging from this village under the CSIR SMART Village Mission.
            </p>
          </div>

          {stories.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center max-w-lg mx-auto flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Stories Published</h3>
              <p className="text-sm text-slate-500">There are currently no success stories published for this village. Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stories.map((story) => (
                <Link
                  key={story._id}
                  to={`/success-stories/${village.slug}/${story.slug}`}
                  className="group flex flex-col h-full justify-between rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div>
                    <div className="h-52 bg-slate-100 overflow-hidden relative">
                      {story.featuredImage?.url ? (
                        <img
                          src={story.featuredImage.url}
                          alt={story.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center text-blue-900/20 text-sm">
                          No Cover Image
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[10px] font-bold text-blue-650 tracking-wider uppercase bg-blue-50/50 px-2 py-0.5 rounded">
                          {story.status}
                        </span>

                        {story.isFeatured && (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mt-3 text-slate-900 tracking-tight leading-snug hover:text-blue-800 transition-colors">
                        {story.title}
                      </h3>

                      <SmartTextRenderer
                        text={story.summary}
                        className="mt-2 max-w-none space-y-0 [&_p]:mb-0 [&_p]:line-clamp-3 [&_p]:text-sm [&_p]:leading-relaxed [&_p]:text-slate-600 [&_p]:text-left"
                      />
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <div className="inline-flex items-center text-sm font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
                      Read story
                      <span className="inline-block transform group-hover:translate-x-1 transition-transform duration-200 ml-1">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

/* PULSING SKELETON LOADER FOR VILLAGE DETAILS */
const VillageSuccessStoriesSkeleton = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* BANNER SKELETON */}
        <div className="h-[280px] md:h-[380px] lg:h-[450px] bg-slate-900 animate-pulse relative"></div>

        {/* OVERVIEW SECTION SKELETON */}
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-12">
            <div className="animate-pulse">
              <div className="h-4 w-28 bg-slate-200 rounded mb-3"></div>
              <div className="h-10 w-2/3 bg-slate-200 rounded mb-6"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
            </div>

            <div className="border border-slate-200 rounded-xl bg-white p-4 animate-pulse shrink-0">
              <div className="aspect-video bg-slate-200 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* STORIES GRID SKELETON */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="h-4 w-32 bg-slate-200 rounded mb-3 animate-pulse"></div>
          <div className="h-8 w-1/2 bg-slate-200 rounded mb-8 animate-pulse"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-slate-200 rounded-xl bg-white overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-200"></div>
                <div className="p-5">
                  <div className="h-4 w-1/3 bg-slate-200 rounded mb-3"></div>
                  <div className="h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-4/5 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

function renderVillageVideo(
  video,
  villageName,
  village
) {
  if (!video) return null;

  // YOUTUBE
  if (video.type === "YOUTUBE") {
    const embedUrl =
      video.embedUrl ||
      getEmbedUrl(video.url);

    if (!embedUrl) return null;

    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md">
        <div className="aspect-video">
          <iframe
            src={embedUrl}
            title={`${villageName} video`}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  // UPLOADED VIDEO
  if (video.type === "UPLOAD") {
    const uploadedVideoUrl =
      video.media?.url ||
      video.url ||
      "";

    if (!uploadedVideoUrl) return null;

    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white p-3 shadow-md">
        <video
          controls
          className="w-full rounded-lg"
        >
          <source src={uploadedVideoUrl} />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // EXTERNAL / LINKEDIN / OTHER
  if (
    video.type === "EXTERNAL" &&
    video.url
  ) {
    const previewImage =
      village?.bannerImage?.url ||
      village?.coverImage?.url ||
      "";

    return (
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-md">
        <div className="relative aspect-video bg-slate-100">
          {previewImage ? (
            <img
              src={previewImage}
              alt={villageName}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : null}

          <div className="absolute inset-0 bg-black/50" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <p className="text-white text-lg font-bold">
              External Village Video
            </p>

            <p className="text-slate-200 mt-2 text-xs leading-relaxed max-w-xs">
              This video is hosted on an external platform. Click below to watch it.
            </p>

            <a
              href={video.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center mt-4 px-4 py-2.5 rounded-lg bg-white text-slate-900 text-xs font-semibold hover:bg-slate-50 transition active:scale-95 shadow-sm"
            >
              Watch Video
            </a>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

function getEmbedUrl(url = "") {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    const videoId =
      url
        .split("v=")[1]
        ?.split("&")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtube.com/shorts/")) {
    const videoId =
      url
        .split("youtube.com/shorts/")[1]
        ?.split("?")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtu.be/")) {
    const videoId =
      url
        .split("youtu.be/")[1]
        ?.split("?")[0];

    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

export default VillageSuccessStoriesPage;
