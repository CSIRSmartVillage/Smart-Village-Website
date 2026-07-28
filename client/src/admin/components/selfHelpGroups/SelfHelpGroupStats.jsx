import { Users, CheckCircle2, Clock, Image } from "lucide-react";
import { useMemo } from "react";

const StatCard = ({
  icon,
  title,
  value,
  iconBg,
  iconColor,
}) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <h2 className="mt-2 text-3xl font-bold">{value}</h2>
      </div>

      <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${iconBg}`}>
        <div className={iconColor}>{icon}</div>
      </div>
    </div>
  </div>
);

const SelfHelpGroupStats = ({
  groups = [],
}) => {
  const stats = useMemo(() => {
    const total = groups.length;
    const published = groups.filter(
      (group) => group.isPublished
    ).length;
    const members = groups.reduce(
      (sum, group) =>
        sum + Number(group.members?.length || 0),
      0
    );

    const withImages = groups.filter(
      (group) => group.featuredImage?.url
    ).length;

    return {
      total,
      published,
      members,
      withImages,
    };
  }, [groups]);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Total SHGs"
        value={stats.total}
        icon={<Users size={26} />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
      />

      <StatCard
        title="Published"
        value={stats.published}
        icon={<CheckCircle2 size={26} />}
        iconBg="bg-emerald-100"
        iconColor="text-emerald-600"
      />

      <StatCard
        title="With Image"
        value={stats.withImages}
        icon={<Image size={26} />}
        iconBg="bg-amber-100"
        iconColor="text-amber-600"
      />

      <StatCard
        title="Members"
        value={stats.members}
        icon={<Clock size={26} />}
        iconBg="bg-indigo-100"
        iconColor="text-indigo-600"
      />
    </div>
  );
};

export default SelfHelpGroupStats;
