import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const AboutSkeleton = () => (
  <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="space-y-5 p-6 sm:p-8 lg:p-10">
      <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
      <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
      <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="space-y-3 pt-3">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-11/12 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-10/12 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  </section>
);

const AboutSection = ({ profile, loading = false }) => {
  if (loading) {
    return <AboutSkeleton />;
  }

  const subtitle = profile?.aboutSubtitle || "";
  const description = profile?.overview || "";

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="p-6 sm:p-8 lg:p-10">
        <div className="max-w-5xl">
          <h2 className="text-3xl font-bold leading-tight text-slate-950 sm:text-4xl">
            Village Information
          </h2>

          {subtitle ? (
            <p className="mt-4 max-w-3xl text-base font-medium leading-7 text-blue-800">
              {subtitle}
            </p>
          ) : null}

          <SmartTextRenderer
            text={
              description ||
              "Village profile information will be updated soon."
            }
            className="mt-6 max-w-none"
          />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
