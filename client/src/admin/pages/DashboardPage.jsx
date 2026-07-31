import {
  ArrowUpRight,
  FileText,
  Images,
  LayoutDashboard,
  Newspaper,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const admin = JSON.parse(localStorage.getItem("admin"));

  const overviewCards = [
    {
      label: "Content Pages",
      value: "Manage",
      helper: "Update page sections and content",
      icon: FileText,
      href: "/admin/pages",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "News & Updates",
      value: "Publish",
      helper: "Create announcements and news",
      icon: Newspaper,
      href: "/admin/news",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Media Library",
      value: "Upload",
      helper: "Manage images and documents",
      icon: Images,
      href: "/admin/media",
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "Smart Village",
      value: "Monitor",
      helper: "Villages, plans, surveys, and events",
      icon: Users,
      href: "/admin/smart-village",
      color: "bg-amber-50 text-amber-700",
    },
  ];

  const quickActions = [
    {
      label: "Create News",
      href: "/admin/news/create",
    },
    {
      label: "Add Announcement",
      href: "/admin/announcements/create",
    },
    {
      label: "Upload Media",
      href: "/admin/media",
    },
    {
      label: "Edit Navigation",
      href: "/admin/navigation",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:p-8">
          <div>
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-700 text-white">
              <LayoutDashboard size={24} />
            </div>

            <p className="text-sm font-semibold uppercase tracking-wider text-blue-700">
              Admin Dashboard
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">
              Welcome back, {admin?.username || "Admin"}
            </h1>

            <p className="mt-3 max-w-2xl text-slate-600">
              Manage website content, village information, media,
              announcements, and Smart Village records from one place.
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-950">
                  Signed in as
                </p>
                <p className="text-sm text-slate-500">
                  {admin?.role || "Administrator"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {overviewCards.map(({ label, value, helper, icon: Icon, href, color }) => (
          <Link
            key={label}
            to={href}
            className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${color}`}>
                <Icon size={22} />
              </div>

              <ArrowUpRight
                size={18}
                className="text-slate-300 transition group-hover:text-blue-700"
              />
            </div>

            <p className="mt-5 text-sm font-semibold text-slate-500">
              {label}
            </p>
            <p className="mt-1 text-2xl font-bold text-slate-950">
              {value}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {helper}
            </p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Common tasks are grouped here for faster access.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                to={action.href}
                className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
              >
                {action.label}
                <ArrowUpRight size={16} />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">
            Admin Profile
          </h2>

          <dl className="mt-5 space-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Username
              </dt>
              <dd className="mt-1 break-words text-sm font-medium text-slate-800">
                {admin?.username || "Not available"}
              </dd>
            </div>

            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Role
              </dt>
              <dd className="mt-1 inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {admin?.role || "Admin"}
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
