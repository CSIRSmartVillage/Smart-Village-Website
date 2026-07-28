import axios from "axios";

const API = import.meta.env.VITE_API_URL;

/*
=====================================================
SMART VILLAGE NAVIGATION
=====================================================
*/

/**
 * Get all published villages
 */
export const getVillages = async () => {
  const response = await axios.get(
    `${API}/villages/public`
  );

  return response.data.data;
};

/**
 * Get villages by state
 * Used in Navbar Mega Menu
 */
export const getVillagesByState = async (
  stateSlug
) => {
  const response = await axios.get(
    `${API}/villages/public/state/${stateSlug}`
  );

  return response.data.data;
};

/**
 * Get village by slug
 */
export const getVillageBySlug = async (
  slug
) => {
  const response = await axios.get(
    `${API}/villages/slug/${slug}`
  );

  return response.data.data;
};

/*
=====================================================
VILLAGE PROFILE
=====================================================
*/

export const getVillageProfile = async (
  slug
) => {
  const response = await axios.get(
    `${API}/village-profiles/slug/${slug}`
  );

  return response.data.data;
};

/*
=====================================================
FUTURE MODULES
=====================================================
*/

export const getVillageStatistics =
  async (slug) => {
    const response = await axios.get(
      `${API}/village-statistics/slug/${slug}`
    );

    return response.data.data;
  };

export const getVillageVDI =
  async (slug) => {
    const response = await axios.get(
      `${API}/village-vdi/slug/${slug}`
    );

    return response.data.data;
  };

export const getDevelopmentPlan =
  async (slug) => {
    const response = await axios.get(
      `${API}/development-plans/slug/${slug}`
    );

    return response.data.data;
  };

export const getVillageEvents =
  async (slug) => {
    const response = await axios.get(
      `${API}/events/slug/${slug}`
    );

    return response.data.data;
  };

export const getVillageMap =
  async (slug) => {
    const response = await axios.get(
      `${API}/village-map/slug/${slug}`
    );

    return response.data.data;
  };

export const getPoliciesSchemesByVillage =
  async (slug) => {
    const response = await axios.get(
      `${API}/policies-schemes/village/${slug}`
    );

    return response.data.data;
  };

export const getPoliciesSchemeBySlug =
  async (slug) => {
    const response = await axios.get(
      `${API}/policies-schemes/${slug}`
    );

    return response.data.data;
  };

export const getSelfHelpGroupsByVillage =
  async (slug, params = {}) => {
    const response = await axios.get(
      `${API}/self-help-groups/village/${slug}`,
      {
        params,
      }
    );

    return response.data.data;
  };

export const getSelfHelpGroupBySlug =
  async (slug) => {
    const response = await axios.get(
      `${API}/self-help-groups/slug/${slug}`
    );

    return response.data.data;
  };
