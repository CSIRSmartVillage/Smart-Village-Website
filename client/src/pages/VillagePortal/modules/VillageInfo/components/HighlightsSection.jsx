import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Award,
  CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getVillageInfoHighlights } from "../../../../../services/event.service";
import SmartTextRenderer
  from "../../../../../components/common/SmartTextRenderer";

const imageFallback =
  "https://placehold.co/800x500?text=Village+Highlight";

const formatDate = (date) => {
  if (!date) return "Date not available";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const HighlightsSkeleton = () => (
  <section className="rounded-xl border bg-white p-8 shadow-sm">
    <div className="animate-pulse">
      <div className="h-8 w-64 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-96 max-w-full rounded bg-slate-200" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-64 rounded-xl bg-slate-100"
          />
        ))}
      </div>
    </div>
  </section>
);

const EmptyState = () => (
  <section className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
      <Award size={26} />
    </div>
    <h2 className="mt-4 text-2xl font-bold text-slate-800">
      No Village Highlights Yet
    </h2>
    <p className="mx-auto mt-2 max-w-xl text-slate-500">
      Highlighted events and achievements will appear here once marked from the Events CMS.
    </p>
  </section>
);

const HighlightCard = ({ event }) => {
  const image =
    event.coverImage?.url ||
    event.coverImage?.secureUrl ||
    imageFallback;
  const title = event.title || "Village Highlight";
  const summary = event.summary || "No description available.";
  const badge =
    {
      EVENT: "Event",
      ACHIEVEMENT: "Achievement",
      VISIT: "Visit",
    }[event.type] || "Event";
  const villageSlug = event.village?.slug;
  const href = villageSlug
    ? `/village/${villageSlug}/events/${event.slug}`
    : "#";

  return (
    <article className="overflow-hidden rounded-xl border border-blue-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-36 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover"
        />

        <span className="absolute left-3 top-3 rounded-full bg-blue-700 px-3 py-1 text-xs font-semibold text-white shadow">
          {badge}
        </span>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <CalendarDays size={15} />
          {formatDate(event.eventDate)}
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-6 text-slate-900">
          {title}
        </h3>

        <SmartTextRenderer
          text={summary}
          className="mt-2 max-w-none space-y-0 [&_p]:mb-0 [&_p]:line-clamp-2 [&_p]:text-sm [&_p]:leading-6 [&_p]:text-slate-600 [&_p]:text-left"
        />

        <Link
          to={href}
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

const HighlightsSection = ({ villageId }) => {
  const {
    data: highlights = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["village-info-highlights", villageId],
    queryFn: () => getVillageInfoHighlights(villageId),
    enabled: !!villageId,
    staleTime: 1000 * 60 * 10,
  });

  if (isLoading) {
    return <HighlightsSkeleton />;
  }

  if (error || highlights.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="rounded-xl border bg-white p-6 shadow-sm sm:p-7">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          Village Highlights
        </h2>

        <p className="mt-2 text-slate-500">
          Featured events and achievements from the village.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {highlights.map((event) => (
          <HighlightCard
            key={event._id}
            event={event}
          />
        ))}
      </div>
    </section>
  );
};

export default HighlightsSection;
