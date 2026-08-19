import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const ProfileMessage = ({
  data,
  preserveLineBreaks = false,
}) => {
  return (
    <section className="py-24 bg-white">

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          grid
          lg:grid-cols-5
          gap-12
          items-start
        "
      >

        <div className="lg:col-span-2">

          <img
            src={
              data?.image ||
              "https://placehold.co/600x700"
            }
            alt={data?.name}
            className="
              w-full
              rounded-2xl
              shadow-xl
              object-cover
            "
          />

        </div>

        <div className="lg:col-span-3">

          <span
            className="
              text-blue-600
              uppercase
              tracking-widest
              font-semibold
            "
          >
            Message
          </span>

          <h2
            className="
              text-4xl
              font-bold
              text-slate-900
              mt-3
            "
          >
            {data?.name}
          </h2>

          <p
            className={`
              text-blue-700
              font-semibold
              mt-2
              mb-8
              ${preserveLineBreaks ? "whitespace-pre-line" : ""}
            `}
          >
            {data?.designation}
          </p>

          <div
            className="
              border-l-4
              border-blue-600
              pl-6
              italic
              text-slate-700
              mb-8
            "
          >
            "Science, innovation and community participation are the foundations of sustainable rural development."
          </div>

          <SmartTextRenderer
            text={data?.message}
            className={`max-w-none ${preserveLineBreaks ? "whitespace-pre-line" : ""}`}
          />

        </div>

      </div>

    </section>
  );
};

export default ProfileMessage;
