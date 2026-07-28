import {
  Award,
  CalendarDays,
  Clock3,
  Timer,
  Star,
} from "lucide-react";

const EventsStats = ({
  statistics = {},
}) => {
  const stats = [
    {
      title: "Upcoming",
      value: statistics?.upcoming ?? 0,
      icon: Clock3,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Ongoing",
      value: statistics?.ongoing ?? 0,
      icon: Timer,
      color: "text-cyan-600",
      bg: "bg-cyan-50",
    },
    {
      title: "Completed",
      value: statistics?.completed ?? 0,
      icon: CalendarDays,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Achievements",
      value: statistics?.achievements ?? 0,
      icon: Award,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Featured",
      value: statistics?.featured ?? 0,
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <section className="mt-8">
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-5">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="rounded-2xl bg-white p-6 shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`inline-flex rounded-xl p-3 ${item.bg}`}
              >
                <Icon
                  size={24}
                  className={item.color}
                />
              </div>

              <h3 className="mt-5 text-3xl font-bold text-slate-900">
                {item.value}
              </h3>

              <p className="mt-1 text-sm font-medium text-slate-500">
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default EventsStats;
