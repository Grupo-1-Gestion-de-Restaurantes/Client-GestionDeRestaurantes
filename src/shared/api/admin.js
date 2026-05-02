import { axiosAdmin } from "./api";

//Reservaciones
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

//Facturas
export const getMyInvoices = async () => {
    return axiosAdmin.get("/invoices/myInvoices");
}

//Restaurantes  
export const getRestaurants = async () => {
    return axiosAdmin.get("/restaurants");
}

export const createRestaurant = async (data) => {
    return await axiosAdmin.post("/restaurants", data, {
        headers: { "Content-Type": "multipart/form-data"}
    })
}

export const updateRestaurant = async (id, data) => {
    return await axiosAdmin.put(`/restaurants/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data"}
    })
}

export const deleteRestaurant = async (id) => {
    return await axiosAdmin.delete(`/restaurants/${id}`)
}