import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  getAllLaboratories,
} from "../../services/laboratory.service";

const ParticipatingLabsList = () => {
  const [labs, setLabs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const sortedLabs = useMemo(
    () =>
      [...labs].sort((a, b) =>
        a.name.localeCompare(
          b.name,
          undefined,
          {
            sensitivity: "base",
            numeric: true,
          }
        )
      ),
    [labs]
  );

  useEffect(() => {
    const loadLabs =
      async () => {
        try {
          const data =
            await getAllLaboratories();

          const participatingLabs =
            data.filter(
              (lab) =>
                lab.type ===
                  "PARTICIPATING" &&
                lab.isPublished
            );

          setLabs(
            participatingLabs
          );
        } catch (error) {
          console.error(
            error
          );
        } finally {
          setLoading(
            false
          );
        }
      };

    loadLabs();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading laboratories...
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-12">
          <h2 className="text-4xl font-bold text-slate-900">
            Participating Laboratories
          </h2>

          <p className="mt-4 text-slate-600 max-w-3xl">
            CSIR laboratories contributing
            expertise, innovation,
            scientific research and
            technology development
            for Smart Village initiatives.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">

          {sortedLabs.map((lab) => (
            <Link
              key={lab._id}
              to={`/participating-labs/${lab.slug}`}
              className="
                border
                border-slate-200
                rounded-lg
                px-5
                py-4
                hover:border-blue-600
                hover:bg-blue-50
                transition-all
              "
            >
              <div className="font-semibold text-lg text-slate-900">
                {lab.name}
              </div>
            </Link>
          ))}

        </div>

      </div>
    </section>
  );
};

export default ParticipatingLabsList;