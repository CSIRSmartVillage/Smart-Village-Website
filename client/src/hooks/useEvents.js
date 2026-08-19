import { useCallback, useEffect, useState, useMemo } from "react";

import * as eventService from "../admin/services/event.service";
import { useDebounce } from "use-debounce";
import { getUserFriendlyError } from "../utils/userFriendlyError";

const useEvents = (initialFilters = {}) => {
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
    village: "",
    type: "",
    status: "",
    ...initialFilters,
  });
  

  /* ======================================================
      Filters
  ====================================================== */

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      page: 1,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      village: "",
      type: "",
      status: "",
    });
  }, []);

  const handlePageChange = useCallback((page) => {
  setFilters((prev) => ({
    ...prev,
    page,
  }));
}, []);

const [debouncedSearch] = useDebounce(
  filters.search,
  500
);

const requestFilters = useMemo(
  () => ({
    page: filters.page,
    limit: filters.limit,
    village: filters.village,
    type: filters.type,
    status: filters.status,
    search: debouncedSearch,
  }),
  [
    filters.page,
    filters.limit,
    filters.village,
    filters.type,
    filters.status,
    debouncedSearch,
  ]
);

  /* ======================================================
      Fetch Events
  ====================================================== */

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

const response =
  await eventService.getAllEvents(requestFilters);

      setEvents(response.data?.data || []);
      setPagination(response.data?.pagination || null);
    } catch (err) {
      console.error(err);

      setError(
        getUserFriendlyError(err, "Unable to load events. Please refresh the page.")
      );
    } finally {
      setLoading(false);
    }
  }, [requestFilters]);

  /* ======================================================
      Delete
  ====================================================== */

  const handleDelete = useCallback(
    async (id) => {
      try {
        await eventService.deleteEvent(id);

        await fetchEvents();

        return {
          success: true,
          message: "Event deleted successfully.",
        };
      } catch (error) {
        console.error(error);

        return {
          success: false,
          message:
            getUserFriendlyError(error, "Unable to delete the event. Please try again."),
        };
      }
    },
    [fetchEvents]
  );

  /* ======================================================
      Publish
  ====================================================== */

  const handlePublish = useCallback(
    async (id, published) => {
      try {
        await eventService.togglePublishEvent(
          id,
          published
        );

        await fetchEvents();

        return {
          success: true,
          message: published
            ? "Event published successfully."
            : "Event unpublished successfully.",
        };
      } catch (error) {
        console.error(error);

        return {
          success: false,
          message:
            getUserFriendlyError(error, "Unable to update the publication status. Please try again."),
        };
      }
    },
    [fetchEvents]
  );

  /* ======================================================
      Feature
  ====================================================== */

  const handleFeature = useCallback(
    async (id, featured) => {
      try {
        await eventService.toggleFeaturedEvent(
          id,
          featured
        );

        await fetchEvents();

        return {
          success: true,
          message: featured
            ? "Event marked as featured."
            : "Event removed from featured.",
        };
      } catch (error) {
        console.error(error);

        return {
          success: false,
          message:
            getUserFriendlyError(error, "Unable to update the featured status. Please try again."),
        };
      }
    },
    [fetchEvents]
  );

  /* ======================================================
      Effects
  ====================================================== */

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  /* ======================================================
      Exports
  ====================================================== */

  return {
    events,
    pagination,

    loading,
    error,

    filters,

    updateFilter,
    resetFilters,
    handlePageChange,

    refresh: fetchEvents,

    handleDelete,
    handlePublish,
    handleFeature,
  };
};

export default useEvents;