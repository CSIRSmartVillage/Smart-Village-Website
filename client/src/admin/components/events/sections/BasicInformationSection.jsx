import useVillages from "../../../../hooks/useVillages";

import InputField from "../../common/form/InputField";
import SelectField from "../../common/form/SelectField";

const BasicInformationSection = () => {
  const { villages } = useVillages();


  const villageOptions = villages.map((village) => ({
    value: village._id,
    label: village.name?.en,
  }));


  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Enter the basic details of the event.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

        <div className="md:col-span-2">
          <InputField
            name="title"
            label="Event Title"
            placeholder="Enter event title"
            required
          />
        </div>

        <SelectField
          name="type"
          label="Event Type"
          placeholder="Select Event Type"
          required
          options={[
            {
              label: "Event",
              value: "EVENT",
            },
            {
              label: "Achievement",
              value: "ACHIEVEMENT",
            },
            {
              label: "Visit",
              value: "VISIT",
            },
          ]}
        />

        <SelectField
          name="village"
          label="Village"
          placeholder="Select Village"
          required
          options={villageOptions}
        />

        <InputField
          name="eventDate"
          label="Event Date"
          type="date"
          required
        />

        <SelectField
          name="status"
          label="Status"
          options={[
            {
              label: "Upcoming",
              value: "UPCOMING",
            },
            {
              label: "Ongoing",
              value: "ONGOING",
            },
            {
              label: "Completed",
              value: "COMPLETED",
            },
          ]}
        />

        <InputField
          name="category"
          label="Category"
          placeholder="Health, Education..."
        />

        <InputField
          name="organizer"
          label="Organizer"
          placeholder="Organizer name"
        />

        <div className="md:col-span-2">
          <InputField
            name="location"
            label="Location"
            placeholder="Enter event location"
          />
        </div>

      </div>
    </div>
  );
};

export default BasicInformationSection;