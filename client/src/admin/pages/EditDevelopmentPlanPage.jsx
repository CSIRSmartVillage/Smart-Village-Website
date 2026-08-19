import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  useParams,
} from "react-router-dom";

import DevelopmentPlanForm from "../components/developmentPlan/DevelopmentPlanForm";
import SectorTechnologyManager from "../components/developmentPlan/SectorTechnologyManager";

import {
  getDevelopmentPlanById,
  updateDevelopmentPlan,
} from "../services/developmentPlan.service";

const EditDevelopmentPlanPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);
  const [localPlan, setLocalPlan] = useState(null);

  const {
    data: fetchedPlan,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin-development-plan", id],
    queryFn: () => getDevelopmentPlanById(id),
    enabled: !!id,
  });

  const plan = localPlan || fetchedPlan;

  const handleSubmit = async (
    values
  ) => {
    try {
      setSaving(true);

      const updated = await updateDevelopmentPlan(
        id,
        values
      );

      alert(
        "Development Plan updated successfully."
      );

      setLocalPlan(updated);
      queryClient.setQueryData(
        ["admin-development-plan", id],
        updated
      );
      queryClient.setQueryData(
        ["admin-development-plans"],
        (current) =>
          current
            ? {
                ...current,
                plans: (current.plans || []).map((item) =>
                  item._id === updated._id ? updated : item
                ),
              }
            : current
      );
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to update the development plan. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        Loading...
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex justify-center items-center h-96 text-red-600">
        Unable to load Development Plan.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Edit Development Plan
        </h1>

        <p className="text-slate-500 mt-2">
          Update an existing development plan.
        </p>

      </div>

      <DevelopmentPlanForm
        initialValues={plan}
        onSubmit={handleSubmit}
        loading={saving}
      />

      <div className="mt-8">
        <SectorTechnologyManager
          plan={plan}
          onPlanChange={setLocalPlan}
        />
      </div>

    </div>
  );
};

export default EditDevelopmentPlanPage;
