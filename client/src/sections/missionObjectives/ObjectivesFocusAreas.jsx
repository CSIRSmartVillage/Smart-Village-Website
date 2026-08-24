import {
  BusFront,
  Construction,
  Droplets,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  Leaf,
  Lightbulb,
  Recycle,
  ShieldCheck,
  Sprout,
  TrendingUp,
  UsersRound,
  Wifi,
  Zap,
} from "lucide-react";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const focusAreaIconRules = [
  { keywords: ["water", "sanitation", "hygiene"], Icon: Droplets },
  { keywords: ["health", "medical", "wellness"], Icon: HeartPulse },
  { keywords: ["education", "learning", "skill", "literacy"], Icon: GraduationCap },
  { keywords: ["housing", "shelter", "home"], Icon: House },
  { keywords: ["agriculture", "farming", "food"], Icon: Sprout },
  { keywords: ["digital", "connectivity", "internet", "e-governance"], Icon: Wifi },
  { keywords: ["waste", "recycling", "recycle"], Icon: Recycle },
  { keywords: ["environment", "sustainability", "climate", "ecology", "green"], Icon: Leaf },
  { keywords: ["social", "community", "people", "inclusion"], Icon: UsersRound },
  { keywords: ["economic", "livelihood", "employment", "enterprise", "income"], Icon: TrendingUp },
  { keywords: ["energy", "electricity", "power"], Icon: Zap },
  { keywords: ["infrastructure", "construction"], Icon: Construction },
  { keywords: ["transport", "mobility", "road"], Icon: BusFront },
  { keywords: ["governance", "institution", "administration"], Icon: Landmark },
  { keywords: ["safety", "disaster", "resilience"], Icon: ShieldCheck },
];

const findFocusAreaIconRule = (text) =>
  focusAreaIconRules.find(({ keywords }) =>
    keywords.some((keyword) => text.includes(keyword))
  );

const FocusAreaIcon = ({ item }) => {
  const title = String(item?.title || "").toLowerCase();
  const description = String(item?.description || "").toLowerCase();
  const matchingRule =
    findFocusAreaIconRule(title) ||
    findFocusAreaIconRule(description);
  const Icon = matchingRule?.Icon || Lightbulb;

  return <Icon aria-hidden="true" className="h-7 w-7" strokeWidth={2} />;
};

const ObjectivesFocusAreas = ({
  data,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#EEF6FF] py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute -right-28 top-20 h-80 w-80 rounded-full border-[52px] border-blue-100/50"
      />
      <div
        aria-hidden="true"
        className="absolute -left-16 bottom-16 h-64 w-64 rounded-full bg-teal-100/30 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <span className="text-blue-700 font-semibold uppercase tracking-wider">
            Focus Areas
          </span>

          <h2 className="text-4xl font-bold text-slate-900 mt-3">
            {data?.heading}
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3 xl:gap-10">
          {data?.items?.map(
            (
              item,
              index
            ) => (
              <article
                key={index}
                className="group h-full rounded-[20px] border border-blue-100 border-l-[6px] border-l-[#2563EB] bg-[#FCFDFF] p-8 shadow-lg shadow-blue-900/[0.06] transition-all duration-300 hover:-translate-y-1 hover:border-l-[#3B82F6] hover:shadow-xl hover:shadow-blue-900/10 md:p-9"
              >
                <div className="focus-area-icon mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-lg font-bold text-white shadow-md shadow-blue-900/20 transition-transform duration-300 group-hover:scale-105">
                  <FocusAreaIcon item={item} />
                </div>

                <h3 className="mb-4 text-[26px] font-bold leading-tight text-[#123A73] sm:text-[28px] lg:text-[30px]">
                  {item.title}
                </h3>

                <SmartTextRenderer
                  text={item.description}
                  className="max-w-none [&_p]:mb-0 [&_p]:text-left [&_p]:text-[17px] [&_p]:leading-[1.8] [&_p]:text-[#4B5563] sm:[&_p]:text-[18px]"
                />
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default ObjectivesFocusAreas;
