import {
  lazy,
  Suspense,
} from "react";

import {
  Routes,
  Route,
} from "react-router-dom";

import PageLoader from "../components/common/PageLoader";

const AdminRoutes = lazy(() =>
  import("../admin/routes/AdminRoutes")
);

const HomePage = lazy(() =>
  import("../pages/HomePage/HomePage")
);

const AboutPage = lazy(() =>
  import("../pages/AboutPage/AboutPage")
);

const MissionObjectivesPage = lazy(() =>
  import("../pages/AboutPage/MissionObjectivesPage")
);

const DGDeskPage = lazy(() =>
  import("../pages/AboutPage/DGDeskPage")
);

const DirectorDeskPage = lazy(() =>
  import("../pages/AboutPage/DirectorDeskPage")
);

const NodalLabPage = lazy(() =>
  import("../pages/NodalLabPage/NodalLabPage")
);

const ParticipatingLabsPage = lazy(() =>
  import(
    "../pages/ParticipatingLabsPage/ParticipatingLabsPage"
  )
);

const LaboratoryDetailPage = lazy(() =>
  import(
    "../pages/LaboratoryPage/LaboratoryDetailPage"
  )
);

const NewsPage = lazy(() =>
  import("../pages/NewsPage/NewsPage")
);

const NewsDetailPage = lazy(() =>
  import("../pages/NewsPage/NewsDetailPage")
);

const SuccessStoriesPage = lazy(() =>
  import(
    "../pages/SuccessStoriesPage/SuccessStoriesPage"
  )
);

const VillageSuccessStoriesPage = lazy(() =>
  import(
    "../pages/SuccessStoriesPage/VillageSuccessStoriesPage"
  )
);

const SuccessStoryDetailPage = lazy(() =>
  import(
    "../pages/SuccessStoriesPage/SuccessStoryDetailPage"
  )
);

const ContactPage = lazy(() =>
  import("../pages/ContactPage/ContactPage")
);

const AnnouncementDetailPage = lazy(() =>
  import(
    "../pages/AnnouncementPage/AnnouncementDetailPage"
  )
);

const VillageLayout = lazy(() =>
  import(
    "../pages/VillagePortal/layout/VillageLayout"
  )
);

const VillageInfoPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/VillageInfo/VillageInfoPage"
  )
);

const DevelopmentPlanPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/DevelopmentPlan/DevelopmentPlanPage"
  )
);

const DevelopmentPlanDetailPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/DevelopmentPlan/DevelopmentPlanDetailPage"
  )
);

const EventsPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/Events/EventsPage"
  )
);

const EventDetailPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/Events/EventDetailPage"
  )
);

const VillageMapPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/VillageMap/VillageMapPage"
  )
);

const PoliciesPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/Policies/PoliciesPage"
  )
);

const SelfHelpGroupsPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/SelfHelpGroups/SelfHelpGroupsPage"
  )
);

const SelfHelpGroupDetailPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/SelfHelpGroups/SelfHelpGroupDetailPage"
  )
);

const IndicatorsPage = lazy(() =>
  import(
    "../pages/VillagePortal/modules/Indicators/IndicatorsPage"
  )
);

const AppRoutes = () => {
  return (

        <Suspense
      fallback={<PageLoader />}>
    <Routes>

      {/* ================= ADMIN ================= */}

      <Route path="/admin/*" element={<AdminRoutes />} />

      {/* ================= PUBLIC ================= */}

      <Route path="/" element={<HomePage />} />

      {/* About */}

      <Route path="/about" element={<AboutPage />} />

      <Route
        path="/about/mission-objectives"
        element={<MissionObjectivesPage />}
      />

      <Route
        path="/about/dg-desk"
        element={<DGDeskPage />}
      />
      
      <Route
        path="/about/director-desk"
        element={<DirectorDeskPage />}
      />

      {/* Announcements */}

      <Route
        path="/announcements/:slug"
        element={<AnnouncementDetailPage />}
      />

      {/* CSIR Labs */}

      <Route
        path="/csir-laboratories/nodal-lab"
        element={<NodalLabPage />}
      />

      <Route
        path="/csir-laboratories/participating-labs"
        element={<ParticipatingLabsPage />}
      />

      <Route
        path="/participating-labs/:slug"
        element={<LaboratoryDetailPage />}
      />

      {/* News */}

      <Route
        path="/news-updates"
        element={<NewsPage />}
      />

      <Route
        path="/news/:slug"
        element={<NewsDetailPage />}
      />

      {/* Success Stories */}

      <Route
        path="/success-stories"
        element={<SuccessStoriesPage />}
      />

      <Route
        path="/success-stories/:villageSlug"
        element={<VillageSuccessStoriesPage />}
      />

      <Route
        path="/success-stories/:villageSlug/:storySlug"
        element={<SuccessStoryDetailPage />}
      />

      {/* Contact */}

      <Route
        path="/contact"
        element={<ContactPage />}
      />

      <Route
  path="/village/:slug"
  element={<VillageLayout />}
>
  <Route
    index
    element={<VillageInfoPage />}
  />

  <Route
    path="development-plan"
    element={<DevelopmentPlanPage />}
  />

  <Route
  path="development-plan/:id"
  element={<DevelopmentPlanDetailPage />}
/>

  <Route
    path="events"
    element={<EventsPage />}
  />

  <Route
  path="events/:eventSlug"
  element={<EventDetailPage />}
/>

  <Route
    path="map"
    element={<VillageMapPage />}
  />

  <Route
    path="policies"
    element={<PoliciesPage />}
  />

  <Route
    path="self-help-groups"
    element={<SelfHelpGroupsPage />}
  />

  <Route
    path="self-help-groups/:shgSlug"
    element={<SelfHelpGroupDetailPage />}
  />

  <Route
    path="indicators"
    element={<IndicatorsPage />}
  />

     </Route>

    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
