import { Search } from "lucide-react";

const EventsHero = () => {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-sky-600 p-8 text-white shadow-xl lg:p-12">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full bg-white/20 px-4 py-1 text-sm font-medium backdrop-blur">
            SMART Village Portal
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight lg:text-5xl">
            Events & Achievements
          </h1>

          <p className="mt-4 text-lg leading-8 text-blue-100">
            Stay updated with the latest village events,
            development activities, awareness programs,
            celebrations, and achievements that are
            transforming our communities.
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventsHero;
