import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import VillageLocationForm from "../components/villageLocation/VillageLocationForm";

import {
  createVillageLocation,
} from "../services/villageLocation.service";

const CreateVillageLocationPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    values
  ) => {
    try {
      setLoading(true);

      const location =
        await createVillageLocation(
          values
        );

      alert(
        "Village Location created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: [
          "admin-village-locations",
        ],
      });

      navigate(
        `/admin/village-locations/${location._id}/edit`
      );
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to create the village location. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Create Village Location
        </h1>

        <p className="mt-2 text-slate-500">
          Configure map settings and nearby
          facilities for a village.
        </p>
      </div>

      <VillageLocationForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreateVillageLocationPage;
