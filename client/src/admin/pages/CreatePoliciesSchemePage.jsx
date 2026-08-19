import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import PoliciesSchemeForm from "../components/policiesSchemes/PoliciesSchemeForm";

import {
  createPoliciesScheme,
} from "../services/policiesScheme.service";

const CreatePoliciesSchemePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const scheme =
        await createPoliciesScheme(values);

      toast.success(
        "Policy or Scheme created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-policies-schemes"],
      });

      navigate(
        `/admin/policies-schemes/${scheme._id}/edit`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to create the policy or scheme. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Create Policy or Scheme
        </h1>

        <p className="mt-2 text-slate-500">
          Create a village-level central or state government scheme entry.
        </p>
      </div>

      <PoliciesSchemeForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreatePoliciesSchemePage;
