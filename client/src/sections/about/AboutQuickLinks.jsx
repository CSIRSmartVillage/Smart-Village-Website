import { Link } from "react-router-dom";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const AboutQuickLinks = ({
  data,
}) => {
  const quickLinks =
    data?.links?.filter(
      (item) =>
        item.path !==
          "/about/mission-objectives" &&
        item.title !==
          "Mission Objectives"
    ) || [];

  const quickLinkIcons = {
    "/about/dg-desk": "👨‍💼",
    "/about/director-desk": "🏛️",
  };

  return (
    <section className="py-24 bg-white">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <span
            className="
              text-blue-600
              uppercase
              tracking-widest
              font-semibold
            "
          >
            Quick Access
          </span>

          <h2
            className="
              text-4xl
              font-bold
              mt-3
            "
          >
            {data?.heading}
          </h2>

        </div>

        <div
          className="
            grid
            auto-rows-fr
            md:grid-cols-2
            gap-8
            max-w-4xl
            mx-auto
          "
        >
          {quickLinks.map(
            (
              item,
              index
            ) => (
              <Link
                key={index}
                to={item.path}
                className="
                  bg-slate-50
                  rounded-2xl
                  p-8
                  text-center
                  hover:shadow-xl
                  transition
                  hover:-translate-y-2
                  h-full
                "
              >
                <div className="text-5xl mb-5">
                  {
                    quickLinkIcons[
                      item.path
                    ]
                  }
                </div>

                <h3
                  className="
                    text-xl
                    font-bold
                    text-slate-900
                  "
                >
                  {item.title}
                </h3>

                <SmartTextRenderer
                  text={item.description}
                  className="mt-3 max-w-none"
                />

                <div
                  className="
                    mt-5
                    text-blue-600
                    font-semibold
                  "
                >
                  View Details →
                </div>

              </Link>
            )
          )}
        </div>

      </div>

    </section>
  );
};

export default AboutQuickLinks;
