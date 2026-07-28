import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const API_URL = `${API}/self-help-groups/admin`;

const getToken = () =>
  localStorage.getItem("accessToken");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getSelfHelpGroups =
  async (params = {}) => {
    const response = await axios.get(
      API_URL,
      {
        ...authHeaders(),
        params,
      }
    );

    return response.data.data;
  };

export const getSelfHelpGroupById =
  async (id) => {
    const response = await axios.get(
      `${API_URL}/${id}`,
      authHeaders()
    );

    return response.data.data;
  };

export const createSelfHelpGroup =
  async (payload) => {
    const response = await axios.post(
      API_URL,
      payload,
      authHeaders()
    );

    return response.data.data;
  };

export const updateSelfHelpGroup =
  async (id, payload) => {
    const response = await axios.patch(
      `${API_URL}/${id}`,
      payload,
      authHeaders()
    );

    return response.data.data;
  };

export const deleteSelfHelpGroup =
  async (id) => {
    const response = await axios.delete(
      `${API_URL}/${id}`,
      authHeaders()
    );

    return response.data.data;
  };

export const toggleSelfHelpGroupPublish =
  async (id) => {
    const response = await axios.patch(
      `${API_URL}/${id}/publish`,
      {},
      authHeaders()
    );

    return response.data.data;
  };
