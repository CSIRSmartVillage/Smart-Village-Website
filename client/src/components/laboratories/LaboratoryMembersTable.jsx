const getPhotoUrl = (photo) => {
  if (!photo) {
    return "";
  }

  if (typeof photo === "string") {
    return photo.startsWith("http")
      ? photo
      : "";
  }

  return photo.url || photo.secureUrl || "";
};

const LaboratoryMembersTable = ({
  members = [],
}) => {
  if (!Array.isArray(members) || members.length === 0) {
    return null;
  }

  return (
    <section className="mb-12">
      <h2 className="mb-4 text-3xl font-bold">
        Members
      </h2>

      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
        <table className="w-full min-w-[820px] border-collapse bg-white text-left">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="px-4 py-3 font-semibold">
                Photo
              </th>
              <th className="px-4 py-3 font-semibold">
                Name
              </th>
              <th className="px-4 py-3 font-semibold">
                Designation
              </th>
              <th className="px-4 py-3 font-semibold">
                Phone Number
              </th>
              <th className="px-4 py-3 font-semibold">
                Email
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {members.map((member, index) => {
              const photoUrl = getPhotoUrl(
                member.photo
              );

              return (
                <tr
                  key={member._id || index}
                  className="align-middle text-slate-700"
                >
                  <td className="w-28 px-4 py-3">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={member.name || ""}
                        className="h-20 w-20 rounded-lg border border-slate-200 bg-white object-contain"
                      />
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {member.name || ""}
                  </td>
                  <td className="px-4 py-3">
                    {member.designation || ""}
                  </td>
                  <td className="px-4 py-3">
                    {member.phone || ""}
                  </td>
                  <td className="px-4 py-3">
                    {member.email || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default LaboratoryMembersTable;
