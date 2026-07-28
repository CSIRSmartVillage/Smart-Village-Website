import { Link } from "react-router-dom";

const cards = [
  {
    title: "States",
    description: "Manage states participating in the Smart Village Mission.",
    path: "/admin/states",
    icon: "🌍",
    category: "Master Data",
  },
  {
    title: "Villages",
    description: "Manage villages and their master information.",
    path: "/admin/villages",
    icon: "🏘️",
    category: "Master Data",
  },
  {
    title: "Village Profiles",
    description: "Manage hero, overview, event-backed highlights, gallery and contact information.",
    path: "/admin/village-profiles",
    icon: "📄",
    category: "Village Content",
  },
  {
    title: "Village Statistics",
    description: "Population, households, education and infrastructure.",
    path: "/admin/village-statistics",
    icon: "📊",
    category: "Village Content",
  },
  {
    title: "Village VDI",
    description: "Village Development Index and analytics.",
    path: "/admin/village-vdi",
    icon: "📈",
    category: "Village Content",
  },
  {
    title: "Development Plans",
    description: "Manage ongoing and future development plans.",
    path: "/admin/development-plans",
    icon: "🛠️",
    category: "Village Content",
  },
  {
    title: "Policies & Schemes",
    description: "Government schemes and policies.",
    path: "/admin/policies-schemes",
    icon: "📜",
    category: "Development",
  },
  {
    title: "Self Help Groups",
    description: "Manage SHGs, leaders, members and publishing.",
    path: "/admin/self-help-groups",
    icon: "SHG",
    category: "Development",
  },
  {
    title: "Events",
    description: "Village events and achievements.",
    path: "/admin/events",
    icon: "🎉",
    category: "Development",
  },
  {
    title: "Village Map",
    description: "GIS, locations and map information.",
    path: "/admin/village-map",
    icon: "🗺️",
    category: "Development",
  },
];

const categories = [
  "Master Data",
  "Village Content",
  "Development",
];

export default function SmartVillageDashboard() {
  return (
    <div className="space-y-10">

      <div>
        <h1 className="text-4xl font-bold">
          🏡 Smart Village Management
        </h1>

        <p className="mt-2 text-gray-600">
          Manage all Smart Village modules from one dashboard.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-5">

          <h2 className="text-2xl font-semibold">
            {category}
          </h2>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {cards
              .filter(
                (card) => card.category === category
              )
              .map((card) => (
                <Link
                  key={card.title}
                  to={card.path}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-700">
                    {card.icon}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-600">
                    {card.description}
                  </p>
                </Link>
              ))}

          </div>

        </div>
      ))}

    </div>
  );
}
