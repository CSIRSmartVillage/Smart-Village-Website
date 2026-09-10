import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_URL = API + "/monitoring-committee/admin";

const authConfig = () => ({
  headers: {
    Authorization:
      "Bearer " + localStorage.getItem("accessToken"),
  },
});

export const getMonitoringCommitteeMembers = async () => {
  const response = await axios.get(API_URL, authConfig());
  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
};

export const getMonitoringCommitteeSettingsAdmin = async () => {
  const response = await axios.get(
    API_URL + "/settings",
    authConfig()
  );
  return response.data.data || {};
};

export const updateMonitoringCommitteeSettingsAdmin = async (
  subtitle
) => {
  const response = await axios.patch(
    API_URL + "/settings",
    { subtitle },
    authConfig()
  );
  return response.data.data || {};
};

export const createMonitoringCommitteeMember = async (payload) => {
  const response = await axios.post(API_URL, payload, authConfig());
  return response.data.data;
};

export const updateMonitoringCommitteeMember = async (
  id,
  payload
) => {
  const response = await axios.patch(
    API_URL + "/" + id,
    payload,
    authConfig()
  );
  return response.data.data;
};

export const deleteMonitoringCommitteeMember = async (id) => {
  const response = await axios.delete(
    API_URL + "/" + id,
    authConfig()
  );
  return response.data.data;
};

export const reorderMonitoringCommitteeMembers = async (
  role,
  orderedIds
) => {
  const response = await axios.patch(
    API_URL + "/reorder",
    { role, orderedIds },
    authConfig()
  );
  return Array.isArray(response.data.data)
    ? response.data.data
    : [];
};
