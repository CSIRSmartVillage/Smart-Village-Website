import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import VillageMapHero from "./components/Hero/VillageMapHero";
import VillageMapSkeleton from "./components/Hero/VillageMapSkeleton";
import VillageMapContainer from "./components/VillageMapContainer";
import FacilityList from "./components/FacilityList";
import EmptyState from "./components/EmptyState";
import FacilityFilters from "./components/FacilityFilters";
import { useVillageLocation } from "../../../../hooks/useVillageLocation";
import Legend from "./components/Legend";
import { getUserFriendlyError } from "../../../../utils/userFriendlyError";

const VillageMapPage = () => {
  const { slug } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
const [category, setCategory] = useState("all");

  const {
    data: villageLocation,
    isLoading,
    isError,
    error,
  } = useVillageLocation(slug);

  const facilities =
  villageLocation?.nearbyFacilities ?? [];

const categories = useMemo(() => {
  return [...new Set(
    facilities
      .map((facility) => facility.category)
      .filter(Boolean)
  )];
}, [facilities]);

const filteredFacilities = useMemo(() => {
  return facilities.filter((facility) => {
    const matchesSearch =
      facility.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      facility.address
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesCategory =
      category === "all" ||
      facility.category === category;

    return matchesSearch && matchesCategory;
  });
}, [facilities, searchTerm, category]);

  if (isLoading) {
    return <VillageMapSkeleton />;
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load village map"
        description={
          getUserFriendlyError(error, "Unable to load the village map. Please refresh the page.")
        }
      />
    );
  }

  if (!villageLocation) {
    return (
      <EmptyState
        title="Village map not available"
        description="No map information has been published for this village yet."
      />
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <VillageMapHero villageLocation={villageLocation} />

      <div className="container mx-auto px-4 lg:px-6">
        <VillageMapContainer
          villageLocation={villageLocation}
          facilities={filteredFacilities}
        />

        <div className="mt-8">
  <FacilityFilters
    searchTerm={searchTerm}
    onSearchChange={setSearchTerm}
    category={category}
    onCategoryChange={setCategory}
    categories={categories}
    totalFacilities={filteredFacilities.length}
  />
</div>

        <div className="mt-8">
          <Legend
  facilityCount={filteredFacilities.length}
  facilities={filteredFacilities}
/>
</div>

        <div className="mt-10">
            <FacilityList
  facilities={filteredFacilities}
/>
        </div>
      </div>
    </div>
  );
};

export default VillageMapPage;
