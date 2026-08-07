import { useEffect, useState } from "react";

import {
  getNodalLaboratory,
} from "../../services/laboratory.service";


import MainLayout
  from "../../layouts/MainLayout";
import LaboratoryHero
  from "../../components/laboratories/LaboratoryHero";

import SmartTextRenderer
  from "../../components/common/SmartTextRenderer";
import { normalizeDisplayList }
  from "../../utils/listText";


const NodalLabPage = () => {
  const [laboratory, setLaboratory] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const loadLaboratory =
      async () => {
        try {
          const data =
            await getNodalLaboratory();

          setLaboratory(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };

    loadLaboratory();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading...
      </div>
    );
  }

  if (!laboratory) {
    return (
      <div className="py-20 text-center">
        Nodal Laboratory not found
      </div>
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

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Contact Information
          </h2>

          <div className="space-y-2">
            {laboratory.directorName && (
              <p>
                Director: {laboratory.directorName}
              </p>
            )}

            <p className="whitespace-pre-wrap">{laboratory.address}</p>
            <p className="whitespace-pre-wrap">{laboratory.phone}</p>
            <p className="whitespace-pre-wrap">{laboratory.email}</p>
          </div>
        </div>

        {laboratory.website && (
          <a
            href={laboratory.website}
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            Visit Official Website
          </a>
        )}

      </section>

      </MainLayout>
    </>
  );
};

export default NodalLabPage;
