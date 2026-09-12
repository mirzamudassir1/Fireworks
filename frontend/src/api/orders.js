import api from "./axios";

export const createOrder = (data) => api.post("/orders/", data);
export const getOrders = () => api.get("/orders/");
export const deleteOrder = (id) => api.delete(`/orders/${id}`);
import Footer from "../components/Footer";