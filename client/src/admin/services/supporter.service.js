import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_URL = API + "/supporters/admin";

const authConfig = () => ({
  headers: {
    Authorization:
      "Bearer " + localStorage.getItem("accessToken"),
  },
});

export const getAdminSupporters = async (params = {}) => {
  const response = await axios.get(API_URL, {
    ...authConfig(),
    params,
  });

  return response.data.data;
};

export const getSupporterById = async (id) => {
  const response = await axios.get(
    API_URL + "/" + id,
    authConfig()
  );

  return response.data.data;
};

export const createSupporter = async (payload) => {
  const response = await axios.post(
    API_URL,
    payload,
    authConfig()
  );

  return response.data.data;
};

export const updateSupporter = async (id, payload) => {
  const response = await axios.patch(
    API_URL + "/" + id,
    payload,
    authConfig()
  );

  return response.data.data;
};

export const deleteSupporter = async (id) => {
  const response = await axios.delete(
    API_URL + "/" + id,
    authConfig()
  );

  return response.data.data;
};