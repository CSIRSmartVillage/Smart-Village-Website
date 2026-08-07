import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const MissionObjectives = ({
  data = {},
}) => {
  const {
    heading =
      "Mission Objectives",

    description =
      "The SMART Village initiative focuses on sustainable, technology-driven development to improve quality of life, strengthen rural infrastructure, and empower communities.",

    objectives = [],
  } = data;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-700 font-semibold uppercase tracking-wider">
            SMART Village Mission
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="mt-4 max-w-3xl"
          />

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {objectives.map(
            (
              objective,
              index
            ) => (
              <div
                key={index}
                className="
                  bg-white
                  border
                  border-slate-200
                  rounded-2xl
                  p-8
                  shadow-sm
                  hover:shadow-lg
                  transition
                  duration-300
                "
              >
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-5">
                  <div className="w-6 h-6 rounded-full bg-blue-700"></div>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {objective.title}
                </h3>

                <SmartTextRenderer
                  text={objective.description}
                  className="max-w-none"
                />

              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
};

export default MissionObjectives;
