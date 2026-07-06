import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const isAtLoginPage =
      typeof window !== "undefined" &&
      (window.location.pathname === "/login" || window.location.pathname === "/auth/login");

    if (isAtLoginPage) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("permissions");
      window.location.href = "/login?reason=expired";
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("api-forbidden")); 
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;