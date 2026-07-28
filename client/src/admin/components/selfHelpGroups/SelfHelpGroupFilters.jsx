import { Search } from "lucide-react";

const SelfHelpGroupFilters = ({
  search,
  setSearch,
  village,
  setVillage,
  status,
  setStatus,
  published,
  setPublished,
  villages = [],
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search SHGs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <select
          value={village}
          onChange={(e) =>
            setVillage(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Villages</option>

          {villages.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name?.en || item.name}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
          <option value="ARCHIVED">Archived</option>
        </select>

        <select
          value={published}
          onChange={(e) =>
            setPublished(e.target.value)
          }
          className="rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        >
          <option value="ALL">All Publishing</option>
          <option value="true">Published</option>
          <option value="false">Unpublished</option>
        </select>
      </div>
    </div>
  );
};

export default SelfHelpGroupFilters;
