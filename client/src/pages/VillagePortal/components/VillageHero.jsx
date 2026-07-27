import {
  MapPin,
} from "lucide-react";

const VillageHero = ({
  village,
  profile,
}) => {
  const heroImage =
    profile?.heroImage?.url ||
    village?.coverImage ||
    "https://placehold.co/1600x600";

  const title =
    village?.name?.en ||
    profile?.heroTitle ||
    "Village";

  return (
    <>
      <section className="relative aspect-[16/9] overflow-hidden bg-white sm:aspect-auto sm:min-h-[460px] sm:bg-slate-950 lg:min-h-[500px]">

        {/* Background */}

        <img
          src={heroImage}
          alt={title}
          decoding="async"
          fetchPriority="high"
          loading="eager"
          sizes="100vw"
          className="absolute inset-0 h-full w-full object-contain object-left sm:object-cover sm:object-center"
        />

        {/* Overlay */}

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/20 sm:from-slate-950/18 sm:to-slate-950/35" />

        {/* Content */}

        <div className="relative z-10 mx-auto h-full max-w-7xl px-3 py-3 sm:min-h-[460px] sm:px-6 sm:py-6 lg:min-h-[500px]">

          <div className="absolute right-3 top-3 max-w-[calc(100%-1.5rem)] rounded-full border border-white/25 bg-slate-950/55 px-3 py-1.5 text-white shadow-sm sm:right-6 sm:top-6 sm:px-4 sm:py-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold sm:gap-2 sm:text-sm">

              <MapPin size={16} className="shrink-0 sm:size-[18px]" />

              <span>

                {[village?.district, village?.state?.name]
                  .filter(Boolean)
                  .join(", ")}

              </span>

            </div>
          </div>

        </div>

      </section>

      {/* Quick Info */}

      <section className="bg-white shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-6 py-6 grid md:grid-cols-4 gap-6">

          <div>

            <p className="text-sm text-slate-500">

              State

            </p>

            <p className="font-semibold">

              {village?.state?.name}

            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">

              District

            </p>

            <p className="font-semibold">

              {village?.district}

            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">

              Block

            </p>

            <p className="font-semibold">

              {village?.block}

            </p>

          </div>

          <div>

            <p className="text-sm text-slate-500">

              Gram Panchayat

            </p>

            <p className="font-semibold">

              {village?.gramPanchayat}

            </p>

          </div>

        </div>

      </section>
    </>
  );
};

export default VillageHero;
