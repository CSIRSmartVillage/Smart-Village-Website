const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getMonitoringCommittee = async () => {
  const response = await fetch(
    API_BASE_URL + "/monitoring-committee"
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch the Monitoring Committee."
    );
  }

  return Array.isArray(result.data) ? result.data : [];
};

export const getMonitoringCommitteeSettings = async () => {
  const response = await fetch(
    API_BASE_URL + "/monitoring-committee/settings"
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch the Monitoring Committee header."
    );
  }

  return result.data && typeof result.data === "object"
    ? result.data
    : {};
};
