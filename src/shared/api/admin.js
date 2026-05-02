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
    return await axiosAdmin.put(`/reservations/${id}`);
}
// EMPLOYEES

export const getEmployees = async () => {
    return axiosAdmin.get("/employees");
}

export const createEmployee = async (data) => {
    return axiosAdmin.post("/employees", data);
}

export const updateEmployee = async (id, data) => {
    return axiosAdmin.put(`/employees/${id}`, data);
}

export const deleteEmployee = async (id) => {
    return axiosAdmin.delete(`/employees/${id}`);
}

// INVENTORY

export const getInventory = async () => {
    return axiosAdmin.get("/inventory");
}

export const createInventory = async (data) => {
    return axiosAdmin.post("/inventory", data);
}

export const updateInventory = async (id, data) => {
    return axiosAdmin.put(`/inventory/${id}`, data);
}

export const deleteInventory = async (id) => {
    return axiosAdmin.delete(`/inventory/${id}`);
}