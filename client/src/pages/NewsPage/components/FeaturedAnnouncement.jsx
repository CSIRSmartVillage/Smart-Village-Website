import {
  Link,
} from "react-router-dom";
import SmartTextRenderer
  from "../../../components/common/SmartTextRenderer";

const FeaturedAnnouncement = ({
  announcement,
}) => {
  if (!announcement)
    return null;

  return (
    <section
      className="
        mb-12
        p-8
        rounded-xl
        bg-orange-50
        border
        border-orange-200
      "
    >
      <span
        className="
          text-orange-700
          font-semibold
        "
      >
        📢 Featured Update
      </span>

      <h2
        className="
          text-3xl
          font-bold
          mt-3
        "
      >
        {announcement.title}
      </h2>

      <SmartTextRenderer
        text={announcement.summary}
        className="mt-4 max-w-none"
      />

      <Link
        to={`/announcements/${announcement.slug}`}
        className="
          inline-block
          mt-5
          text-orange-700
          font-semibold
        "
      >
        Read Update →
      </Link>
    </section>
  );
};

export default FeaturedAnnouncement;
