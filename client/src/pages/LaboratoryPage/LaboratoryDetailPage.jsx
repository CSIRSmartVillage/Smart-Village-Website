import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getLaboratoryBySlug,
} from "../../services/laboratory.service";

import MainLayout from "../../layouts/MainLayout";
import LaboratoryHero
  from "../../components/laboratories/LaboratoryHero";
import LaboratoryMembersTable
  from "../../components/laboratories/LaboratoryMembersTable";
import LaboratoryContactPanel
  from "../../components/laboratories/LaboratoryContactPanel";

import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
import { normalizeDisplayList }
  from "../../utils/listText";
import ResourceErrorState
  from "../../components/common/ResourceErrorState";
import {
  getUserFriendlyError,
  isNotFoundError,
} from "../../utils/userFriendlyError";

const LaboratoryDetailPage = () => {
  const { slug } =
    useParams();

  const [laboratory,
    setLaboratory] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  const [loadError,
    setLoadError] =
    useState(null);

  useEffect(() => {
    const loadLaboratory =
      async () => {
        try {
          const data =
            await getLaboratoryBySlug(
              slug
            );

          setLaboratory(
            data
          );
        } catch (error) {
          console.error(
            error
          );
          setLoadError(error);
        } finally {
          setLoading(
            false
          );
        }
      };

    loadLaboratory();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  if (loadError || !laboratory) {
    const notFound = !loadError || isNotFoundError(loadError);

    return (
      <MainLayout>
        <ResourceErrorState
          title={notFound ? "Laboratory not found" : "Unable to load laboratory"}
          message={
            notFound
              ? "The laboratory you are looking for may have been removed or the link may be incorrect."
              : getUserFriendlyError(loadError, "Unable to load the laboratory. Please try again.")
          }
          backTo="/csir-laboratories/participating-labs"
          backLabel="Back to Laboratories"
          onRetry={notFound ? undefined : () => window.location.reload()}
        />
      </MainLayout>
    );
  }

  const researchAreas =
    normalizeDisplayList(
      laboratory.researchAreas
    );
  const contributions =
    normalizeDisplayList(
      laboratory.contributions
    );

return (
  <>
  <MainLayout>
    <LaboratoryHero laboratory={laboratory} />

    <section className="max-w-7xl mx-auto px-6 py-16">

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">
          About Laboratory
        </h2>

        <SmartTextRenderer
          text={laboratory.overview}
          className="max-w-none"
        />
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Research Areas
        </h2>

        <ol className="grid gap-3 sm:grid-cols-2">
          {researchAreas.map(
            (item, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>
                {item}
                </span>
              </li>
            )
          )}
        </ol>
      </div>

      <div className="mb-12">
        <h2 className="text-3xl font-bold mb-4">
          Key Contributions
        </h2>

        <ol className="space-y-3">
          {contributions.map(
            (item, index) => (
              <li
                key={index}
                className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 leading-7 text-slate-700"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <span>
                {item}
                </span>
              </li>
            )
          )}
        </ol>
      </div>

      <LaboratoryMembersTable
        members={laboratory.members}
      />

      <LaboratoryContactPanel
        laboratory={laboratory}
      />

    </section>

    </MainLayout>
  </>
);
};

export default
  LaboratoryDetailPage;
