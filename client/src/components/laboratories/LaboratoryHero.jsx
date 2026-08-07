const LaboratoryHero = ({
  laboratory,
}) => {
  const heroImageUrl =
    laboratory?.heroImage?.url;

  return (
    <section className="relative h-[500px] overflow-hidden bg-slate-900 text-white">
      {heroImageUrl && (
        <img
          src={heroImageUrl}
          alt={laboratory.name}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="mx-auto max-w-7xl px-6 pb-8 sm:pb-10 lg:pb-12">
          <div className="w-full rounded-2xl border border-white/25 bg-blue-950/55 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-md sm:w-[70%] sm:p-8 lg:w-[38%]">
            <h1 className="break-words text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              {laboratory.name}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryHero;