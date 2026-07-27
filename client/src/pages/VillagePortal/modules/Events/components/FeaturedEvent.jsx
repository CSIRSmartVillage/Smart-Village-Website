import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Star,
} from "lucide-react";

import { Link } from "react-router-dom";
import {
  getLocalizedText,
  getVillageName,
} from "../utils/eventText";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const FeaturedEvent = ({ event }) => {
  if (!event) return null;

  const image =
    event.coverImage?.url ||
    event.coverImage?.secureUrl ||
    event.featuredImage?.url ||
    event.featuredImage?.secureUrl ||
    "https://placehold.co/1200x600?text=No+Image";

  const title = getLocalizedText(event.title, "Featured Event");
  const description = getLocalizedText(
    event.shortDescription || event.summary
  );
  const village = getVillageName(event.village);

  const formattedDate = new Date(
    event.eventDate
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Featured Event
        </h2>

        <p className="mt-2 text-slate-600">
          Explore the latest featured event from
          our Smart Village initiatives.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:shadow-xl">

        {/* Cover Image */}

        <div className="relative h-72 overflow-hidden lg:h-96">

          <img
            src={image}
            alt={title}
            decoding="async"
            fetchPriority="high"
            loading="eager"
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />

          <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">

            <Star
              size={16}
              fill="white"
            />

            Featured

          </div>

        </div>

        {/* Content */}

        <div className="p-8">

          <h3 className="text-3xl font-bold text-slate-900">
            {title}
          </h3>

          <div className="mt-5 flex flex-wrap items-center gap-6 text-sm text-slate-500">

            <div className="flex items-center gap-2">
              <CalendarDays size={18} />
              {formattedDate}
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              {village}
            </div>

          </div>

          <SmartTextRenderer
            text={description}
            className="mt-6 max-w-none"
          />

          <Link
            to={`/village/${event.village?.slug}/events/${event.slug}`}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Read More

            <ArrowRight size={18} />
          </Link>

        </div>

      </div>
    </section>
  );
};

export default FeaturedEvent;
