const API_BASE_URL = import.meta.env.VITE_API_URL;

export const getSupporters = async () => {
  const response = await fetch(
    API_BASE_URL + "/supporters"
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Failed to fetch supporters."
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
};

export const getSupporterLogos = async () => {
  const response = await fetch(
    API_BASE_URL + "/supporters/logos",
    {
      cache: "no-store",
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Failed to fetch supporter logos."
    );
  }

  return Array.isArray(result.data)
    ? result.data
    : [];
};
