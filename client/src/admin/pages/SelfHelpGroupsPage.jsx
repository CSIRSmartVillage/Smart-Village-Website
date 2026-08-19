import { getUserFriendlyError } from "../../utils/userFriendlyError";
import { useMemo, useState } from "react";
import {
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { useDebounce } from "use-debounce";

import ConfirmDialog from "../components/common/ConfirmDialog";
import Pagination from "../components/common/Pagination";
import SelfHelpGroupStats from "../components/selfHelpGroups/SelfHelpGroupStats";
import SelfHelpGroupFilters from "../components/selfHelpGroups/SelfHelpGroupFilters";
import SelfHelpGroupTable from "../components/selfHelpGroups/SelfHelpGroupTable";

import {
  deleteSelfHelpGroup,
  getSelfHelpGroups,
  toggleSelfHelpGroupPublish,
} from "../services/selfHelpGroup.service";

import {
  getAllVillages,
} from "../services/village.service";

const EMPTY_LIST = [];

const SelfHelpGroupsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [published, setPublished] = useState("ALL");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] =
    useState(null);
  const [deleting, setDeleting] = useState(false);
  const [debouncedSearch] = useDebounce(
    search,
    500
  );

  const queryParams = useMemo(() => {
    const params = {
      page,
      limit: 10,
    };

    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    if (village !== "ALL") params.village = village;
    if (status !== "ALL") params.status = status;
    if (published !== "ALL") {
      params.published = published;
    }

    return params;
  }, [
    debouncedSearch,
    village,
    status,
    published,
    page,
  ]);

  const {
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "admin-self-help-groups",
      queryParams,
    ],
    queryFn: async () => {
      const [groupsData, villagesData] =
        await Promise.all([
          getSelfHelpGroups(queryParams),
          getAllVillages(),
        ]);

      return {
        groups: groupsData?.data || EMPTY_LIST,
        pagination: groupsData?.pagination,
        villages: villagesData,
      };
    },
  });

  const groups = data?.groups || EMPTY_LIST;
  const villages = data?.villages || EMPTY_LIST;
  const pagination = data?.pagination
    ? {
        ...data.pagination,
        pages: data.pagination.totalPages,
      }
    : null;

  const resetPage = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleEdit = (id) => {
    navigate(`/admin/self-help-groups/${id}/edit`);
  };

  const handleDelete = (group) => {
    setDeleteTarget(group);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deleteSelfHelpGroup(deleteTarget._id);

      toast.success(
        "Self Help Group deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-self-help-groups"],
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to delete the Self Help Group. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish = async (group) => {
    try {
      await toggleSelfHelpGroupPublish(group._id);

      toast.success(
        "Publish status updated successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-self-help-groups"],
      });
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to update the publication status. Please try again.")
      );
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        Loading Self Help Groups...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Self Help Groups
          </h1>

          <p className="mt-2 text-slate-500">
            Manage village-level SHGs, leaders, members, images and publishing.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/admin/self-help-groups/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add SHG
        </button>
      </div>

      <SelfHelpGroupStats groups={groups} />

      <SelfHelpGroupFilters
        search={search}
        setSearch={resetPage(setSearch)}
        village={village}
        setVillage={resetPage(setVillage)}
        status={status}
        setStatus={resetPage(setStatus)}
        published={published}
        setPublished={resetPage(setPublished)}
        villages={villages}
      />

      <SelfHelpGroupTable
        groups={groups}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />

      <Pagination
        pagination={pagination}
        onPageChange={setPage}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Self Help Group"
        message={`Delete "${deleteTarget?.groupName}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default SelfHelpGroupsPage;
