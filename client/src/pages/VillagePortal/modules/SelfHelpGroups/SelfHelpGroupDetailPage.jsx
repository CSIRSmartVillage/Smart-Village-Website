import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useOutletContext,
  useParams,
} from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Phone,
  Users,
} from "lucide-react";

import {
  getSelfHelpGroupBySlug,
} from "../../../../services/village.service";

const SelfHelpGroupDetailPage = () => {
  const { village } = useOutletContext();
  const { shgSlug } = useParams();

  const {
    data: group,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "self-help-group",
      shgSlug,
    ],
    queryFn: () =>
      getSelfHelpGroupBySlug(shgSlug),
    enabled: !!shgSlug,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error || !group) {
    return (
      <div className="rounded-2xl border border-red-200 bg-white p-12 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          Unable to load Self Help Group.
        </h2>
      </div>
    );
  }

  const imageUrl =
    group.featuredImage?.url ||
    "https://placehold.co/1200x520?text=Self+Help+Group";

  return (
    <article className="space-y-10">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="relative h-[360px] bg-slate-950">
          <img
            src={imageUrl}
            alt={group.featuredImage?.alt || group.groupName}
            className="h-full w-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-8 text-white">
            <Link
              to={`/village/${village.slug}/self-help-groups`}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/30"
            >
              <ArrowLeft size={18} />
              Back to SHGs
            </Link>

            <h1 className="max-w-4xl text-4xl font-bold leading-tight">
              {group.groupName}
            </h1>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              About the Group
            </h2>
            <p className="mt-5 whitespace-pre-line leading-8 text-slate-600">
              {group.description}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Members
            </h2>
            {group.members?.length ? (
              <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
                {group.members.map((member) => (
                  <div
                    key={member._id}
                    className="grid gap-3 border-b border-slate-200 p-5 last:border-b-0 md:grid-cols-[1fr_1fr]"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">
                        {member.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {member.role}
                      </p>
                    </div>
                    <div className="space-y-1 text-sm text-slate-600">
                      <ContactLine
                        icon={<Phone size={15} />}
                        value={member.mobileNumber}
                      />
                      <ContactLine
                        icon={<Mail size={15} />}
                        value={member.email}
                      />
                      <ContactLine
                        icon={<MapPin size={15} />}
                        value={member.address}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-slate-500">
                Member details will appear here once available.
              </p>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
                <Users size={22} />
              </div>
              <div>
                <p className="text-sm text-slate-500">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-slate-900">
                  {group.members?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">
              Leader Information
            </h2>
            <div className="mt-5 space-y-3">
              <p className="font-semibold text-slate-900">
                {group.leader?.name}
              </p>
              <p className="text-sm text-slate-500">
                {group.leader?.designation || "SHG Leader"}
              </p>
              <ContactLine
                icon={<Phone size={16} />}
                value={group.leader?.mobileNumber}
              />
              <ContactLine
                icon={<Mail size={16} />}
                value={group.leader?.email}
              />
              <ContactLine
                icon={<MapPin size={16} />}
                value={group.leader?.address}
              />
            </div>
          </div>
        </aside>
      </section>
    </article>
  );
};

const ContactLine = ({
  icon,
  value,
}) => {
  if (!value) return null;

  return (
    <p className="flex items-start gap-2 text-sm text-slate-600">
      <span className="mt-0.5 shrink-0 text-slate-400">
        {icon}
      </span>
      <span className="break-words">{value}</span>
    </p>
  );
};

const DetailSkeleton = () => (
  <div className="space-y-8">
    <div className="h-[360px] animate-pulse rounded-3xl bg-slate-200" />
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6">
        <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
        <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
    </div>
  </div>
);

export default SelfHelpGroupDetailPage;
