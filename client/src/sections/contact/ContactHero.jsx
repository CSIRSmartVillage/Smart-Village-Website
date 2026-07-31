import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const ContactHero = ({
  data = {},
}) => {
  return (
    <section className="border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-700">
            Contact
          </p>

          <h1 className="text-4xl font-bold text-slate-950 lg:text-5xl">
            {data.heading}
          </h1>

          <SmartTextRenderer
            text={data.description}
            className="mt-5 text-lg leading-8 text-slate-600"
          />
        </div>

      </div>
    </section>
  );
};

export default ContactHero;
