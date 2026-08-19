import { getUserFriendlyError } from "../../../utils/userFriendlyError";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { eventFormSchema } from "../../validations/eventForm.schema";
import { createEvent } from "../../services/event.service";
import { mapEventFormToPayload } from "../../utils/eventMapper";

import BasicInformationSection from "./sections/BasicInformationSection";
import ContentSection from "./sections/ContentSection";
import PublishSection from "./sections/PublishSection";
import FeaturedImageSection from "./sections/FeaturedImageSection";
import GallerySection from "./sections/GallerySection";
import SeoSection from "./sections/SeoSection";


const defaultValues = {
  title: "",
  type: "",
  village: "",
  eventDate: "",

  status: "UPCOMING",

  category: "",
  organizer: "",
  location: "",

  shortDescription: "",
  description: "",

  isFeatured: false,
  showOnVillageInfo: false,
  highlightOrder: 0,
  published: true,

  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",

  featuredImage: null,
  gallery: [],
};

const EventForm = ({
  defaultValues: formDefaultValues,
  onSubmit: externalSubmit,
  isEdit = false,
}) => {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);

  const methods = useForm({
    resolver: zodResolver(eventFormSchema),
    defaultValues: formDefaultValues || defaultValues,
    mode: "onBlur",
  });
  useEffect(() => {
  if (formDefaultValues) {
    methods.reset(formDefaultValues);
  }
}, [formDefaultValues, methods]);

  const handleCreate = async (formData) => {
    try {
      setSaving(true);

      const payload = mapEventFormToPayload(formData);

      await createEvent(payload);

      toast.success("Event created successfully!");

      methods.reset();

      navigate("/admin/events");
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to save the event. Please try again.")
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(
          externalSubmit || handleCreate
        )}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <BasicInformationSection />

            <ContentSection />

            <FeaturedImageSection />

            <GallerySection />
          </div>

          <div className="space-y-6">
            <PublishSection />

            <SeoSection />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving
              ? isEdit
                ? "Updating Event..."
                : "Creating Event..."
              : isEdit
                ? "Update Event"
                : "Create Event"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EventForm;
