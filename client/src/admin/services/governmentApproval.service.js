import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/government-approvals/admin`;

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
});

export const getGovernmentApprovals = async (
  params = {}
) => {
  const response = await axios.get(API_URL, {
    headers: authHeaders(),
    params,
  });

  return response.data.data;
};

export const createGovernmentApproval = async (
  formData
) => {
  const response = await axios.post(
    API_URL,
    formData,
    {
      headers: authHeaders(),
    }
  );

  return response.data.data;
};

export const updateGovernmentApproval = async (
  id,
  payload
) => {
  const response = await axios.patch(
    `${API_URL}/${id}`,
    payload,
    {
      headers: authHeaders(),
    }
  );

  return response.data.data;
};

export const deleteGovernmentApproval = async (
  id
) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    {
      headers: authHeaders(),
    }
  );

  return response.data.data;
};
