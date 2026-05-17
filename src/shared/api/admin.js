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

//Clientes
export const getClients = async () => {
    return axiosAdmin.get("/clients/get");
}

export const createClient = async (data) => {
    return await axiosAdmin.post("/clients/create", data);
}

export const updateClient = async (data) => {
    return await axiosAdmin.put("/clients/update", data);
}

export const deleteClient = async (id) => {
    return await axiosAdmin.put(`/clients/${id}/deactivate`);
}

//Facturas
export const getMyInvoices = async () => {
    return axiosAdmin.get("/invoices/myInvoices");
}

// Comentarios
export const getComments = async () => {
    return axiosAdmin.get("/comments/");
}

export const deleteComment = async (id) => {
    return await axiosAdmin.put(`/comments/desactivate/${id}`);
}


//Restaurantes  
export const getRestaurants = async (params = {}) => {
    return axiosAdmin.get("/restaurants/get", { params });
}

export const createRestaurant = async (data) => {
    // Do not set Content-Type manually when sending FormData.
    // Let the browser/axios set the proper boundary header.
    return await axiosAdmin.post("/restaurants/create", data)
}

export const updateRestaurant = async (id, data) => {
    // Do not set Content-Type manually when sending FormData.
    return await axiosAdmin.put(`/restaurants/${id}`, data)
}

export const deactivateRestaurant = async (id) => {
    return await axiosAdmin.put(`/restaurants/${id}/deactivate`)
}

export const activateRestaurant = async (id) => {
    return await axiosAdmin.put(`/restaurants/${id}/activate`)
}

//Empleados
export const getEmployees = async () => {
    return axiosAdmin.get("/employees/");
}

export const createEmployee = async (data) => {
    return await axiosAdmin.post("/employees/", data);
}

export const updateEmployee = async (id, data) => {
    return await axiosAdmin.put(`/employees/${id}`, data);
}

export const deleteEmployee = async (id) => {
    return await axiosAdmin.put(`/employees/${id}/deactivate`);
}

//Inventarios
export const getInventories = async () => {
    return axiosAdmin.get("/inventories/");
}

export const createInventory = async (data) => {
    return await axiosAdmin.post("/inventories/", data);
}

export const updateInventory = async (id, data) => {
    return await axiosAdmin.put(`/inventories/${id}`, data);
}

export const deleteInventory = async (id) => {
    return await axiosAdmin.put(`/inventories/${id}/status`, { isActive: false });
}

// Platillos
export const getDishes = async () => {
    return axiosAdmin.get("/dishes/");
}

export const createDish = async (formData) => {
    return await axiosAdmin.post("/dishes/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const updateDish = async (id, formData) => {
    return await axiosAdmin.put(`/dishes/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const deleteDish = async (id) => {
    return await axiosAdmin.put(`/dishes/${id}`);
}
// Promociones
export const getPromotions = async () => {
    return axiosAdmin.get("/promotions/get");
}

export const createPromotion = async (data) => {
    return await axiosAdmin.post("/promotions/create", data);
}

export const updatePromotion = async (id, data) => {
    return await axiosAdmin.put(`/promotions/${id}`, data);
}

export const deletePromotion = async (id) => {
    return await axiosAdmin.put(`/promotions/${id}/desactivate`); // Desactivado lógico
}