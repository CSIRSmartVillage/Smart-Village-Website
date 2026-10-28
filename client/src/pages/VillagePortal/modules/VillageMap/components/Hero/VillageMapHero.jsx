import { Navigation } from "lucide-react";
import SmartTextRenderer
  from "../../../../../../components/common/SmartTextRenderer";

const VillageMapHero = ({ villageLocation }) => {
  const village = villageLocation?.village;

  const villageName =
    village?.name?.en ||
    village?.name ||
    "Village";

  const overview = villageLocation?.overview;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 text-white">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          {villageName}
        </h1>

        {overview && (
          <SmartTextRenderer
            text={overview}
            className="!mx-0 mt-2 max-w-3xl text-emerald-50 [&>p]:mb-0 [&_*]:text-emerald-50"
          />
        )}

        {villageLocation?.googleMapsLink && (
          <a
            href={villageLocation.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 font-medium text-emerald-700 shadow transition hover:bg-emerald-50"
          >
            <Navigation size={18} />
            Open in Google Maps
          </a>
        )}
      </div>
    </section>
  );
};

export default VillageMapHero;
