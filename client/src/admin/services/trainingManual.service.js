import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/training-manuals/admin`;
const config = (onUploadProgress) => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  onUploadProgress,
});

export const getAdminTrainingManuals = async () => (await axios.get(`${API_URL}/all`, config())).data.data;
export const createTrainingManual = async (data, onUploadProgress) => (await axios.post(API_URL, data, config(onUploadProgress))).data.data;
export const updateTrainingManual = async (id, data, onUploadProgress) => (await axios.patch(`${API_URL}/${id}`, data, config(onUploadProgress))).data.data;
export const deleteTrainingManual = async (id) => (await axios.delete(`${API_URL}/${id}`, config())).data.data;
export const deleteTrainingManualFile = async (id, fileId) => (await axios.delete(`${API_URL}/${id}/files/${fileId}`, config())).data.data;
