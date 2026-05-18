import { axiosAdmin, axiosAuth } from "./api";

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

// Mesas
export const getTables = async (params = {}) => {
    return axiosAdmin.get("/tables/get", { params });
}

export const createTable = async (data) => {
    return await axiosAdmin.post("/tables/create", data);
}

export const updateTable = async (id, data) => {
    return await axiosAdmin.put(`/tables/${id}`, data);
}

export const deactivateTable = async (id) => {
    return await axiosAdmin.put(`/tables/${id}/deactivate`);
}

export const activateTable = async (id) => {
    return await axiosAdmin.put(`/tables/${id}/activate`);
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

export const createEmployee = async (formData) => {
    return await axiosAdmin.post("/employees/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const registerEmployeeInAuth = async (formData) => {
    return await axiosAuth.post("/auth/register-employee", formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const updateEmployee = async (id, data) => {
    return await axiosAdmin.put(`/employees/${id}`, data);
}

export const deleteEmployee = async (id) => {
    return await axiosAdmin.put(`/employees/${id}/status`, { isActive: false });
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
    return await axiosAdmin.put(`/dishes/${id}`, { isActive: false });
}
// Promociones
export const getPromotions = async (params = {}) => {
    return axiosAdmin.get("/promotions/get", { params });
}

export const createPromotion = async (data) => {
    return await axiosAdmin.post("/promotions/create", data);
}

export const updatePromotion = async (id, data) => {
    return await axiosAdmin.put(`/promotions/${id}`, data);
}

export const activatePromotion = async (id) => {
    return await axiosAdmin.put(`/promotions/${id}/activate`);
}

export const deletePromotion = async (id) => {
    return await axiosAdmin.put(`/promotions/${id}/desactivate`); // Desactivado lógico
}

// Notificaciones
export const getNotifications = async () => {
    return axiosAdmin.get("/notifications/");
}

export const markNotificationAsRead = async (id) => {
    return axiosAdmin.put(`/notifications/${id}/read`);
}

export const markAllNotificationsAsRead = async () => {
    return axiosAdmin.put("/notifications/read-all");
}

export const deleteNotification = async (id) => {
    return axiosAdmin.delete(`/notifications/${id}`);
}