const ObjectivesOutcomes = ({
  data,
}) => {
  return (
    <section className="py-24 bg-white">

      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">

          <span
            className="
              text-blue-700
              uppercase
              tracking-wider
              font-semibold
            "
          >
            Expected Outcomes
          </span>

          <h2
            className="
              text-4xl
              font-bold
              text-slate-900
              mt-3
            "
          >
            {data?.heading}
          </h2>

        </div>

        <div
          className="
            grid
            md:grid-cols-2
            gap-6
          "
        >
          {data?.items?.map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="
                  bg-slate-50
                  rounded-2xl
                  p-6
                  flex
                  gap-4
                  items-start
                "
              >
                <div
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-blue-600
                    text-white
                    flex
                    items-center
                    justify-center
                    font-bold
                    flex-shrink-0
                  "
                >
                  ✓
                </div>

                <p
                  className="
                    text-slate-700
                    leading-relaxed
                  "
                >
                  {item}
                </p>

              </div>
            )
          )}
        </div>

      </div>

    </section>
  );
};

export default ObjectivesOutcomes;