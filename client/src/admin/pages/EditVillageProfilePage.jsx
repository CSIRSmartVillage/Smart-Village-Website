import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import VillageProfileForm from "../components/villageProfile/VillageProfileForm";

import {
  updateVillageProfile,
  getVillageProfile,
} from "../services/villageProfile.service";

import {
  getAllVillages,
  updateVillage,
} from "../services/village.service";
import { getAllStates } from "../services/state.service";

export default function EditVillageProfilePage() {
 const { id } = useParams();

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin-village-profile", id],
    queryFn: async () => {
      const [villageList, statesList, profileData] = await Promise.all([
        getAllVillages(),
        getAllStates(),
        getVillageProfile(id),
      ]);

      return {
        villages: villageList,
        states: statesList,
        profile: profileData,
      };
    },
    enabled: !!id,
  });

  const villages = data?.villages || [];
  const states = data?.states || [];
  const profile = data?.profile || null;

  const handleCoordinateSave = async (field, value) => {
    const village = profile?.village;
    const currentCoordinates = village?.location?.coordinates;

    if (!village?._id || !Array.isArray(currentCoordinates)) {
      throw new Error("Village coordinates are unavailable.");
    }

    const nextCoordinates = [...currentCoordinates];
    nextCoordinates[field === "latitude" ? 1 : 0] = value;

    const updatedVillage = await updateVillage(village._id, {
      location: {
        type: village.location?.type || "Point",
        coordinates: nextCoordinates,
      },
    });

    queryClient.setQueryData(["admin-village-profile", id], (current) => {
      if (!current) return current;

      return {
        ...current,
        villages: current.villages.map((item) =>
          item._id === updatedVillage._id
            ? { ...item, ...updatedVillage }
            : item
        ),
        profile: {
          ...current.profile,
          village: {
            ...current.profile.village,
            ...updatedVillage,
          },
        },
      };
    });

    queryClient.setQueryData(["admin-villages"], (current = []) =>
      current.map((item) =>
        item._id === updatedVillage._id
          ? { ...item, ...updatedVillage }
          : item
      )
    );

    queryClient.invalidateQueries({ queryKey: ["villages"] });
    queryClient.invalidateQueries({ queryKey: ["village"] });
    queryClient.invalidateQueries({ queryKey: ["village-profile"] });
    queryClient.invalidateQueries({ queryKey: ["admin-village-locations"] });
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const {
        administrativeDetails,
        ...profileData
      } = formData;

      await Promise.all([
        updateVillageProfile(
          profile._id,
          profileData
        ),
        updateVillage(
          profileData.village,
          administrativeDetails
        ),
      ]);

      alert("Village Profile Updated Successfully.");

      navigate("/admin/village-profiles");
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to update the village profile. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-8 text-center text-red-600">
        Failed to load profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Edit Village Profile
        </h1>

        <p className="text-gray-500">
          Update Village Information.
        </p>
      </div>

      <VillageProfileForm
        initialData={profile}
        villages={villages}
        states={states}
        loading={saving}
        onSubmit={handleSubmit}
        onCoordinateSave={handleCoordinateSave}
      />
    </div>
  );
}
