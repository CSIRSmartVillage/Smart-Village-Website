const API = import.meta.env.VITE_API_URL;

export const getPublicGovernmentApprovals = async (
  villageSlug
) => {
  const response = await fetch(
    `${API}/government-approvals/village/${encodeURIComponent(villageSlug)}`,
    {
      cache: "no-store",
    }
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch government approvals."
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
};
