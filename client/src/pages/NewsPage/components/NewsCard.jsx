import { Link }
  from "react-router-dom";
import SmartTextRenderer
  from "../../../components/common/SmartTextRenderer";

const NewsCard = ({
  article,
}) => {
  const imageUrl =
    article.coverImage?.url ||
    article.coverImage?.secureUrl ||
    article.featuredImage?.url;
  const villageSlug = article.village?.slug;
  const detailUrl = villageSlug
    ? `/village/${villageSlug}/events/${article.slug}`
    : `/news/${article.slug}`;
  const itemType = article.type || article.category;


  return (
    <div className="border rounded-xl p-6 shadow-sm">

      {imageUrl && (
  <img
    src={imageUrl}
    alt={article.title}
    decoding="async"
    fetchPriority="low"
    loading="lazy"
    className="w-full h-52 object-cover rounded-lg mb-4"
  />
)}

      <span className="text-sm text-blue-600">
        {itemType}
      </span>

      <h3 className="text-xl font-semibold mt-2">
        {article.title}
      </h3>

      <SmartTextRenderer
        text={article.summary}
        className="mt-3 max-w-none space-y-0 [&_p]:mb-0 [&_p]:line-clamp-3 [&_p]:text-base [&_p]:leading-7 [&_p]:text-slate-600 [&_p]:text-left"
      />

      <Link
        to={detailUrl}
        className="inline-block mt-4 text-blue-700 font-medium"
      >
        Read More →
      </Link>

    </div>
  );
};

export default NewsCard;
