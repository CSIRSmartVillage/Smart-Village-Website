import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import SupporterForm from "../components/supporters/SupporterForm";
import {
  createSupporter,
} from "../services/supporter.service";

const CreateSupporterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const supporter = await createSupporter(values);

      toast.success("Supporter created successfully.");

      queryClient.invalidateQueries({
        queryKey: ["admin-supporters"],
      });
      queryClient.invalidateQueries({
        queryKey: ["public-supporters"],
      });

      navigate(
        "/admin/supporters/" + supporter._id + "/edit"
      );
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create supporter."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Add Supporter
        </h1>

        <p className="mt-2 text-slate-500">
          Add an NGO or donor to the public Our Supporters page.
        </p>
      </div>

      <SupporterForm
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
};

export default CreateSupporterPage;