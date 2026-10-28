import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getTrainingManuals = async () =>
  (await axios.get(`${API}/training-manuals`)).data.data;

export const getTrainingManual = async (id) =>
  (await axios.get(`${API}/training-manuals/${id}`)).data.data;
