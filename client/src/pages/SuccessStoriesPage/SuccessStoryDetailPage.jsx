import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import MainLayout
  from "../../layouts/MainLayout";

import {
  getSuccessStoryBySlug,
} from "../../services/successStory.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
const SuccessStoryDetailPage = () => {
  const { storySlug } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadStory =
      async () => {
        try {
          const data =
            await getSuccessStoryBySlug(
              storySlug
            );

          setStory(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
          setTimeout(() => setAnimate(true), 50);
        }
      };

    loadStory();
  }, [storySlug]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  if (loading) {
    return <SuccessStoryDetailSkeleton />;
  }

  if (!story) {
    return (
      <MainLayout>
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-3xl font-bold text-slate-900 tracking-normal">
            Story not found
          </h1>
          <p className="text-slate-500 mt-2">The success story narrative profile you requested could not be found.</p>
          <Link to="/success-stories" className="inline-flex mt-6 bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition shadow-sm">
            ← Back to Success Stories
          </Link>
        </div>
      </MainLayout>
    );
  }
  const displayTitle =
    story.title ||
    "Untitled Success Story";


  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen">
        {/* HERO DETAILS ROW */}
        <section className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <Link
            to="/success-stories"
            className="group inline-flex items-center gap-1.5 mb-6 text-sm font-semibold text-blue-700 hover:text-blue-900 transition outline-none focus-visible:underline"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-250">←</span>
            Back to Success Stories
          </Link>

          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start">
            <div className={`transition-all duration-700 ease-out transform ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                {story.village?.name && (
                  <span className="px-3 py-1 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">
                    {story.village.name}
                  </span>
                )}

                {story.isFeatured && (
                  <span className="px-3 py-1 rounded bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-bold uppercase tracking-wider">
                    Featured Story
                  </span>
                )}

                {story.status && (
                  <span className="px-3 py-1 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                    {story.status}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-normal text-slate-900 leading-tight">
                {displayTitle}
              </h1>

              <div className="mt-4 text-xs font-semibold text-slate-500 flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {story.publishedAt
                  ? new Date(story.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })
                  : "Not published yet"}
              </div>

              {story.summary && (
                <div className="mt-6 border-l-2 border-slate-200 pl-5">
                  <SmartTextRenderer
                    text={story.summary}
                    className="max-w-none"
                  />
                </div>
              )}
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm w-full h-[200px] md:h-[250px]">
              {story.featuredImage?.url ? (
                <img
                  src={story.featuredImage.url}
                  alt={displayTitle}
                  loading="lazy"
                  className="w-full h-full object-contain bg-slate-100/50 hover:scale-103 transition duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-200 flex items-center justify-center text-blue-900/20 text-sm">
                  No Image Available
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT NARRATIVE */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <div className={story.videoUrl ? "grid lg:grid-cols-[1.3fr_0.7fr] gap-10 items-start" : ""}>
            <div className="prose prose-slate max-w-none bg-white p-6 md:p-8 rounded-xl border border-slate-200/70 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">Project Narrative</h2>
              <SmartTextRenderer
                text={story.story || "Story content will be added soon."}
                className="max-w-none"
              />

              {story.impact && (
                <>
                  <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100">Project Impact & Outcomes</h2>
                  <SmartTextRenderer
                    text={story.impact}
                    className="max-w-none"
                  />
                </>
              )}
            </div>

              {story.videoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm">
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(story.videoUrl)}
                      title={displayTitle}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
          </div>
        </section>

        {/* MEDIA GALLERY SECTION */}
        {story.galleryImages?.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 pb-20">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Impact Media Gallery
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {story.galleryImages.map((image) => (
                <div
                  key={image._id}
                  className="group rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative"
                >
                  <div className="h-64 overflow-hidden bg-slate-100">
                    {image?.url ? (
                      <img
                        src={image.url}
                        alt={image.originalName || displayTitle}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-blue-50 to-slate-150" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
};

/* PULSING SKELETON LOADER FOR STORY DETAILS */
const SuccessStoryDetailSkeleton = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* HERO DETAILS SKELETON */}
        <section className="max-w-6xl mx-auto px-6 pt-14 pb-10 animate-pulse">
          <div className="h-4 w-36 bg-slate-200 rounded mb-6"></div>

          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 items-start">
            <div>
              <div className="flex gap-3 mb-4">
                <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
                <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
              </div>
              <div className="h-10 w-5/6 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 w-32 bg-slate-200 rounded mb-8"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
            </div>

            <div className="h-[280px] bg-slate-200 rounded-xl border border-slate-200"></div>
          </div>
        </section>

        {/* CONTENT SKELETON */}
        <section className="max-w-6xl mx-auto px-6 pb-14 animate-pulse">
          <div>
            <div>
              <div className="h-6 w-32 bg-slate-200 rounded mb-4"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
              <div className="h-4 w-5/6 bg-slate-200 rounded mb-8"></div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

function getEmbedUrl(url = "") {
  if (!url) return "";

  if (url.includes("youtube.com/watch?v=")) {
    const videoId =
      url.split("v=")[1]?.split("&")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  if (url.includes("youtu.be/")) {
    const videoId =
      url.split("youtu.be/")[1]?.split("?")[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  return url;
}

export default SuccessStoryDetailPage;
