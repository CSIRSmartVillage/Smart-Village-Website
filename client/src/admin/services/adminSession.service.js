import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_URL}/auth`;
const LOGIN_PATH = "/admin/login";

let refreshRequest = null;
let responseInterceptorId = null;

export const clearAdminSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("admin");
};

const refreshAccessToken = async () => {
  if (!refreshRequest) {
    refreshRequest = axios
      .post(
        `${API_URL}/refresh`,
        {},
        {
          withCredentials: true,
          _skipAdminSessionRefresh: true,
        }
      )
      .then((response) => {
        const accessToken = response.data?.data?.accessToken;

        if (!accessToken) {
          throw new Error("The server did not return a refreshed access token.");
        }

        localStorage.setItem("accessToken", accessToken);
        return accessToken;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
};

const isLoginRequest = (config) =>
  String(config?.url || "").includes(`${API_URL}/login`);

export const startAdminSessionHandling = () => {
  if (responseInterceptorId !== null) {
    return;
  }

  responseInterceptorId = axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const request = error.config;
      const isAdminPage = window.location.pathname.startsWith("/admin");
      const canRefresh =
        isAdminPage &&
        error.response?.status === 401 &&
        localStorage.getItem("accessToken") &&
        request &&
        !request._adminSessionRetry &&
        !request._skipAdminSessionRefresh &&
        !isLoginRequest(request);

      if (!canRefresh) {
        return Promise.reject(error);
      }

      request._adminSessionRetry = true;

      try {
        const accessToken = await refreshAccessToken();

        request.headers = request.headers || {};
        request.headers.Authorization = `Bearer ${accessToken}`;
        request.withCredentials = true;

        return axios(request);
      } catch (refreshError) {
        clearAdminSession();

        if (window.location.pathname !== LOGIN_PATH) {
          window.location.replace(`${LOGIN_PATH}?session=expired`);
        }

        return Promise.reject(refreshError);
      }
    }
  );
};
