import { useMemo, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  UserRound,
  UsersRound,
} from "lucide-react";

import Header from "../../components/common/Header/Header";
import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer";
import csirLogo from "../../assets/logos/CSIR.jpg";
import {
  getMonitoringCommittee,
  getMonitoringCommitteeSettings,
} from "../../services/monitoringCommittee.service";

const DEFAULT_HEADER_SUBTITLE =
  "Contact information for monitoring committee of the SMART Village Mission.";

const sortByOrder = (members) =>
  [...members].sort(
    (a, b) =>
      Number(a.displayOrder || 0) -
      Number(b.displayOrder || 0)
  );

const MemberPanel = ({ member, label, vertical = false, className = "" }) => (
  <article
    className={
      "flex h-full min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 transition duration-200 hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm " +
      (vertical ? "min-h-[320px] flex-col gap-y-2 " : "") + className
    }
  >
    {label && (
      <p className="w-full break-words text-center text-xs font-normal text-slate-500">
        {label}
      </p>
    )}
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

    <div className={vertical ? "min-w-0 w-full flex-1 text-left" : "min-w-0 flex-1"}>
      {member.name && (
        <h3 className={vertical
            ? "break-words text-center text-base font-bold text-slate-900"
            : "break-words text-center text-base font-bold text-slate-900 sm:text-lg"}>
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

const MemberRow = ({ members, label, individualHeadings = false }) => {
  const rowRef = useRef(null);
  const scroll = (direction) => {
    const row = rowRef.current;
    if (!row) return;
    row.scrollBy({
      left: direction * row.clientWidth * 0.8,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  };

  return (
    <>
      <div className="relative flex h-14 items-center justify-end gap-2">
        <span className="absolute inset-y-0 left-1/2 w-px bg-blue-300" aria-hidden="true" />
        <button type="button" onClick={() => scroll(-1)} aria-label={`Scroll ${label} left`}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500">
          <ChevronLeft size={18} />
        </button>
        <button type="button" onClick={() => scroll(1)} aria-label={`Scroll ${label} right`}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-blue-50 focus-visible:outline-2 focus-visible:outline-blue-500">
          <ChevronRight size={18} />
        </button>
      </div>
      <div ref={rowRef} role="region" aria-label={label} tabIndex={0}
        className="overflow-x-auto overscroll-x-contain rounded-lg pb-3 focus-visible:outline-2 focus-visible:outline-blue-500">
        <div className="mx-auto grid w-max min-w-full grid-flow-col auto-cols-[240px] justify-center">
          {members.map((member) => (
            <div key={member._id} className="relative min-w-0 px-2 pt-6">
              <span aria-hidden="true" className="absolute left-0 right-0 top-0 border-t border-blue-300" />
              <span aria-hidden="true" className="absolute left-1/2 top-0 h-6 border-l border-blue-300" />
              <MemberPanel member={member} vertical
                label={individualHeadings ? member.roleLabel || "Other Member" : "Committee Member"} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const MonitoringCommitteePage = () => {
  const {
    data: rawMembers = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["monitoring-committee"],
    queryFn: getMonitoringCommittee,
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: "always",
  });
  const {
    data: headerSettings = {},
    isLoading: settingsLoading,
    isError: settingsError,
  } = useQuery({
    queryKey: ["monitoring-committee-settings"],
    queryFn: getMonitoringCommitteeSettings,
    staleTime: 0,
    refetchInterval: 5000,
    refetchOnWindowFocus: "always",
  });

  const { chairman, members, otherMembers } = useMemo(() => {
    const sorted = sortByOrder(Array.isArray(rawMembers) ? rawMembers.filter(Boolean) : []);
    return {
      chairman: sorted.find(member => member.role === "CHAIRMAN"),
      members: sorted.filter(member => member.role === "MEMBER"),
      otherMembers: sorted.filter(member => !["CHAIRMAN", "MEMBER"].includes(member.role)),
    };
  }, [rawMembers]);
  const hasCommittee = Boolean(chairman) || members.length > 0 || otherMembers.length > 0;
  const headerSubtitle =
    typeof headerSettings.subtitle === "string"
      ? headerSettings.subtitle
      : DEFAULT_HEADER_SUBTITLE;

  return (
    <>
      <Header />
      <Navbar />

      <main className="bg-slate-50">
        <section className="bg-slate-900 py-12 text-white sm:py-14">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <span className="font-semibold uppercase tracking-widest text-blue-300">
              About
            </span>
            <div className="mt-3 flex items-center justify-center gap-2 sm:gap-4">
              <img
                src={csirLogo}
                alt="CSIR logo"
                className="h-[clamp(48px,14vw,64px)] w-auto shrink-0 object-contain"
              />
              <h1 className="min-w-0 text-[clamp(1.25rem,7vw,3rem)] font-bold">
                Monitoring Committee
              </h1>
            </div>
            {headerSubtitle && (
              <p className="mx-auto mt-4 max-w-3xl text-lg text-slate-300">
                {headerSubtitle}
              </p>
            )}
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-12 px-6 py-10 lg:px-8 lg:py-14">
          {isLoading || settingsLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-14 text-center text-slate-500">
              Loading Monitoring Committee...
            </div>
          ) : isError || settingsError ? (
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
              <section aria-label="Chairman hierarchy">
                {chairman ? (
                  <div className="mx-auto max-w-[620px] rounded-2xl border border-blue-300 bg-blue-100/70 p-2">
                    <div className="flex items-center justify-center gap-2 px-3 pb-2 pt-1">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                        <UserRound size={20} />
                      </span>
                      <h2 className="text-xl font-bold text-blue-900">
                        {chairman.roleLabel || headerSettings.chairmanHeading}
                      </h2>
                    </div>
                    <MemberPanel member={chairman} />
                  </div>
                ) : (
                  <EmptySection message="Chairman details have not been added yet." />
                )}

                {members.length > 0 && <MemberRow members={members} label="Committee Members" />}
                {otherMembers.length > 0 && <MemberRow members={otherMembers} label="Other Members" individualHeadings />}
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default MonitoringCommitteePage;
