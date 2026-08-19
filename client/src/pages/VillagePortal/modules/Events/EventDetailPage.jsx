import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Trophy,
} from "lucide-react";

import * as eventService from "../../../../services/event.service";

import EventMeta from "./components/EventMeta";
import EventGallery from "./components/EventGallery";
import EventSidebar from "./components/EventSidebar";
import EventCard from "./components/EventCard";
import { getLocalizedText } from "./utils/eventText";
import SmartTextRenderer
  from "../../../../components/common/SmartTextRenderer";
import { getUserFriendlyError }
  from "../../../../utils/userFriendlyError";

const EventDetailPage = () => {
  const navigate = useNavigate();

  const { eventSlug } = useParams();

  const [event, setEvent] = useState(null);

  const [relatedEvents, setRelatedEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        const response =
          await eventService.getEventBySlug(eventSlug);

        setEvent(response.data.event);

        setRelatedEvents(
          response.data.relatedEvents || []
        );
      } catch (err) {
        console.error(err);

        setError(
          getUserFriendlyError(err, "Unable to load the event. Please try again.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [eventSlug]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-red-600">
          {error}
        </h2>

        <button
          onClick={() => navigate(-1)}
          className="mt-8 rounded-xl bg-blue-600 px-6 py-3 text-white"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!event) return null;

  const heroImage =
    event.coverImage?.url ||
    event.coverImage?.secureUrl ||
    "https://placehold.co/1400x600?text=Event";
  const title = getLocalizedText(event.title, "Event");
  const summary = getLocalizedText(event.summary);
  const description = getLocalizedText(event.description);

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* HERO */}

      <div className="relative h-[420px] w-full overflow-hidden">

        <img
          src={heroImage}
          alt={title}
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10 text-white">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur hover:bg-white/30"
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="mb-4 inline-flex items-center rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold">

            <Trophy
              size={16}
              className="mr-2"
            />

            {event.type}
          </div>

          <h1 className="max-w-4xl text-5xl font-bold leading-tight">
            {title}
          </h1>

          <EventMeta
            event={event}
            className="mt-6 text-white"
          />

        </div>

      </div>

      {/* CONTENT */}

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="grid gap-10 lg:grid-cols-3">

          <div className="space-y-10 lg:col-span-2">

            {/* SUMMARY */}

            {summary && (
              <div className="rounded-2xl bg-white p-8 shadow-sm">

                <h2 className="mb-4 text-2xl font-bold text-slate-900">
                  Overview
                </h2>

                <SmartTextRenderer text={summary} />

              </div>
            )}

            {/* DESCRIPTION */}

            <div className="rounded-2xl bg-white p-8 shadow-sm">

              <h2 className="mb-6 text-2xl font-bold">
                Description
              </h2>

              <SmartTextRenderer text={description} />

            </div>

            {/* GALLERY */}

            <EventGallery
              images={event.gallery}
            />
            {/* SIDEBAR END OF LEFT COLUMN */}

          </div>

          {/* RIGHT SIDEBAR */}

          <div>

            <EventSidebar event={event} />

          </div>

        </div>

        {/* RELATED EVENTS */}

        {relatedEvents.length > 0 && (
          <section className="mt-20">

            <div className="mb-8">

              <h2 className="text-3xl font-bold text-slate-900">
                Related Events
              </h2>

              <p className="mt-2 text-slate-600">
                Explore more events and achievements from this
                village.
              </p>

            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

              {relatedEvents.map((item) => (
                <EventCard
                  key={item._id}
                  event={item}
                />
              ))}

            </div>

          </section>
        )}

      </div>

    </div>
  );
};

export default EventDetailPage;
