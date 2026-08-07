import { Fragment } from "react";

import HeroSection
  from "../../sections/hero/HeroSection";

import CSRAnnouncement
  from "../../sections/announcement/CSRAnnouncement";

import ImpactStatistics
  from "../../sections/mission/ImpactStatistics";


import LatestUpdates
  from "../../sections/updates/LatestUpdates";


  import AboutPreview
  from "../../sections/about/AboutPreview";


  import VideoSection
from "../../sections/videos/VideoSection";

const HeroSkeleton = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-4 lg:py-6">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-slate-800 to-blue-900" />

      <div className="relative z-20 mx-auto max-w-[1800px]">
        <div className="hidden md:block pointer-events-none absolute left-8 top-[58%] z-40 w-[400px] -translate-y-1/2 lg:left-20 lg:w-[480px]">
          <div className="rounded-3xl border border-white/15 bg-black/45 p-8 shadow-[0_20px_45px_rgba(0,0,0,0.4)] backdrop-blur-[3px]">
            <div className="mb-4 h-4 w-48 animate-pulse rounded bg-cyan-300/30" />
            <div className="h-10 w-full animate-pulse rounded bg-white/25" />
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded bg-white/20" />
            <div className="mt-6 h-4 w-full animate-pulse rounded bg-slate-200/20" />
            <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-slate-200/20" />
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="flex">
            <div className="min-w-0 flex-[0_0_88%] pl-4 pr-4 md:flex-[0_0_82%] lg:flex-[0_0_78%] xl:flex-[0_0_76%]">
              <div className="relative h-[280px] overflow-hidden rounded-[32px] border border-white/10 bg-slate-700/60 sm:h-[340px] md:h-[400px] lg:h-[460px] xl:h-[500px]">
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <div className="h-2.5 w-12 animate-pulse rounded-full bg-white/60" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/30" />
          <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-white/30" />
        </div>
      </div>
    </section>
  );
};

const HomeContentSkeleton = () => {
  return (
    <>
      <HeroSkeleton />

      <section className="bg-white py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div
              key={item}
              className="h-36 animate-pulse rounded-lg border border-slate-200 bg-slate-100"
            />
          ))}
        </div>
      </section>

      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="h-56 animate-pulse rounded-lg bg-slate-200" />
            <div className="h-56 animate-pulse rounded-lg bg-slate-200" />
          </div>
        </div>
      </section>
    </>
  );
};

const HomePageRenderer = ({
  sections,
  loading = false,
}) => {
  if (loading) {
    return <HomeContentSkeleton />;
  }

  return (
    <>
      {sections.map(
        (section) => {
          switch (
            section.sectionType
          ) {
            case "HERO":
              return (
                <Fragment
                  key={
                    section._id
                  }
                >
                  <HeroSection
                    data={
                      section.content
                    }
                  />
                  <CSRAnnouncement />
                </Fragment>
              );

                          case
              "LATEST_UPDATES":
              return (
                <LatestUpdates
                  key={
                    section._id
                  }
                  data={
                    section.content
                  }
                />
              );

case "ABOUT_PREVIEW":
  return (
    <VideoSection
      key={section._id}
    />
  );

            case
              "IMPACT_STATISTICS":
              return (
                <ImpactStatistics
                  key={
                    section._id
                  }
                  data={
                    section.content
                  }
                />
              );

          
            default:
              return null;
          }
        }
      )}
    </>
  );
};

export default HomePageRenderer;
