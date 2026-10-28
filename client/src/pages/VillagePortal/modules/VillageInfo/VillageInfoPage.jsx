import { useOutletContext } from "react-router-dom";

import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import VillageMapPage from "../VillageMap/VillageMapPage";

const VillageInfoPage = () => {
  const {
    profile,
    loading,
  } = useOutletContext();

  return (
    <div className="space-y-8">

      <AboutSection
        profile={profile}
        loading={loading}
      />

<GallerySection
  images={
    profile?.galleryImages || []
  }
  loading={loading}
/>

<ContactSection
  profile={profile}
/>

<VillageMapPage />

    </div>
  );
};

export default VillageInfoPage;
