import axios from "axios";

const API = import.meta.env.VITE_API_URL;
const API_URL = `${API}/events`;

const getToken = () => localStorage.getItem("accessToken");

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

/* =====================================================
   GET ALL EVENTS
===================================================== */

export const getAllEvents = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );

  const response = await axios.get(`${API_URL}/admin/list`, {
    ...authHeaders(),
    params: cleanParams,
  });

  return response.data;
};

/* =====================================================
   GET EVENT BY ID
===================================================== */

export const getEventById = async (id) => {
  const response = await axios.get(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   CREATE EVENT
===================================================== */

export const createEvent = async (payload) => {
  const response = await axios.post(
    API_URL,
    payload,
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   UPDATE EVENT
===================================================== */

export const updateEvent = async (
  id,
  payload
) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    payload,
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   DELETE EVENT
===================================================== */

export const deleteEvent = async (id) => {
  const response = await axios.delete(
    `${API_URL}/${id}`,
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   PUBLISH / UNPUBLISH EVENT
===================================================== */

export const togglePublishEvent = async (
  id,
  published
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/publish`,
    { published },
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   FEATURE / UNFEATURE EVENT
===================================================== */

export const toggleFeaturedEvent = async (
  id,
  isFeatured
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/feature`,
    { isFeatured },
    authHeaders()
  );

  return response.data.data;
};

/* =====================================================
   GET EVENT BY SLUG
===================================================== */

export const getEventBySlug = async (slug) => {
  const response = await axios.get(
    `${API_URL}/slug/${slug}`
  );

  return response.data.data;
};
/* =====================================================
   ADMIN NEWS: EVENT-BACKED ITEMS
===================================================== */

export const getAdminNewsItems = async () => {
  const response = await axios.get(
    `${API_URL}/admin/news-items`,
    authHeaders()
  );

  return response.data.data;
};

export const toggleHomePageFeature = async (
  id,
  featureOnHomePage
) => {
  const response = await axios.patch(
    `${API_URL}/${id}/home-page-feature`,
    { featureOnHomePage },
    authHeaders()
  );

  return response.data.data;
};
