import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const AboutOverview = ({
  data,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F4F9FF] py-20">

      <div
        aria-hidden="true"
        className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl"
      />

      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">

        <div className="rounded-[20px] border-l-[6px] border-blue-600 bg-white/95 px-7 py-10 shadow-[0_18px_50px_rgba(30,64,175,0.10)] sm:px-10 lg:px-12 lg:py-12">

          <div className="mb-16 text-center">

          <span
            className="text-blue-700 font-semibold uppercase tracking-wider"
          >
            About Mission
          </span>

          <h2
            className="text-4xl font-bold text-slate-900 mt-3"
          >
            Transforming Rural India Through Innovation
          </h2>

        </div>

        <SmartTextRenderer
          text={data?.description}
          className="max-w-none space-y-7 [&_p]:mb-0 [&_p]:text-[18px] [&_p]:leading-[1.8] [&_p]:text-[#4B5563] lg:[&_p]:text-[19px]"
        />

        </div>

      </div>

    </section>
  );
};

export default AboutOverview;
