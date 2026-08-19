import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import VillageProfileForm from "../components/villageProfile/VillageProfileForm";

import {
  createVillageProfile,
} from "../services/villageProfile.service";

import {
  getAllVillages,
} from "../services/village.service";

export default function CreateVillageProfilePage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const {
    data: villages = [],
  } = useQuery({
    queryKey: ["admin-villages"],
    queryFn: getAllVillages,
  });

  const handleSubmit = async (formData) => {
    try {
      setLoading(true);

      await createVillageProfile(formData);

      alert("Village Profile Created Successfully.");

      navigate("/admin/village-profiles");
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to create the village profile. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Create Village Profile
        </h1>

        <p className="text-gray-500">
          Add Profile Information for a Village.
        </p>
      </div>

      <VillageProfileForm
        villages={villages}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
