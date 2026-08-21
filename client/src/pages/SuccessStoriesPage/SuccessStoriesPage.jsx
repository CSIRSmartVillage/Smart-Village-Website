import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getPublishedSuccessStories,
} from "../../services/successStory.service";

import {
  getPageBySlug,
} from "../../services/cms.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
const SuccessStoriesPage = () => {
  const [stories, setStories] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const [
          storiesData,
          successStoriesPage,
        ] = await Promise.all([
          getPublishedSuccessStories(),
          getPageBySlug("success-stories"),
        ]);

        setStories(storiesData || []);
        setPageData(successStoriesPage || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
        // Trigger entrance animations after elements load
        setTimeout(() => setAnimate(true), 50);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);


  const heroSection =
    pageData?.sections?.find(
      (section) =>
        section.sectionType ===
        "SUCCESS_STORIES_HERO"
    );

  const heroEyebrow =
    heroSection?.subtitle ??
    "REAL IMPACT FROM SMART VILLAGE INITIATIVES";

  const heroTitle =
    heroSection?.title ??
    "Success Stories";

  const heroDescription =
    heroSection?.content?.description ??
    "Discover how innovation, science, community participation, and sustainable development initiatives are transforming villages under the CSIR Smart Village Mission.";

  const heroImage =
    heroSection?.content?.backgroundImage ||
    heroSection?.content?.heroImage?.url ||
    "";


  if (loading) {
    return <SuccessStoriesSkeleton />;
  }

  return (
    <MainLayout>
      <div className="bg-slate-50/50 min-h-screen">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden min-h-[420px] md:min-h-[480px] flex items-center bg-slate-900">
          {heroImage ? (
            <>
              <img
                src={heroImage}
                alt={heroTitle}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900" />
          )}

          <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24 text-white w-full">
            <div className={`max-w-4xl transition-all duration-700 ease-out transform ${animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              <div className="flex items-center gap-2 mb-4">
                <span className="h-1 w-8 bg-blue-400 rounded-full"></span>
                <p className="uppercase tracking-[0.22em] text-xs md:text-sm text-blue-200 font-bold">
                  {heroEyebrow}
                </p>
              </div>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-normal text-white">
                {heroTitle}
              </h1>

              <SmartTextRenderer
                text={heroDescription}
                className="mt-6 max-w-2xl text-slate-200 [&_*]:text-slate-200"
              />
            </div>
          </div>
        </section>


        {/* PUBLISHED STORY CARDS */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 md:pb-28">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700 mb-2">
              Published Success Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-normal mt-3">
              Transformation stories from Smart Villages
            </h2>
            <p className="text-slate-600 mt-2 text-sm md:text-base leading-relaxed">
              Explore published initiatives, outcomes and community stories from across the CSIR Smart Village Mission.
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
              <p className="text-sm text-slate-500">There are currently no published success stories. Please check back later.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {stories.map((story) => {
                const displayTitle =
                  story.title ||
                  "Untitled Success Story";

                return (
                <Link
                  key={story._id}
                  to={`/success-stories/story/${story.slug}`}
                  className="group flex flex-col h-full justify-between rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <div>
                    <div className="h-56 bg-slate-100 overflow-hidden relative">
                      {story.featuredImage?.url ? (
                        <img
                          src={story.featuredImage.url}
                          alt={displayTitle}
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
                      <div className="flex flex-wrap items-center gap-2">
                        {story.village?.name && (
                          <span className="text-[10px] font-bold text-blue-700 tracking-wider uppercase bg-blue-50 px-2 py-1 rounded">
                            {story.village.name}
                          </span>
                        )}

                        {story.isFeatured && (
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/50 font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold mt-3 text-slate-900 tracking-tight leading-snug group-hover:text-blue-800 transition-colors">
                        {displayTitle}
                      </h3>

                      <SmartTextRenderer
                        text={
                          story.summary ||
                          "Story details will be updated soon."
                        }
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
                );
              })}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
};

/* PULSING SKELETON LOADER FOR A PREMIUM INITIAL LOAD */
const SuccessStoriesSkeleton = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen">
        {/* HERO SKELETON */}
        <div className="relative min-h-[460px] md:min-h-[520px] bg-slate-900 flex items-center">
          <div className="max-w-7xl mx-auto px-6 w-full animate-pulse">
            <div className="h-4 w-36 bg-slate-800 rounded mb-4"></div>
            <div className="h-12 w-2/3 bg-slate-800 rounded mb-6"></div>
            <div className="h-4 w-1/2 bg-slate-800 rounded mb-2"></div>
            <div className="h-4 w-1/3 bg-slate-800 rounded"></div>
          </div>
        </div>

        {/* STORIES GRID SKELETON */}
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="h-4 w-32 bg-slate-200 rounded mb-3 animate-pulse"></div>
          <div className="h-8 w-1/2 bg-slate-200 rounded mb-8 animate-pulse"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="border border-slate-200 rounded-xl bg-white overflow-hidden animate-pulse">
                <div className="h-56 bg-slate-200"></div>
                <div className="p-6">
                  <div className="h-5 w-1/2 bg-slate-200 rounded mb-4"></div>
                  <div className="h-4 w-full bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};


export default SuccessStoriesPage;
