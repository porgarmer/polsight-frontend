import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});


api.interceptors.request.use(
  (config) => {
    // You can attach tokens here later
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const status = error.response?.status;
    const url = originalRequest.url || "";

    // If it's an auth route, do NOT try to refresh, just return the error
    const isAuthRoute =
      url.includes("/api/v1/auth/login") ||
      url.includes("/api/v1/auth/refresh") ||
      url.includes("/api/v1/auth/me");

    if (status === 401 && isAuthRoute) {
      return Promise.reject(error);
    }

    // If already retried, stop.
    if (status === 401 && originalRequest._retry) {
      return Promise.reject(error);
    }

    // Only attempt refresh for non-auth endpoints
    if (status === 401) {
      originalRequest._retry = true;

      try {
        // IMPORTANT: use a raw axios call WITHOUT interceptors
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh/`,
          {},
          { withCredentials: true }
        );

        return api(originalRequest);
      } catch (refreshError) {
        // IMPORTANT: use Next.js router on pages, but interceptor doesn't have it.
        // If you want, remove redirect entirely and let pages handle it.
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
