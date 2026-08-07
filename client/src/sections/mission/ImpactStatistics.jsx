import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  ClipboardList,
  Cpu,
  Home,
} from "lucide-react";

import { getHomeStats } from "../../services/home.service";
import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";

const CountUpNumber = ({
  value = 0,
  isActive = false,
}) => {
  const [displayValue, setDisplayValue] =
    useState(0);

  useEffect(() => {
    if (!isActive) {
      setDisplayValue(0);
      return undefined;
    }

    const target = Number(value) || 0;
    const duration = 1200;
    const startedAt = performance.now();
    let frameId;

    const animate = (currentTime) => {
      const elapsed = currentTime - startedAt;
      const progress = Math.min(
        elapsed / duration,
        1
      );
      const eased =
        1 - Math.pow(1 - progress, 3);

      setDisplayValue(
        Math.round(target * eased)
      );

      if (progress < 1) {
        frameId =
          requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);

    return () =>
      cancelAnimationFrame(frameId);
  }, [isActive, value]);

  return <>{displayValue}+</>;
};

const ImpactStatistics = ({
  data = {},
}) => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] =
    useState(false);

  const {
    data: homeStats,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["home-stats"],
    queryFn: getHomeStats,
  });

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        {
          threshold: 0.25,
        }
      );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const {
    heading =
      "Smart Village Impact",

    description =
      "Key indicators reflecting rural transformation initiatives.",

  } = data;

  const stats = useMemo(
    () => [
      {
        label: "Villages Covered",
        value: homeStats?.villagesCovered ?? 0,
        icon: Home,
        iconClass: "text-blue-700",
        iconBg: "bg-blue-50",
      },

      {
        label: "Technologies",
        value:
          homeStats?.technologiesDeployed ?? 0,
        icon: Cpu,
        iconClass: "text-violet-700",
        iconBg: "bg-violet-50",
      },
      {
        label: "Development Plans",
        value:
          homeStats?.developmentPlans ?? 0,
        icon: ClipboardList,
        iconClass: "text-amber-700",
        iconBg: "bg-amber-50",
      },
      {
        label: "Events & Achievements",
        value:
          homeStats?.eventsAndAchievements ??
          0,
        icon: CalendarDays,
        iconClass: "text-rose-700",
        iconBg: "bg-rose-50",
      },
    ],
    [homeStats]
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-sky-900 py-24"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-white/20" />
      <div className="absolute left-0 top-16 h-28 w-full -skew-y-3 bg-white/[0.04]" />
      <div className="absolute bottom-0 right-0 h-40 w-2/3 skew-y-3 bg-cyan-200/[0.05]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px]" />

      <div className="relative max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-4xl font-bold text-white md:text-5xl">
            {heading}
          </h2>

          <SmartTextRenderer
            text={description}
            className="mt-5 mx-auto max-w-3xl text-center text-blue-100 [&_*]:text-center [&_*]:text-blue-100"
          />

        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">

          {stats.map(
            (stat, index) => (
              <article
                key={stat.label}
                className="group rounded-3xl border border-white/20 bg-white p-7 text-center shadow-2xl shadow-blue-950/20 transition duration-300 hover:-translate-y-2 hover:shadow-blue-950/40"
                style={{
                  transitionDelay: `${index * 40}ms`,
                }}
              >
                <div
                  className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${stat.iconBg} transition duration-300 group-hover:scale-110`}
                >
                  <stat.icon
                    size={34}
                    strokeWidth={2.2}
                    className={stat.iconClass}
                  />
                </div>

                <h3 className="text-5xl font-extrabold tracking-normal text-blue-950 mb-3">
                  <CountUpNumber
                    value={
                      isLoading || isError
                        ? 0
                        : stat.value
                    }
                    isActive={isVisible}
                  />
                </h3>

                <p className="text-sm font-semibold uppercase text-slate-600">
                  {stat.label}
                </p>
              </article>
            )
          )}

        </div>

      </div>
    </section>
  );
};

export default ImpactStatistics;
