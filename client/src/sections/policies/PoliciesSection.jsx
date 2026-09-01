import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const PoliciesSection = ({
  data = {},
}) => {
  const {
    heading =
      "Policies & Schemes",

    description =
      "Explore central and state initiatives supporting sustainable rural development and SMART Village transformation.",

    policies = [],
  } = data;

  return (
    <section
      id="policies"
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-700 font-semibold uppercase tracking-wider">
            GOVERNMENT SCHEMES
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="mt-4 max-w-3xl"
          />

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {policies.map(
            (
              policy,
              index
            ) => (
              <div
                key={index}
                className="
                  border
                  border-slate-200
                  rounded-2xl
                  p-6
                  hover:shadow-lg
                  transition
                "
              >
                <span className="text-sm text-blue-700 font-medium">
                  {
                    policy.category
                  }
                </span>

                <h3 className="text-xl font-semibold mt-3 mb-3">
                  {policy.title}
                </h3>

                <SmartTextRenderer
                  text={policy.description}
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

export default PoliciesSection;
