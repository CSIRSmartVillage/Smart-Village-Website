import { lazy } from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const LoginPage = lazy(() => import("../pages/LoginPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const AdminLayout = lazy(() => import("../layouts/AdminLayout"));
const PagesPage = lazy(() => import("../pages/PagesPage"));
const NavigationPage = lazy(() => import("../pages/NavigationPage"));
const NewsManagementPage = lazy(() => import("../pages/NewsManagementPage"));
const SuccessStoriesPage = lazy(() => import("../pages/SuccessStoriesPage"));
const PageEditPage = lazy(() => import("../pages/PageEditPage"));
const PageSectionsPage = lazy(() => import("../pages/PageSectionsPage"));
const EditSectionPage = lazy(() => import("../pages/EditSectionPage"));
const CreateNewsPage = lazy(() => import("../pages/CreateNewsPage"));
const EditNewsPage = lazy(() => import("../pages/EditNewsPage"));
const LaboratoriesPage = lazy(() => import("../pages/LaboratoriesPage"));
const CreateSuccessStoryPage = lazy(() => import("../pages/CreateSuccessStoryPage"));
const CreateLaboratoryPage = lazy(() => import("../pages/CreateLaboratoryPage"));
const EditLaboratoryPage = lazy(() => import("../pages/EditLaboratoryPage"));
const EditSuccessStoryPage = lazy(() => import("../pages/EditSuccessStoryPage"));
const CreateNavigationPage = lazy(() => import("../pages/CreateNavigationPage"));
const EditNavigationPage = lazy(() => import("../pages/EditNavigationPage"));
const MediaLibraryPage = lazy(() => import("../pages/MediaLibraryPage"));
const VideosPage = lazy(() => import("../pages/VideosPage"));
const CreateVideoPage = lazy(() => import("../pages/CreateVideoPage"));
const EditVideoPage = lazy(() => import("../pages/EditVideoPage"));
const AnnouncementsPage = lazy(() => import("../pages/AnnouncementsPage"));
const CreateAnnouncementPage = lazy(() => import("../pages/CreateAnnouncementPage"));
const EditAnnouncementPage = lazy(() => import("../pages/EditAnnouncementPage"));
const HomeSectionsPage = lazy(() => import("../pages/HomeSectionsPage"));
const SuccessStoryVillagesPage = lazy(() => import("../pages/SuccessStoryVillagesPage"));
const CreateSuccessStoryVillagePage = lazy(() => import("../pages/CreateSuccessStoryVillagePage"));
const EditSuccessStoryVillagePage = lazy(() => import("../pages/EditSuccessStoryVillagePage"));
const SmartVillageDashboard = lazy(() => import("../pages/SmartVillageDashboard"));
const VillageProfilesPage = lazy(() => import("../pages/VillageProfilesPage"));
const CreateVillageProfilePage = lazy(() => import("../pages/CreateVillageProfilePage"));
const EditVillageProfilePage = lazy(() => import("../pages/EditVillageProfilePage"));
const DevelopmentPlanManagementPage = lazy(() => import("../pages/DevelopmentPlanManagementPage"));
const CreateDevelopmentPlanPage = lazy(() => import("../pages/CreateDevelopmentPlanPage"));
const EditDevelopmentPlanPage = lazy(() => import("../pages/EditDevelopmentPlanPage"));
const EventsManagementPage = lazy(() => import("../pages/EventsManagementPage"));
const CreateEventPage = lazy(() => import("../pages/CreateEventPage"));
const EditEventPage = lazy(() => import("../pages/EditEventPage"));
const PoliciesSchemesPage = lazy(() => import("../pages/PoliciesSchemesPage"));
const CreatePoliciesSchemePage = lazy(() => import("../pages/CreatePoliciesSchemePage"));
const EditPoliciesSchemePage = lazy(() => import("../pages/EditPoliciesSchemePage"));
const SelfHelpGroupsPage = lazy(() => import("../pages/SelfHelpGroupsPage"));
const CreateSelfHelpGroupPage = lazy(() => import("../pages/CreateSelfHelpGroupPage"));
const EditSelfHelpGroupPage = lazy(() => import("../pages/EditSelfHelpGroupPage"));
const VillageLocationsPage = lazy(() => import("../pages/VillageLocationsPage"));
const CreateVillageLocationPage = lazy(() => import("../pages/CreateVillageLocationPage"));
const EditVillageLocationPage = lazy(() => import("../pages/EditVillageLocationPage"));
const SurveyManagementPage = lazy(() => import("../pages/SurveyManagementPage"));
const SupportersPage = lazy(() => import("../pages/SupportersPage"));
const CreateSupporterPage = lazy(() => import("../pages/CreateSupporterPage"));
const EditSupporterPage = lazy(() => import("../pages/EditSupporterPage"));
const ProtectedRoute = ({
  children,
}) => {
  const token =
    localStorage.getItem(
      "accessToken"
    );

  return token
    ? children
    : (
      <Navigate
        to="/admin/login"
      />
    );
};

const AdminRoutes = () => {
  return (
    <Routes>

      <Route
        path="/login"
        element={
          <LoginPage />
        }
      />

      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
           }
          >
  <Route
    path="/dashboard"
    element={<DashboardPage />}
  />

  <Route
    path="/pages"
    element={<PagesPage />}
  />

  <Route
    path="/navigation"
    element={<NavigationPage />}
  />

  <Route
    path="/news"
    element={<NewsManagementPage />}
  />

  <Route
    path="/success-stories"
    element={<SuccessStoriesPage />}
  />


  <Route
  path="/success-story-villages"
  element={
    <SuccessStoryVillagesPage />
  }
/>




<Route
  path="/success-story-villages/create"
  element={
    <CreateSuccessStoryVillagePage />
  }
/>

<Route
  path="/success-story-villages/:id"
  element={
    <EditSuccessStoryVillagePage />
  }
/>


<Route
  path="smart-village"
  element={<SmartVillageDashboard />}
/>

<Route
  path="village-profiles"
  element={<VillageProfilesPage />}
/>

<Route
  path="village-profiles/create"
  element={<CreateVillageProfilePage />}
/>

<Route
  path="village-profiles/:id/edit"
  element={<EditVillageProfilePage />}
/>


<Route
  path="development-plans"
  element={<DevelopmentPlanManagementPage />}
/>

<Route
  path="development-plans/create"
  element={<CreateDevelopmentPlanPage />}
/>

<Route
  path="development-plans/:id/edit"
  element={<EditDevelopmentPlanPage />}
/>

<Route
  path="surveys"
  element={<SurveyManagementPage />}
/>


<Route
  path="events"
  element={<EventsManagementPage />}
/>

<Route
  path="events/create"
  element={<CreateEventPage />}
/>

<Route
    path="events/:id/edit"
    element={<EditEventPage />}
/>

<Route
  path="policies-schemes"
  element={<PoliciesSchemesPage />}
/>

<Route
  path="policies-schemes/create"
  element={<CreatePoliciesSchemePage />}
/>

<Route
  path="policies-schemes/:id/edit"
  element={<EditPoliciesSchemePage />}
/>

<Route
  path="self-help-groups"
  element={<SelfHelpGroupsPage />}
/>

<Route
  path="self-help-groups/create"
  element={<CreateSelfHelpGroupPage />}
/>

<Route
  path="self-help-groups/:id/edit"
  element={<EditSelfHelpGroupPage />}
/>

<Route
  path="village-locations"
  element={<VillageLocationsPage />}
/>

<Route
  path="village-locations/create"
  element={<CreateVillageLocationPage />}
/>

<Route
  path="village-locations/:id/edit"
  element={<EditVillageLocationPage />}
/>



  <Route
  path="announcements"
  element={<AnnouncementsPage />}
/>

<Route
  path="announcements/create"
  element={<CreateAnnouncementPage />}
/>

<Route
  path="announcements/edit/:id"
  element={<EditAnnouncementPage />}
/>

  <Route
  path="/pages/:id"
  element={
    <PageEditPage />
  }
/>

<Route
  path="/pages/:pageId/sections"
  element={
    <PageSectionsPage />
  }
/>

<Route
  path="/sections/:id"
  element={
    <EditSectionPage />
  }
/>

<Route
  path="/news/create"
  element={
    <CreateNewsPage />
  }
/>

<Route
  path="/news/:id"
  element={
    <EditNewsPage />
  }
/>

<Route
  path="/laboratories"
  element={
    <LaboratoriesPage />
  }
/>


<Route
  path="/laboratories/create"
  element={
    <CreateLaboratoryPage />
  }
/>

<Route
  path="/laboratories/:id"
  element={<EditLaboratoryPage />}
/>

<Route
  path="/success-stories/create"
  element={
    <CreateSuccessStoryPage />
  }
/>

<Route
  path="/success-stories/:id"
  element={
    <EditSuccessStoryPage />
  }
/>


<Route
  path="/videos"
  element={
    <VideosPage />
  }
/>

<Route
  path="/videos/create"
  element={
    <CreateVideoPage />
  }
/>

<Route
  path="/videos/:id"
  element={
    <EditVideoPage />
  }
/>



<Route
  path="/navigation/create"
  element={
    <CreateNavigationPage />
  }
/>

<Route
  path="/navigation/:id"
  element={
    <EditNavigationPage />
  }
/>

<Route
  path="/media"
  element={
    <MediaLibraryPage />
  }
/>

<Route
  path="supporters"
  element={<SupportersPage />}
/>

<Route
  path="supporters/create"
  element={<CreateSupporterPage />}
/>

<Route
  path="supporters/:id/edit"
  element={<EditSupporterPage />}
/>
<Route
  path="*"
  element={
    <Navigate
      to="/admin/dashboard"
      replace
    />
  }
/>

<Route
  path="home-sections"
  element={
    <HomeSectionsPage />
  }
/>

</Route>

    </Routes>
  );
};

export default AdminRoutes;
