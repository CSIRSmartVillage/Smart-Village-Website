import { useEffect, useMemo, useState } from "react";

import MainLayout from "../../layouts/MainLayout";
import { getNewsUpdates } from "../../services/event.service";
import { getPublicAnnouncements } from "../../services/announcement.service";
import { getUserFriendlyError } from "../../utils/userFriendlyError";

import NewsGrid from "./components/NewsGrid";
import FeaturedAnnouncement from "./components/FeaturedAnnouncement";
import AnnouncementGrid from "./components/AnnouncementGrid";

const VillageNewsPage = () => {
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [eventData, announcementData] = await Promise.all([
          getNewsUpdates(),
          getPublicAnnouncements(),
        ]);

        setEvents(eventData);
        setAnnouncements(announcementData);
      } catch (requestError) {
        console.error(requestError);
        setError(
          getUserFriendlyError(requestError, "Unable to load News & Updates. Please refresh the page.")
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const villageGroups = useMemo(() => {
    const groups = new Map();

    events.forEach((event) => {
      const village = event.village;

      if (!village) return;

      const key = village._id || village.slug;
      const existing = groups.get(key);

      if (existing) {
        existing.items.push(event);
        return;
      }

      groups.set(key, {
        village,
        items: [event],
      });
    });

    return Array.from(groups.values()).sort((a, b) => {
      const firstName =
        a.village?.name?.en || a.village?.name || "";
      const secondName =
        b.village?.name?.en || b.village?.name || "";

      return firstName.localeCompare(secondName);
    });
  }, [events]);

  const featuredAnnouncement =
    announcements.find((item) => item.isFeatured) ||
    announcements[0];

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-6 py-20">
        <h1 className="mb-12 text-5xl font-bold">
          News & Updates
        </h1>

        <FeaturedAnnouncement
          announcement={featuredAnnouncement}
        />

        {loading ? (
          <div className="py-16 text-center text-slate-600">
            Loading village news...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
            {error}
          </div>
        ) : villageGroups.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-10 text-center">
            <h2 className="text-xl font-semibold text-slate-800">
              No village news available
            </h2>
            <p className="mt-2 text-slate-600">
              Published Events, Achievements, and Visits will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-16">
            {villageGroups.map(({ village, items }) => {
              const villageName =
                village?.name?.en ||
                village?.name ||
                "Village";

              return (
                <section key={village._id || village.slug}>
                  <h2 className="mb-8 text-3xl font-bold text-slate-900">
                    {villageName} News
                  </h2>

                  <NewsGrid news={items} />
                </section>
              );
            })}
          </div>
        )}

        {announcements.length > 0 ? (
          <>
            <h2 className="mb-8 mt-20 text-3xl font-bold">
              Announcements
            </h2>

            <AnnouncementGrid
              announcements={announcements}
            />
          </>
        ) : null}
      </div>
    </MainLayout>
  );
};

export default VillageNewsPage;
