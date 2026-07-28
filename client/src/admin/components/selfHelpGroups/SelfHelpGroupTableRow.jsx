import {
  Edit,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";

const Badge = ({
  children,
  className,
}) => (
  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const SelfHelpGroupTableRow = ({
  group,
  onEdit,
  onDelete,
  onTogglePublish,
}) => {
  const imageUrl = group.featuredImage?.url;

  return (
    <tr className="border-t border-slate-200 hover:bg-slate-50">
      <td className="px-6 py-4">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={group.groupName}
            className="h-14 w-20 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-lg bg-slate-100 text-xs text-slate-400">
            No Image
          </div>
        )}
      </td>

      <td className="px-6 py-4">
        <div>
          <p className="font-semibold text-slate-800">
            {group.groupName}
          </p>
          <p className="mt-1 line-clamp-1 max-w-xs text-sm text-slate-500">
            {group.description}
          </p>
        </div>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {group.village?.name?.en ||
          group.village?.name ||
          "-"}
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        <p className="font-medium text-slate-800">
          {group.leader?.name || "-"}
        </p>
        <p className="text-xs text-slate-500">
          {group.leader?.mobileNumber || "-"}
        </p>
      </td>

      <td className="px-6 py-4 text-sm text-slate-600">
        {group.members?.length || 0}
      </td>

      <td className="px-6 py-4">
        <div className="space-y-2">
          <Badge
            className={
              group.isPublished
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-100 text-slate-600"
            }
          >
            {group.isPublished
              ? "Published"
              : "Unpublished"}
          </Badge>
        </div>
      </td>

      <td className="px-6 py-4 text-center">
        <div className="flex justify-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(group._id)}
            className="rounded-lg bg-yellow-500 p-2 text-white hover:bg-yellow-600"
            title="Edit"
          >
            <Edit size={16} />
          </button>

          <button
            type="button"
            onClick={() => onTogglePublish(group)}
            className="rounded-lg bg-blue-600 p-2 text-white hover:bg-blue-700"
            title={
              group.isPublished
                ? "Unpublish"
                : "Publish"
            }
          >
            {group.isPublished ? (
              <EyeOff size={16} />
            ) : (
              <Eye size={16} />
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(group)}
            className="rounded-lg bg-red-600 p-2 text-white hover:bg-red-700"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SelfHelpGroupTableRow;
