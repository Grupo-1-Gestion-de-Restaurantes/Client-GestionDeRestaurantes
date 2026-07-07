import { axiosAdmin } from "./api";

export const getOrders = async (params = {}) => {
    return axiosAdmin.get("/orders/get", { params });
}

export const createOrder = async (data) => {
    return await axiosAdmin.post("/orders/create-admin", data);
}

export const updateOrder = async (id, data) => {
    return await axiosAdmin.put(`/orders/update-admin/${id}`, data);
}

export const updateOrderStatus = async (id, data) => {
    return await axiosAdmin.put(`/orders/${id}/status`, data);
}

export const deleteOrder = async (id) => {
    return await axiosAdmin.put(`/orders/delete/${id}`);
}