import { useNavigate }
  from "react-router-dom";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const VillagesSection = ({
  data = {},
}) => {
  const navigate =
    useNavigate();

  const {
    heading =
      "Featured Villages",

    description =
      "Explore village-specific information, development plans, achievements, maps, indicators, and community activities.",

    villages = [],
  } = data;

  return (
    <section
      id="villages"
      className="py-24 bg-slate-50"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <span className="text-blue-700 font-semibold uppercase tracking-wider">
            SMART Villages
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

          {villages.map(
            (village) => (
              <div
                key={
                  village.slug
                }
                onClick={() =>
                  navigate(
                    `/village/${village.slug}/info`
                  )
                }
                className="
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  cursor-pointer
                "
              >
                <div className="h-48 bg-gradient-to-br from-green-100 to-green-300 flex items-center justify-center">

                  <span className="text-green-800 font-semibold">
                    {
                      village.name
                    }
                  </span>

                </div>

                <div className="p-6">

                  <h3 className="text-xl font-bold mb-2">
                    {
                      village.name
                    }
                  </h3>

                  <p className="text-slate-600">
                    {
                      village.district
                    }
                  </p>

                  <p className="text-slate-500 text-sm mb-4">
                    {
                      village.state
                    }
                  </p>

                  <span className="text-green-700 font-semibold">
                    View Village Portal →
                  </span>

                </div>

              </div>
            )
          )}

        </div>

      </div>
    </section>
  );
};

export default VillagesSection;
