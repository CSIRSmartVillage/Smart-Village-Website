import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardList,
  FileCheck,
  FileText,
  HandHeart,
  MapPin,
  Plus,
  Route,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";

import AddVillageModal from "../components/villages/AddVillageModal";
import { getAllStates } from "../services/state.service";
import { getAllVillages } from "../services/village.service";

const moduleCards = [
  {
    title: "Village Information",
    description: "Manage village overview, gallery, contacts, and profile content.",
    path: "/admin/village-profiles",
    icon: FileText,
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Development Plans",
    description: "Manage ongoing and future development plans.",
    path: "/admin/development-plans",
    icon: Route,
    color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Village Map",
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
    title: "Development Indicators",
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
  const queryClient = useQueryClient();
  const [showAddVillage, setShowAddVillage] = useState(false);
  const [search, setSearch] = useState("");

  const {
    data: villages = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-villages"],
    queryFn: getAllVillages,
  });

  const { data: states = [] } = useQuery({
    queryKey: ["admin-states"],
    queryFn: getAllStates,
  });

  const filteredVillages = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return villages;

    return villages.filter((village) =>
      [village.name?.en, village.district, village.state?.name]
        .filter(Boolean)
        .some((value) => value.toLocaleLowerCase().includes(query))
    );
  }, [search, villages]);

  const handleCreated = (village) => {
    queryClient.setQueryData(["admin-villages"], (current = []) => [
      ...current,
      village,
    ]);
    queryClient.invalidateQueries({ queryKey: ["admin-villages"] });
    queryClient.invalidateQueries({ queryKey: ["villages"] });
    queryClient.invalidateQueries({ queryKey: ["admin-village-profiles"] });
    queryClient.invalidateQueries({ queryKey: ["admin-village-locations"] });
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Smart Village
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Villages
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Create villages with essential details, then populate each module
              as information becomes available.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddVillage(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <Plus size={19} />
            Add Village
          </button>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">
              Village Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {villages.length} village{villages.length === 1 ? "" : "s"}{" "}
              available across the CMS
            </p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search
              size={17}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <span className="sr-only">Search villages</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search village, district or state"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-slate-500">
            Loading villages...
          </div>
        ) : isError ? (
          <div className="p-10 text-center text-sm text-red-600">
            Unable to load villages.
          </div>
        ) : filteredVillages.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-semibold text-slate-800">
              {search ? "No matching villages" : "No villages added yet"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {search
                ? "Try a different search term."
                : "Use Add Village to create the first village."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Village</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVillages.map((village) => (
                  <tr
                    key={village._id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-900">
                        {village.name?.en}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        /{village.slug}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      <div>{village.district}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {village.state?.name}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " +
                          (village.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600")
                        }
                      >
                        {village.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link
                        to="/admin/village-profiles"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 hover:text-blue-900"
                      >
                        Manage modules
                        <ArrowUpRight size={15} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <div>
        <h2 className="text-xl font-bold text-slate-950">Village Modules</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add and update detailed content independently.
        </p>
      </div>

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

      <AddVillageModal
        open={showAddVillage}
        states={states}
        villages={villages}
        onClose={() => setShowAddVillage(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
