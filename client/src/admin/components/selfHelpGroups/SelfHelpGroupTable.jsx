import EmptyState from "./EmptyState";
import SelfHelpGroupTableRow from "./SelfHelpGroupTableRow";

const SelfHelpGroupTable = ({
  groups,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  if (!groups.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Image
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Group
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Village
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Leader
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Members
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {groups.map((group) => (
              <SelfHelpGroupTableRow
                key={group._id}
                group={group}
                onEdit={onEdit}
                onDelete={onDelete}
                onTogglePublish={onTogglePublish}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SelfHelpGroupTable;
