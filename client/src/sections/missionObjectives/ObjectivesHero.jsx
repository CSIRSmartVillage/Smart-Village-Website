const ObjectivesHero = ({
  data,
}) => {
  return (
    <section
      className="relative flex min-h-[360px] items-center justify-center overflow-hidden text-white sm:min-h-[420px] md:min-h-[480px] lg:min-h-[520px]"
      style={{
        backgroundImage: data?.backgroundImage
          ? `url(${data.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#061A33]/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <h1 className="text-[30px] font-extrabold leading-tight tracking-[0.06em] text-white [text-shadow:0_3px_14px_rgba(0,0,0,0.5)] sm:text-[32px] md:text-[40px] lg:text-[56px] xl:text-[64px]">
          CSIR SMART VILLAGE MISSION
        </h1>
      </div>
    </section>
  );
};

export default ObjectivesHero;
