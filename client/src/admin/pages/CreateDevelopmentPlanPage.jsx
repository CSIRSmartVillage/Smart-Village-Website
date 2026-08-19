import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import DevelopmentPlanForm from "../components/developmentPlan/DevelopmentPlanForm";

import {
  createDevelopmentPlan,
} from "../services/developmentPlan.service";

const CreateDevelopmentPlanPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] =
    useState(false);

  const handleSubmit = async (
    values
  ) => {
    try {
      setLoading(true);

      const plan = await createDevelopmentPlan(
        values
      );

      alert(
        "Development Plan created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-development-plans"],
      });

      navigate(
        `/admin/development-plans/${plan._id}/edit`
      );
    } catch (error) {
      console.error(error);

      alert(
        getUserFriendlyError(error, "Unable to create the development plan. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-slate-800">
          Create Development Plan
        </h1>

        <p className="text-slate-500 mt-2">
          Create the village-level CSIR technology deployment plan.
        </p>

      </div>

      <DevelopmentPlanForm
        onSubmit={handleSubmit}
        loading={loading}
      />

    </div>
  );
};

export default CreateDevelopmentPlanPage;
