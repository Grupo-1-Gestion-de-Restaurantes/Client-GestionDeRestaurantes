import { axiosAdmin } from "./api";

export const getReservations = async () => {
    return axiosAdmin.get("/reservations/get");
}

export const createReservation = async (data) => {
    return await axiosAdmin.post("/reservations/create", data);
}

export const updateReservation = async (id, data) => {
    return await axiosAdmin.put(`/reservations/${id}`, data);
}

export const deleteReservation = async (id) => {
    return await axiosAdmin.put(`/reservations/${id}/deactivate`);
}

export const getMyInvoices = async () => {
    return axiosAdmin.get("/invoices/myInvoices");
}

export const getEmployee = async () => {
    return axiosAdmin.get("/employees/get");
}

export const createEmployee = async (data) => {
    return await axiosAdmin.post("/employees/create", data);
}

export const updateEmployee = async (id, data) => {
    return await axiosAdmin.put(`/employees/${id}`, data);
}

export const deleteEmployee = async (id) => {
    return await axiosAdmin.put(`/employees/${id}/deactivate`);
}

export const getInventories = async () => {
    return axiosAdmin.get("/inventories/get");
}

export const createInventory = async (data) => {
    return await axiosAdmin.post("/inventories/create", data);
}

export const updateInventory = async (id, data) => {
    return await axiosAdmin.put(`/inventories/${id}`, data);
}

export const deleteInventory = async (id) => {
    return await axiosAdmin.put(`/inventories/${id}/deactivate`);
}