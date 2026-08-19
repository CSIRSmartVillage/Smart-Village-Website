import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

import SupporterForm from "../components/supporters/SupporterForm";

import {
  getSupporterById,
  updateSupporter,
} from "../services/supporter.service";

const EditSupporterPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const {
    data: supporter,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["admin-supporter", id],
    queryFn: () => getSupporterById(id),
    enabled: !!id,
  });

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const updated = await updateSupporter(id, values);

      toast.success("Supporter updated successfully.");

      queryClient.setQueryData(
        ["admin-supporter", id],
        updated
      );
      queryClient.invalidateQueries({
        queryKey: ["admin-supporters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-supporters"],
      });
    } catch (error) {
      console.error(error);
      toast.error(
        getUserFriendlyError(error, "Unable to update the supporter. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center text-slate-500">
        Loading supporter...
      </div>
    );
  }

  if (isError || !supporter) {
    return (
      <div className="flex h-96 items-center justify-center text-red-600">
        Unable to load supporter.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Edit Supporter
        </h1>

        <p className="mt-2 text-slate-500">
          Update the supporter information shown publicly.
        </p>
      </div>

      <SupporterForm
        initialValues={supporter}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};

export default EditSupporterPage;
