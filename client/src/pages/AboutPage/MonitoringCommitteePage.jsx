import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import Header from "../../components/common/Header/Header";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer";
import {
  getMonitoringCommittee,
  getMonitoringCommitteeSettings,
} from "../../services/monitoringCommittee.service";

const DEFAULT_HEADER_SUBTITLE =
  "Committee structure and contact information for monitoring the SMART Village Mission.";

const ROLE_ORDER = [
  "CHAIRMAN",
  "MEMBER",
  "CONVENER",
  "HEAD",
];

const sortByOrder = (members) =>
  [...members].sort(
    (a, b) =>
      Number(a.displayOrder || 0) -
      Number(b.displayOrder || 0)
  );

const MemberPanel = ({ member, className = "" }) => (
  <article
    className={
      "flex h-full min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm " +
      className
    }
  >
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
      {member.photo?.url ? (
        <img
          src={member.photo.url}
          alt={member.photo.alt || member.name || "Committee member"}
          className="h-full w-full object-contain"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <UserRound
          size={32}
          className="text-slate-300"
          aria-hidden="true"
        />
      )}
    </div>

    <div className="min-w-0 flex-1">
      {member.name && (
        <h3 className="break-words text-base font-bold text-slate-900 sm:text-lg">
          {member.name}
        </h3>
      )}

      {member.designation && (
        <p className="mt-1 break-words text-sm leading-5 text-slate-600">
          {member.designation}
        </p>
      )}

      {(member.phone || member.email) && (
        <div className="mt-3 flex flex-col gap-2 text-sm">
          {member.phone && (
            <a
              href={"tel:" + member.phone}
              className="inline-flex min-w-0 items-center gap-2 text-slate-600 hover:text-blue-700"
            >
              <Phone size={15} className="shrink-0" />
              <span className="break-all">{member.phone}</span>
            </a>
          )}

          {member.email && (
            <a
              href={"mailto:" + member.email}
              className="inline-flex min-w-0 items-center gap-2 text-slate-600 hover:text-blue-700"
            >
              <Mail size={15} className="shrink-0" />
              <span className="break-all">{member.email}</span>
            </a>
          )}
        </div>
      )}
    </div>
  </article>
);

const EmptySection = ({ message }) => (
  <p className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-5 py-8 text-center text-sm text-slate-500">
    {message}
  </p>
);

const IndependentSection = ({
  title,
  members,
  icon: Icon,
  accentClass,
  emptyMessage,
}) => (
  <section
    className={
      "rounded-2xl border p-5 transition duration-200 hover:shadow-sm sm:p-6 " +
      accentClass
    }
  >
    <div className="mb-5 flex items-center gap-3">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
        <Icon size={21} />
      </span>
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
    </div>

    {members.length > 0 ? (
      <div className="space-y-4">
        {members.map((member) => (
          <MemberPanel key={member._id} member={member} />
        ))}
      </div>
    ) : (
      <EmptySection message={emptyMessage} />
    )}
  </section>
);

const MonitoringCommitteePage = () => {
  const {
    data: rawMembers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monitoring-committee"],
    queryFn: getMonitoringCommittee,
  });
  const { data: headerSettings = {} } = useQuery({
    queryKey: ["monitoring-committee-settings"],
    queryFn: getMonitoringCommitteeSettings,
  });

  const groupedMembers = useMemo(() => {
    const safeMembers = Array.isArray(rawMembers)
      ? rawMembers
      : [];
    const groups = Object.fromEntries(
      ROLE_ORDER.map((role) => [role, []])
    );

    safeMembers.forEach((member) => {
      if (groups[member?.role]) {
        groups[member.role].push(member);
      }
    });

    ROLE_ORDER.forEach((role) => {
      groups[role] = sortByOrder(groups[role]);
    });

    return groups;
  }, [rawMembers]);

  const chairman = groupedMembers.CHAIRMAN[0] || null;
  const members = groupedMembers.MEMBER;
  const conveners = groupedMembers.CONVENER;
  const heads = groupedMembers.HEAD;
  const hasCommittee =
    Boolean(chairman) ||
    members.length > 0 ||
    conveners.length > 0 ||
    heads.length > 0;
  const headerSubtitle =
    typeof headerSettings.subtitle === "string"
      ? headerSettings.subtitle
      : DEFAULT_HEADER_SUBTITLE;

  return (
    <>
      <Header />
      <Navbar />

      <main className="bg-slate-50">
        <section className="bg-slate-900 py-20 text-white">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-300">
              About
            </span>
            <h1 className="mt-4 text-4xl font-bold md:text-5xl">
              Monitoring Committee
            </h1>
            {headerSubtitle && (
              <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-300">
                {headerSubtitle}
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8 lg:py-14">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center text-slate-500">
              Loading Monitoring Committee...
            </div>
          ) : isError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-14 text-center text-red-700">
              Unable to load the Monitoring Committee. Please try again
              later.
            </div>
          ) : !hasCommittee ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center">
              <UsersRound
                size={40}
                className="mx-auto text-slate-300"
              />
              <p className="mt-4 font-semibold text-slate-800">
                Monitoring Committee details will be available soon.
              </p>
            </div>
          ) : (
            <>
              <section className="rounded-2xl bg-blue-50/60 p-5 transition duration-200 hover:shadow-sm sm:p-7 lg:p-8">
                <div>
                  {chairman ? (
                    <div className="mx-auto max-w-2xl rounded-2xl border border-blue-300 bg-blue-100/70 p-2">
                      <p className="px-3 py-2 text-center text-xs font-bold uppercase tracking-wider text-blue-800">
                        Chairman
                      </p>
                      <MemberPanel member={chairman} />
                    </div>
                  ) : (
                    <EmptySection message="Chairman details have not been added yet." />
                  )}

                  {members.length > 0 && (
                    <>
                      <div className="mx-auto hidden h-10 w-px bg-blue-300 md:block" />

                      <div className="relative hidden md:block">
                        <span className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-blue-200" />
                        <div className="relative flex flex-wrap justify-center gap-y-7">
                          {members.map((member) => (
                            <div
                              key={member._id}
                              className="relative basis-1/2 px-3 pt-6 xl:basis-1/3"
                            >
                              <span className="absolute left-0 right-0 top-0 border-t border-blue-300" />
                              <span className="absolute left-1/2 top-0 h-6 border-l border-blue-300" />
                              <MemberPanel
                                member={member}
                                className="relative"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="ml-5 mt-6 space-y-4 border-l-2 border-blue-300 pl-6 md:hidden">
                        {members.map((member) => (
                          <div key={member._id} className="relative">
                            <span className="absolute -left-6 top-1/2 w-6 border-t border-blue-300" />
                            <MemberPanel member={member} />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>

              <div className="grid items-start gap-8 lg:grid-cols-2">
                <IndependentSection
                  title="Conveners"
                  members={conveners}
                  icon={UsersRound}
                  accentClass="border-orange-200 bg-orange-50/70 hover:border-orange-300"
                  emptyMessage="No Conveners have been added yet."
                />

                <IndependentSection
                  title="Head"
                  members={heads}
                  icon={UserRound}
                  accentClass="border-emerald-200 bg-emerald-50/70 hover:border-emerald-300"
                  emptyMessage="No Head members have been added yet."
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MonitoringCommitteePage;
