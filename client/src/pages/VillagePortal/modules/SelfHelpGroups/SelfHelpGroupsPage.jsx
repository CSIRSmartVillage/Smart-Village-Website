import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useOutletContext } from "react-router-dom";
import {
  ArrowRight,
  Search,
  Users,
} from "lucide-react";

import {
  getSelfHelpGroupsByVillage,
} from "../../../../services/village.service";

const SelfHelpGroupsPage = () => {
  const { village } = useOutletContext();
  const [search, setSearch] = useState("");

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "self-help-groups",
      village?.slug,
      search,
    ],
    queryFn: () =>
      getSelfHelpGroupsByVillage(
        village.slug,
        search
          ? {
              search,
            }
          : {}
      ),
    enabled: !!village?.slug,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  const groups = data?.data || [];

  if (isLoading) {
    return <ShgSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load Self Help Groups
        </h2>
        <p className="mt-3 text-slate-500">
          Please try again after some time.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <section className="mx-auto max-w-[1000px] rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Self Help Groups
          </h1>

          <p className="mt-4 text-lg leading-8 text-slate-600">
            Village-level groups supporting livelihoods, financial inclusion and community participation.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <StatCard
            label="Published Groups"
            value={groups.length}
          />
          <StatCard
            label="Total Members"
            value={groups.reduce(
              (sum, group) =>
                sum + Number(group.members?.length || 0),
              0
            )}
          />
        </div>
      </section>

      <section className="mx-auto max-w-[1000px] rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search groups, descriptions or leaders..."
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </section>

      {groups.length === 0 ? (
        <div className="mx-auto max-w-[1000px] rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h2 className="text-xl font-semibold text-slate-800">
            No Self Help Groups available.
          </h2>
          <p className="mt-3 text-slate-500">
            Published SHGs for this village will appear here.
          </p>
        </div>
      ) : (
        <section className="mx-auto grid max-w-[1000px] gap-6">
          {groups.map((group) => (
            <ShgCard
              key={group._id}
              group={group}
              villageSlug={village.slug}
            />
          ))}
        </section>
      )}
    </div>
  );
};

const StatCard = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
    <p className="text-sm font-medium text-slate-500">
      {label}
    </p>
    <p className="mt-2 text-3xl font-bold text-slate-900">
      {value}
    </p>
  </div>
);

const ShgCard = ({
  group,
  villageSlug,
}) => {
  const imageUrl = group.featuredImage?.url;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg md:grid md:grid-cols-[280px_minmax(0,1fr)]">
      <div className="flex h-52 items-center justify-center bg-slate-100 p-3 md:h-full md:min-h-[260px]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={group.featuredImage?.alt || group.groupName}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="px-6 text-center text-sm font-semibold text-slate-500">
            Self Help Group
          </div>
        )}
      </div>

      <div className="flex min-h-[260px] flex-col p-6">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Users size={14} />
            {group.members?.length || 0} Members
          </span>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-slate-950">
          {group.groupName}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
          {group.description}
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Leader
          </p>
          <p className="mt-1 font-semibold text-slate-900">
            {group.leader?.name || "-"}
          </p>
          <p className="text-sm text-slate-500">
            {group.leader?.designation || "SHG Leader"}
          </p>
        </div>

        <Link
          to={`/village/${villageSlug}/self-help-groups/${group.slug}`}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-blue-700 transition group-hover:text-blue-900"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
};

const ShgSkeleton = () => (
  <div className="space-y-8">
    <div className="mx-auto max-w-[1000px] rounded-3xl border border-slate-200 bg-white p-8">
      <div className="h-8 w-72 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 h-5 w-full max-w-xl animate-pulse rounded bg-slate-200" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    </div>
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="mx-auto h-64 max-w-[1000px] animate-pulse rounded-2xl bg-slate-200"
      />
    ))}
  </div>
);

export default SelfHelpGroupsPage;
