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
import PoliciesSchemeStats from "../components/policiesSchemes/PoliciesSchemeStats";
import PoliciesSchemeFilters from "../components/policiesSchemes/PoliciesSchemeFilters";
import PoliciesSchemeTable from "../components/policiesSchemes/PoliciesSchemeTable";

import {
  deletePoliciesScheme,
  getPoliciesSchemes,
  updatePoliciesScheme,
} from "../services/policiesScheme.service";

import {
  getAllVillages,
} from "../services/village.service";

const EMPTY_LIST = [];

const PoliciesSchemesPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("ALL");
  const [category, setCategory] = useState("ALL");
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
    if (category !== "ALL") params.category = category;
    if (published !== "ALL") {
      params.published = published;
    }

    return params;
  }, [
    debouncedSearch,
    village,
    category,
    published,
    page,
  ]);

  const {
    data,
    isLoading: loading,
  } = useQuery({
    queryKey: [
      "admin-policies-schemes",
      queryParams,
    ],
    queryFn: async () => {
      const [schemesData, villagesData] =
        await Promise.all([
          getPoliciesSchemes(queryParams),
          getAllVillages(),
        ]);

      return {
        schemes: schemesData?.data || EMPTY_LIST,
        pagination: schemesData?.pagination,
        villages: villagesData,
      };
    },
  });

  const schemes = data?.schemes || EMPTY_LIST;
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
    navigate(`/admin/policies-schemes/${id}/edit`);
  };

  const handleDelete = (scheme) => {
    setDeleteTarget(scheme);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleting(true);

      await deletePoliciesScheme(deleteTarget._id);

      toast.success(
        "Policy or Scheme deleted successfully."
      );

      queryClient.invalidateQueries({
        queryKey: ["admin-policies-schemes"],
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error(error);

      toast.error(
        getUserFriendlyError(error, "Unable to delete the policy or scheme. Please try again.")
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleTogglePublish =
    async (scheme) => {
      try {
        await updatePoliciesScheme(
          scheme._id,
          {
            published: !scheme.published,
          }
        );

        toast.success(
          "Publish status updated successfully."
        );

        queryClient.invalidateQueries({
          queryKey: ["admin-policies-schemes"],
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
        Loading Policies & Schemes...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            Policies & Schemes
          </h1>

          <p className="mt-2 text-slate-500">
            Manage central and state government schemes for villages.
          </p>
        </div>

        <button
          onClick={() =>
            navigate(
              "/admin/policies-schemes/create"
            )
          }
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Policy or Scheme
        </button>
      </div>

      <PoliciesSchemeStats schemes={schemes} />

      <PoliciesSchemeFilters
        search={search}
        setSearch={resetPage(setSearch)}
        village={village}
        setVillage={resetPage(setVillage)}
        category={category}
        setCategory={resetPage(setCategory)}
        published={published}
        setPublished={resetPage(setPublished)}
        villages={villages}
      />

      <PoliciesSchemeTable
        schemes={schemes}
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
        title="Delete Policy or Scheme"
        message={`Delete "${deleteTarget?.schemeName}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleting}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default PoliciesSchemesPage;
