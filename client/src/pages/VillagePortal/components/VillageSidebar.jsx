import { NavLink } from "react-router-dom";

import {
  Home,
  FolderKanban,
  Trophy,
  Map,
  ScrollText,
  BarChart3,
  UsersRound,
  MapPinned,
  Landmark,
  Trees,
  ChevronRight,
} from "lucide-react";

const VillageSidebar = ({ village }) => {
  const slug = village?.slug;

  const menuItems = [
    {
      label: "Village Information",
      description: "Profile & demographics",
      icon: Home,
      path: "",
    },
    {
      label: "Development Plans",
      description: "Projects & infrastructure",
      icon: FolderKanban,
      path: "development-plan",
    },
    {
      label: "Events & Achievements",
      description: "Community highlights",
      icon: Trophy,
      path: "events",
    },
    {
      label: "Village Map",
      description: "Explore village",
      icon: Map,
      path: "map",
    },
    {
      label: "Policies & Schemes",
      description: "Government schemes",
      icon: ScrollText,
      path: "policies",
    },
    {
      label: "Self Help Groups",
      description: "SHGs & members",
      icon: UsersRound,
      path: "self-help-groups",
    },
    {
      label: "Development Indicators",
      description: "Village statistics",
      icon: BarChart3,
      path: "indicators",
    },
  ];

  return (
   <div className="sticky top-28 space-y-6">

      {/* ================= Header ================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 px-6 py-5 text-white">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">

              <Trees size={28} />

            </div>

            <div>

              <h2 className="text-xl font-bold">

                Village Modules

              </h2>

              <p className="mt-1 text-sm text-blue-100">

                Explore every aspect of the village

              </p>

            </div>

          </div>

        </div>

{/* ================= Navigation ================= */}

<div className="p-4">

  {menuItems.map((item) => {
    const Icon = item.icon;

    return (
      <NavLink
        key={item.path}
        to={`/village/${slug}/${item.path}`}
        end={item.path === ""}
        className={({ isActive }) =>
          `
          group
          mb-2
          flex
          w-full
          items-center
          justify-between
          gap-3
          rounded-xl
          px-4
          py-3.5
          transition-all
          duration-300

          ${
            isActive
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg"
              : "hover:bg-slate-100"
          }
          `
        }
      >
        {({ isActive }) => (
          <>
            <div className="flex min-w-0 flex-1 items-center gap-3">

              <div
                className={`
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  transition-all

                  ${
                    isActive
                      ? "bg-white/20"
                      : "bg-slate-100 group-hover:bg-blue-100"
                  }
                `}
              >
                <Icon
                  size={19}
                  className={
                    isActive
                      ? "text-white"
                      : "text-slate-700"
                  }
                />
              </div>

              <div className="min-w-0">

                <h4
                  className={`text-sm font-semibold leading-snug ${
                    isActive
                      ? "text-white"
                      : "text-slate-800"
                  }`}
                >
                  {item.label}
                </h4>

                <p
                  className={`mt-1 text-xs leading-snug ${
                    isActive
                      ? "text-blue-100"
                      : "text-slate-500"
                  }`}
                >
                  {item.description}
                </p>

              </div>

            </div>

            <ChevronRight
              size={18}
              className={
                `shrink-0 ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-blue-600"
                }`
              }
            />

          </>
        )}
      </NavLink>
    );
  })}

</div>
</div>

      {/* ================= Quick Information ================= */}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">

        <div className="border-b bg-slate-50 px-6 py-4">

          <h3 className="text-lg font-semibold text-slate-800">

            Quick Information

          </h3>

          <p className="text-sm text-slate-500 mt-1">

            Basic village details

          </p>

        </div>

        <div className="space-y-4 p-5">

          <InfoRow
            icon={<Landmark size={18} />}
            label="State"
            value={village?.state?.name}
          />

          <InfoRow
            icon={<MapPinned size={18} />}
            label="District"
            value={village?.district}
          />

          <InfoRow
            icon={<Trees size={18} />}
            label="Village"
            value={village?.name?.en || village?.name}
          />

        </div>

      </div>

    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-3">

    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">

      {icon}

    </div>

    <div className="min-w-0">

      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
        {value || "-"}
      </p>

    </div>

  </div>
);
export default VillageSidebar;
