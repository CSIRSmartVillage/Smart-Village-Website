import { ArrowRight, Star } from "lucide-react";
import { Link } from "react-router-dom";

import EventMeta from "./EventMeta";
import { getLocalizedText } from "../utils/eventText";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const EventCard = ({ event }) => {
  if (!event) return null;

  const image =
    event.coverImage?.url ||
    event.coverImage?.secureUrl ||
    "https://placehold.co/600x400?text=No+Image";
  const title = getLocalizedText(event.title, "Untitled Event");
  const summary = getLocalizedText(event.summary || event.shortDescription);
  const villageSlug = event.village?.slug;
  const eventUrl = villageSlug
    ? `/village/${villageSlug}/events/${event.slug}`
    : `/events/${event.slug}`;

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">

      {/* Image */}

      <div className="relative h-56 overflow-hidden">

        <img
          src={image}
          alt={title}
          decoding="async"
          fetchPriority="low"
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 hover:scale-110"
        />

        {/* Type */}

        <div className="absolute left-4 top-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
          {event.type}
        </div>

        {/* Featured */}

        {event.isFeatured && (
          <div className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white">
            <Star
              size={12}
              fill="white"
            />
            Featured
          </div>
        )}
      </div>

      {/* Content */}

      <div className="p-6">

        <h3 className="line-clamp-2 text-xl font-bold text-slate-900">
          {title}
        </h3>

        <EventMeta
          event={event}
          className="mt-4"
        />

        <SmartTextRenderer
          text={summary}
          className="mt-4 max-w-none space-y-0 [&_p]:mb-0 [&_p]:line-clamp-3 [&_p]:text-base [&_p]:leading-7 [&_p]:text-slate-600 [&_p]:text-left"
        />

        <Link
          to={eventUrl}
          className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
        >
          Read More
          <ArrowRight size={16} />
        </Link>

      </div>

    </article>
  );
};

export default EventCard;
