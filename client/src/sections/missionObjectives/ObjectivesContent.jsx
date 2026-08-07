import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const ObjectivesContent = ({
  data,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F4F9FF] py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -left-24 top-12 h-64 w-64 rounded-full border-[42px] border-blue-100/60"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-cyan-100/40 blur-3xl"
      />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <span className="text-blue-700 font-semibold uppercase tracking-wider">
            Mission Statement
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            Mission Statement
          </h2>
        </div>

        <div className="group rounded-[20px] border border-blue-100 border-l-[6px] border-l-[#2563EB] bg-white p-8 shadow-lg shadow-blue-900/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-l-[#3B82F6] hover:shadow-xl hover:shadow-blue-900/10 md:p-10">
          <SmartTextRenderer
            text={data?.description}
            className="max-w-none [&_p]:mb-0 [&_p]:text-[18px] [&_p]:leading-[1.8] [&_p]:text-[#4B5563]"
          />
        </div>
      </div>
    </section>
  );
};

export default ObjectivesContent;
