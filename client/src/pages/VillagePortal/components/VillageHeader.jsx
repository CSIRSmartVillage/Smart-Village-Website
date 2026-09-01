import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const VillageHeader = ({ village }) => {
  return (
    <header className="bg-white border-b border-slate-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 py-4">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-sm text-slate-500">

          <Link
            to="/"
            className="flex items-center gap-1 hover:text-blue-700"
          >
            <Home size={16} />
            Home
          </Link>

          <ChevronRight size={16} />

          <span>CSIR SMART Village</span>

          <ChevronRight size={16} />

          <span className="font-medium text-slate-800">
            {village?.name?.en || village?.name}
          </span>

        </div>

      </div>

    </header>
  );
};

export default VillageHeader;
