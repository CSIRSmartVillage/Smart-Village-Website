import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const AboutMission = ({
  data = {},
}) => {
  const {
    heading =
      "About SMART Village Mission",

    description =
      "The SMART Village Mission aims to transform rural communities through sustainable development, technology adoption, infrastructure improvement, and knowledge-based growth.",

    features = [],
  } = data;

  return (
    <section
      className="py-20 bg-white"
      id="mission"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-12">

          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="max-w-3xl"
          />

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {features.map(
            (
              feature,
              index
            ) => (
              <div
                key={index}
                className="
                  p-8
                  rounded-xl
                  shadow-md
                  border
                "
              >
                <h3 className="text-xl font-semibold mb-3">
                  {
                    feature.title
                  }
                </h3>

                <SmartTextRenderer
                  text={feature.description}
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

export default AboutMission;
