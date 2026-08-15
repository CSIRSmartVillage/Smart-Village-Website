import { useQuery } from "@tanstack/react-query";
import {
  Building2,
  ExternalLink,
  HeartHandshake,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import {
  getSupporters,
} from "../../services/supporter.service";

const sections = [
  {
    type: "NGO",
    title: "NGO's",
    description:
      "Non-government organisations supporting village development and community participation.",
    icon: Building2,
  },
  {
    type: "DONOR",
    title: "Donor's",
    description:
      "Organisations and contributors supporting the mission through resources and collaboration.",
    icon: HeartHandshake,
  },
];

const SupporterCard = ({ supporter }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="flex h-44 items-center justify-center border-b border-slate-100 bg-slate-50 p-6">
      <img
        src={supporter.logo?.url}
        alt={supporter.logo?.alt || supporter.name + " logo"}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-contain"
      />
    </div>

    <div className="flex flex-1 flex-col p-6">
      <h3 className="text-xl font-bold text-slate-900">
        {supporter.name}
      </h3>

      <p className="mt-3 flex-1 whitespace-pre-line text-base leading-7 text-slate-600">
        {supporter.about}
      </p>

      <a
        href={supporter.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-blue-700 transition hover:text-blue-900"
      >
        Visit website
        <ExternalLink size={17} />
      </a>
    </div>
  </article>
);

const SupporterSection = ({
  section,
  supporters,
}) => {
  const Icon = section.icon;
  const matchingSupporters = supporters.filter(
    (supporter) => supporter.type === section.type
  );

  return (
    <section
      aria-labelledby={
        "supporter-section-" + section.type.toLowerCase()
      }
    >
      <div className="mb-8 flex items-start gap-4 border-b border-slate-200 pb-5">
        <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
          <Icon size={26} />
        </div>

        <div>
          <h2
            id={
              "supporter-section-" +
              section.type.toLowerCase()
            }
            className="text-3xl font-bold text-slate-900 md:text-4xl"
          >
            {section.title}
          </h2>

          <p className="mt-2 max-w-3xl text-slate-600">
            {section.description}
          </p>
        </div>
      </div>

      {matchingSupporters.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          No {section.type === "NGO" ? "NGOs" : "donors"} have been added yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matchingSupporters.map((supporter) => (
            <SupporterCard
              key={supporter._id}
              supporter={supporter}
            />
          ))}
        </div>
      )}
    </section>
  );
};

const SupportersPage = () => {
  const {
    data: supporters = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["public-supporters"],
    queryFn: getSupporters,
  });

  return (
    <MainLayout>
      <section className="border-b border-slate-200 bg-[#F4F9FF] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
            Collaboration
          </p>

          <h1 className="mt-3 text-4xl font-bold text-slate-950 lg:text-5xl">
            Our Supporters
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            We acknowledge the organisations and donors whose support helps advance the CSIR Smart Village Mission.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16 lg:py-20">
        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">
            Loading supporters...
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-700">
            Supporters could not be loaded. Please try again later.
          </div>
        ) : (
          sections.map((section) => (
            <SupporterSection
              key={section.type}
              section={section}
              supporters={supporters}
            />
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default SupportersPage;