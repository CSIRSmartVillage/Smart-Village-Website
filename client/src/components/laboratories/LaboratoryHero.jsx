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

      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/15 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex w-full items-center px-[clamp(20px,4vw,96px)] py-6 sm:py-8 lg:py-10">
          <h1 className="min-w-0 w-full break-normal text-[clamp(24px,3vw,48px)] font-bold leading-[1.2] text-white [overflow-wrap:normal]">
            {laboratory.name}
          </h1>
        </div>
      </div>
    </section>
  );
};

export default LaboratoryHero;