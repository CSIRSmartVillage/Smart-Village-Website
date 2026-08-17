import axios from "axios";

const API = import.meta.env.VITE_API_URL;

export const getSurveyOptions = async (stateId, villageId) => {
  const response = await axios.get(
    `${API}/states/${stateId}/villages/${villageId}/survey-options`
  );
  return response.data.data;
};

export const getSurvey = async (stateId, villageId, surveyId) => {
  const response = await axios.get(
    `${API}/states/${stateId}/villages/${villageId}/surveys/by-id/${surveyId}`
  );
  return response.data.data;
};
