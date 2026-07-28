import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import SelfHelpGroupForm from "../components/selfHelpGroups/SelfHelpGroupForm";

import {
  createSelfHelpGroup,
} from "../services/selfHelpGroup.service";

const CreateSelfHelpGroupPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const group =
        await createSelfHelpGroup(values);

      toast.success(
        "Self Help Group created successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-self-help-groups"],
      });

      navigate(
        `/admin/self-help-groups/${group._id}/edit`
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create Self Help Group."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Create Self Help Group
        </h1>

        <p className="mt-2 text-slate-500">
          Create an SHG entry with leader, members, media and publishing details.
        </p>
      </div>

      <SelfHelpGroupForm
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
};

export default CreateSelfHelpGroupPage;
