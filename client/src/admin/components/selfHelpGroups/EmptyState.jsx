const EmptyState = () => {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h2 className="text-xl font-semibold text-slate-800">
        No Self Help Groups Found
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Create the first SHG entry or adjust your filters.
      </p>
    </div>
  );
};

export default EmptyState;
