import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import VillageLocationForm from "../components/villageLocation/VillageLocationForm";
import NearbyFacilityManager from "../components/villageLocation/NearbyFacilityManager";

import {
  getVillageLocationById,
  updateVillageLocation,
} from "../services/villageLocation.service";

const EditVillageLocationPage = () => {
  const { id } = useParams();

  const queryClient = useQueryClient();

  const [saving, setSaving] =
    useState(false);

  const [localLocation, setLocalLocation] =
    useState(null);

  const {
    data: fetchedLocation,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "admin-village-location",
      id,
    ],
    queryFn: () =>
      getVillageLocationById(id),
    enabled: !!id,
  });

  const location =
    localLocation || fetchedLocation;

  const handleSubmit = async (
    values
  ) => {
    try {
      setSaving(true);

      const updated =
        await updateVillageLocation(
          id,
          values
        );

      alert(
        "Village Location updated successfully."
      );

      setLocalLocation(updated);

      queryClient.setQueryData(
        [
          "admin-village-location",
          id,
        ],
        updated
      );

      queryClient.setQueryData(
        ["admin-village-locations"],
        (current) =>
          current
            ? {
                ...current,
                locations: (
                  current.locations || []
                ).map((item) =>
                  item._id === updated._id
                    ? updated
                    : item
                ),
              }
            : current
      );
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to update the village location. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="flex h-96 items-center justify-center text-red-600">
        Unable to load Village Location.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Edit Village Location
        </h1>

        <p className="mt-2 text-slate-500">
          Update village map settings and
          manage nearby facilities.
        </p>
      </div>

      <VillageLocationForm
        initialValues={location}
        onSubmit={handleSubmit}
        loading={saving}
      />

      <div className="mt-8">
        <NearbyFacilityManager
          location={location}
          onLocationChange={
            setLocalLocation
          }
        />
      </div>
    </div>
  );
};

export default EditVillageLocationPage;
