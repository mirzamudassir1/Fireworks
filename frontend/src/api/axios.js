import axios from "axios";

const api = axios.create({
  baseURL: "https://fireworks-oxud.onrender.com",
});

// Attach the saved token to every request automatically, if one exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;