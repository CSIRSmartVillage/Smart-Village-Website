import { Link }
  from "react-router-dom";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const AboutPreview = ({
  data = {},
}) => {
  const {
    heading =
      "About SMART Village Mission",

    description =
      "Transforming rural communities through innovation, sustainability, and technology-driven development.",

    buttonText =
      "Learn More",

    buttonLink =
      "/about",
  } = data;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <span className="text-blue-700 font-semibold uppercase tracking-wider">
          About
        </span>

        <h2 className="text-4xl font-bold text-slate-900 mt-3 mb-6">
          {heading}
        </h2>

        <SmartTextRenderer
          text={description}
          className="mb-10"
        />

        <Link
          to={buttonLink}
          className="
            inline-flex
            items-center
            justify-center
            px-8
            py-4
            bg-blue-900
            text-white
            rounded-xl
            hover:bg-blue-800
            transition
          "
        >
          {buttonText}
        </Link>

      </div>
    </section>
  );
};

export default AboutPreview;
