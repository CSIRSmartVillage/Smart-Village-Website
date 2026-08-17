export default function AdministrativeDetailsSection({
  details,
  states,
  onChange,
}) {
  const inputClass = "w-full rounded-md border px-3 py-2";

  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-semibold">
        Village Administrative Details
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">
            State
          </label>
          <select
            name="state"
            value={details.state}
            onChange={onChange}
            className={inputClass}
            required
          >
            <option value="">Select State</option>
            {states.map((state) => (
              <option key={state._id} value={state._id}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            District
          </label>
          <input
            type="text"
            name="district"
            value={details.district}
            onChange={onChange}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Block
          </label>
          <input
            type="text"
            name="block"
            value={details.block}
            onChange={onChange}
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Gram Panchayat
          </label>
          <input
            type="text"
            name="gramPanchayat"
            value={details.gramPanchayat}
            onChange={onChange}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}