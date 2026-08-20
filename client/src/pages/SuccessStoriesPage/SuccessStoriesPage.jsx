import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import MainLayout from "../../layouts/MainLayout";

import {
  getPublishedSuccessStoryVillages,
} from "../../services/successStory.service";

import {
  getPageBySlug,
} from "../../services/cms.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
const SuccessStoriesPage = () => {
  const [villages, setVillages] = useState([]);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadData = async () => {
      try {
        const [
          villagesData,
          successStoriesPage,
        ] = await Promise.all([
          getPublishedSuccessStoryVillages(),
          getPageBySlug("success-stories"),
        ]);

        setVillages(villagesData || []);
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


        {/* VILLAGE CARDS */}
        <section className="max-w-7xl mx-auto px-6 py-16 md:py-20 md:pb-28">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs font-bold tracking-[0.16em] uppercase text-blue-700 mb-2">
              Explore Village Success Stories
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-normal mt-3">
              Browse village-specific transformation journeys
            </h2>
            <p className="text-slate-600 mt-2 text-sm md:text-base leading-relaxed">
              Explore initiatives, outcomes and stories emerging from each village under the CSIR Smart Village Mission.
            </p>
          </div>

          {villages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center max-w-lg mx-auto flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">No Villages Registered</h3>
              <p className="text-sm text-slate-500">There are currently no active success stories or villages registered in this portal.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {villages.map((village) => {
                const imageUrl =
                  village.coverImage?.url ||
                  village.bannerImage?.url ||
                  "";

                return (
                  <Link
                    key={village._id}
                    to={`/success-stories/${village.slug}`}
                    className="group flex flex-col h-full justify-between rounded-xl overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <div>
                      <div className="relative h-56 bg-slate-100 overflow-hidden">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={village.name}
                            loading="lazy"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-50 to-slate-150 flex items-center justify-center text-blue-900/20 text-sm">
                            No Cover Image
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                          <span className="text-[10px] font-bold text-blue-300 tracking-wider uppercase mb-1 block">
                            PARTICIPATING VILLAGE
                          </span>
                          <h3 className="text-xl font-bold leading-tight tracking-tight">
                            {village.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-5">
                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                          {village.shortDescription ||
                            "Explore success stories, initiatives and outcomes from this village."}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="inline-flex items-center text-sm font-semibold text-blue-700 group-hover:text-blue-900 transition-colors">
                        View stories
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

        {/* VILLAGES GRID SKELETON */}
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
