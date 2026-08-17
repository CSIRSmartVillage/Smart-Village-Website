import { Search, RotateCcw } from "lucide-react";

const EventFilters = ({
  filters,
  updateFilter,
  resetFilters,
  villages = [],
}) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">

        {/* Search */}

        <div className="relative xl:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={filters.search || ""}
            onChange={(e) =>
              updateFilter("search", e.target.value)
            }
            placeholder="Search events..."
            className="w-full rounded-xl border border-slate-300 py-2.5 pl-10 pr-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Village */}

        <select
          value={filters.village || ""}
          onChange={(e) =>
            updateFilter("village", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Villages</option>

          {villages.map((village) => (
            <option
              key={village._id}
              value={village._id}
            >
              {village.name?.en || village.name}
            </option>
          ))}
        </select>

        {/* Type */}

        <select
          value={filters.type || ""}
          onChange={(e) =>
            updateFilter("type", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Types</option>
          <option value="EVENT">Event</option>
          <option value="ACHIEVEMENT">
            Achievement
          </option>
          <option value="VISIT">Visit</option>
        </select>

        {/* Status */}

        <select
          value={filters.status || ""}
          onChange={(e) =>
            updateFilter("status", e.target.value)
          }
          className="rounded-xl border border-slate-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="">All Status</option>
          <option value="UPCOMING">
            Upcoming
          </option>
          <option value="ONGOING">
            Ongoing
          </option>
          <option value="COMPLETED">
            Completed
          </option>
        </select>

        {/* Reset */}

        <button
          type="button"
          onClick={resetFilters}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 font-medium text-slate-700 transition hover:bg-slate-100"
        >
          <RotateCcw size={18} />
          Reset
        </button>

      </div>
    </div>
  );
};

export default EventFilters;