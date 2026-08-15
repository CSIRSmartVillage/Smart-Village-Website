import { useState } from "react";
import {
  LogOut,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  const navClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2.5 text-sm font-medium transition ${
      isActive
        ? "bg-blue-700 text-white shadow-sm"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
    }`;

  const menuSections = [
    {
      title: "Dashboard",
      items: [
        {
          label: "Dashboard",
          path: "/admin/dashboard",
        },
      ],
    },

    {
      title: "CMS",
      items: [
        {
          label: "Pages",
          path: "/admin/pages",
        },
        {
          label: "Navigation",
          path: "/admin/navigation",
        },
        {
          label: "Media Library",
          path: "/admin/media",
        },
      ],
    },

    {
      title: "Website Content",
      items: [
        {
          label: "News",
          path: "/admin/news",
        },
        {
          label: "Announcements",
          path: "/admin/announcements",
        },
        {
          label: "Videos",
          path: "/admin/videos",
        },
        {
          label: "Home Sections",
          path: "/admin/home-sections",
        },
        {
          label: "Success Stories",
          path: "/admin/success-stories",
        },
        {
          label: "Success Story Villages",
          path: "/admin/success-story-villages",
        },
        {
          label: "Supporters",
          path: "/admin/supporters",
        },
      ],
    },

    {
      title: "Smart Village",
      items: [
        {
          label: "Villages",
          path: "/admin/smart-village",
        },
        {
          label: "Development Plans",
          path: "/admin/development-plans",
        },
        {
          label: "Village Locations",
          path: "/admin/village-locations",
        },
        {
          label: "Events & Achievements",
          path: "/admin/events",
        },
            {
      label: "Survey Management",
      path: "/admin/surveys",
    },
        {
          label: "Policies & Schemes",
          path: "/admin/policies-schemes",
        },
        {
          label: "Self Help Groups",
          path: "/admin/self-help-groups",
        },
      ],
    },

    {
      title: "Administration",
      items: [
        {
          label: "Laboratories",
          path: "/admin/laboratories",
        },
      ],
    },
  ];

  const sidebar = (
    <aside className="flex h-full w-72 flex-col border-r border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-700 text-white">
            <Shield size={20} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-950">
              CMS Admin
            </h2>
            <p className="text-xs text-slate-500">
              {admin?.username || "Administrator"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Close admin menu"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {menuSections.map((section) => (
          <div
            key={section.title}
            className="mb-7"
          >
            <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              {section.title}
            </h3>

            <nav className="space-y-1">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={navClass}
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block">
        {sidebar}
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close admin menu overlay"
          />
          <div className="relative h-full">
            {sidebar}
          </div>
        </div>
      )}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Open admin menu"
          >
            <Menu size={24} />
          </button>

          <div className="text-right">
            <p className="text-sm font-semibold text-slate-950">
              CMS Admin
            </p>
            <p className="text-xs text-slate-500">
              {admin?.username || "Administrator"}
            </p>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
