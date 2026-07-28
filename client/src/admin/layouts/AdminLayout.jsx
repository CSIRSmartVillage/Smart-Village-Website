import { Outlet, NavLink } from "react-router-dom";

const AdminLayout = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("admin");
    window.location.href = "/admin/login";
  };

  const navClass = ({ isActive }) =>
    `block rounded-lg px-3 py-2 transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}

      <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r bg-white">
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="mb-2 text-2xl font-bold">
            CMS Admin
          </h2>

          <p className="mb-8 text-sm text-gray-500">
            {admin?.username}
          </p>

          {menuSections.map((section) => (
            <div
              key={section.title}
              className="mb-8"
            >
              <h3 className="mb-3 border-b pb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                {section.title}
              </h3>

              <nav className="space-y-2">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={navClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>
          ))}
        </div>

        {/* Logout */}

        <div className="border-t p-6">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}

      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
