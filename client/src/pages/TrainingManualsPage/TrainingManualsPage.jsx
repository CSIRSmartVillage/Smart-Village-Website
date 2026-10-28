import { useQuery } from "@tanstack/react-query";
import { BookOpen, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import { getTrainingManuals } from "../../services/trainingManual.service";

const TrainingManualsPage = () => {
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["training-manuals"],
    queryFn: getTrainingManuals,
  });

  return (
    <MainLayout>
      <section className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <h1 className="text-4xl font-bold text-slate-950 lg:text-5xl">Training Manuals</h1>

        <div className="mt-10">
          {isLoading ? <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-sm">Loading training manuals...</div>
          : isError ? <div className="rounded-2xl border border-red-200 bg-red-50 p-12 text-center text-red-700">Training manuals could not be loaded. Please try again later.</div>
          : data.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm"><BookOpen size={42} className="mx-auto text-slate-300" /><h2 className="mt-4 text-xl font-semibold text-slate-800">Training manuals will be available soon.</h2></div>
          : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.map((manual) => (
          <article key={manual._id} className="flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><BookOpen size={24} /></span>
            <h2 className="mt-5 text-xl font-bold text-slate-950">{manual.technologyName}</h2>
            <p className="mt-3 flex-1 whitespace-pre-line leading-7 text-slate-600">{manual.description || "Training resources and practical guidance."}</p>
            <Link to={`/training-manuals/${manual._id}`} className="mt-6 inline-flex items-center gap-2 self-start font-semibold text-blue-700 transition hover:text-blue-900">View Details <ChevronRight size={17} /></Link>
          </article>
          ))}</div>}
        </div>
      </section>
    </MainLayout>
  );
};

export default TrainingManualsPage;
