import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import SelfHelpGroupForm from "../components/selfHelpGroups/SelfHelpGroupForm";

import {
  getSelfHelpGroupById,
  updateSelfHelpGroup,
} from "../services/selfHelpGroup.service";

const EditSelfHelpGroupPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  const [saving, setSaving] = useState(false);

  const {
    data: group,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["admin-self-help-group", id],
    queryFn: () => getSelfHelpGroupById(id),
    enabled: !!id,
  });

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const updated =
        await updateSelfHelpGroup(id, values);

      toast.success(
        "Self Help Group updated successfully."
      );

      queryClient.setQueryData(
        ["admin-self-help-group", id],
        updated
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-self-help-groups"],
      });
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to update the Self Help Group. Please try again.")
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

  if (error || !group) {
    return (
      <div className="flex h-96 items-center justify-center text-red-600">
        Unable to load Self Help Group.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Edit Self Help Group
        </h1>

        <p className="mt-2 text-slate-500">
          Update SHG information, leader, members, media and publishing details.
        </p>
      </div>

      <SelfHelpGroupForm
        initialValues={group}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};

export default EditSelfHelpGroupPage;
