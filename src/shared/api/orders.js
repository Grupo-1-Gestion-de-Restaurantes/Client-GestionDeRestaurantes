import { axiosAdmin } from "./api";

export const getOrders = async () => {
    return axiosAdmin.get("/orders/get");
}

export const createOrder = async (data) => {
    return await axiosAdmin.post("/orders/create-admin", data);
}

export const updateOrder = async (id, data) => {
    return await axiosAdmin.put(`/orders/${id}/status`, data);
}

export const deleteOrder = async (id) => {
    return await axiosAdmin.put(`/orders/delete/${id}`);
}