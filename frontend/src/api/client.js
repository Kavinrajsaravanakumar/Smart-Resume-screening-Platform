import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "https://d2qqrv66fla67.cloudfront.net/",
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("hrToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
