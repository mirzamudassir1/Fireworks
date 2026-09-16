import api from "./axios";

export const updateCredentials = (data) => api.put("/auth/update-credentials", data);