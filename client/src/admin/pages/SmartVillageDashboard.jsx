import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileCheck,
  HandHeart,
  MapPin,
  Route,
} from "lucide-react";
import { Link } from "react-router-dom";

const moduleCards = [
  {
    title: "Development Plans",
    description: "Manage ongoing and future development plans.",
    path: "/admin/development-plans",
    icon: Route,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Village Locations",
    description: "Manage village facilities, coordinates, and map points.",
    path: "/admin/village-locations",
    icon: MapPin,
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Events & Achievements",
    description: "Publish village events, activities, and achievements.",
    path: "/admin/events",
    icon: CalendarDays,
    color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Survey Management",
    description: "Upload, manage, and publish village survey data.",
    path: "/admin/surveys",
    icon: ClipboardList,
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Policies & Schemes",
    description: "Manage government schemes and policy information.",
    path: "/admin/policies-schemes",
    icon: FileCheck,
    color: "bg-cyan-50 text-cyan-700",
  },
  {
    title: "Self Help Groups",
    description: "Manage SHGs, leaders, members, and publishing.",
    path: "/admin/self-help-groups",
    icon: HandHeart,
    color: "bg-rose-50 text-rose-700",
  },
];

export default function SmartVillageDashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
          Smart Village
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
          Village Modules
        </h1>

        <p className="mt-3 max-w-2xl text-slate-600">
          Open the village administration modules used for planning,
          locations, surveys, policies, groups, and events.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {moduleCards.map(({ title, description, path, icon: Icon, color }) => (
          <Link
            key={title}
            to={path}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${color}`}>
                <Icon size={23} />
              </div>

              <ArrowUpRight
                size={18}
                className="text-slate-300 transition group-hover:text-blue-700"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              {description}
            </p>
          </Link>
        ))}
      </section>
    </div>
  );
}
