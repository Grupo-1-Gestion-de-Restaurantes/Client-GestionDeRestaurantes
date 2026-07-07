import { axiosAdmin, axiosAuth } from "./api";

//Reservaciones
export const getReservations = async (params = {}) => {
    return axiosAdmin.get("/reservations/get", { params });
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
export const getClients = async (params = {}) => {
    return axiosAdmin.get("/clients/get", { params });
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

export const activateClient = async (id) => {
    return await axiosAdmin.put(`/clients/${id}/activate`);
}

//Facturas
export const getMyInvoices = async (params = {}) => {
    return axiosAdmin.get("/invoices/myInvoices", { params });
}

// Comentarios
export const getComments = async (params = {}) => {
    return axiosAdmin.get("/comments/", { params });
}

export const deleteComment = async (id) => {
    return await axiosAdmin.put(`/comments/deactivate/${id}`);
}

export const activateComment = async (id) => {
    return await axiosAdmin.put(`/comments/activate/${id}`);
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
export const getEmployees = async (params = {}) => {
    return axiosAdmin.get("/employees/", { params });
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

export const activateEmployee = async (id) => {
    return await axiosAdmin.put(`/employees/${id}/status`, { isActive: true });
}

//Inventarios
export const getInventories = async (params = {}) => {
    return axiosAdmin.get("/inventories/", { params });
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
export const getDishes = async (params = {}) => {
    return axiosAdmin.get("/dishes/", { params });
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

// Partner Leads
export const getPartnerLeads = async (params = {}) => {
    return axiosAdmin.get("/partners/leads", { params });
}

export const updatePartnerLeadStatus = async (id, status) => {
    return axiosAdmin.put(`/partners/leads/${id}/status`, { status });
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
    return await axiosAdmin.put(`/promotions/${id}/deactivate`); // Desactivado lógico
}

// Notificaciones
export const getNotifications = async (params = {}) => {
    return axiosAdmin.get("/notifications/", { params });
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

//Eventos
export const getEvents = async (params = {}) => {
    return axiosAdmin.get("/events/", { params });
};

export const createEvent = async (data) => {
    return await axiosAdmin.post("/events/", data); 
};

export const updateEvent = async (id, data) => {
    return await axiosAdmin.put(`/events/${id}`, data);
};

export const deleteEvent = async (id) => {
    return await axiosAdmin.patch(`/events/${id}`, { isActive: false });
};
