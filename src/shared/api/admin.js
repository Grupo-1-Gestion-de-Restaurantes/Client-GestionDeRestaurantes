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

// Comentarios
export const getComments = async () => {
    return axiosAdmin.get("/comments/");
}

export const deleteComment = async (id) => {
    return await axiosAdmin.put(`/comments/desactivate/${id}`);
}

//Restaurantes  
export const getRestaurants = async () => {
    return axiosAdmin.get("/restaurants/get");
}

export const createRestaurant = async (data) => {
    return await axiosAdmin.post("/restaurants/create", data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const updateRestaurant = async (id, data) => {
    return await axiosAdmin.put(`/restaurants/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

export const deleteRestaurant = async (id) => {
    return await axiosAdmin.delete(`/restaurants/${id}`)
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
// Platillos
export const getDishes = async () => {
    return axiosAdmin.get("/dishes/");
}

export const createDish = async (data) => {
    return await axiosAdmin.post("/dishes/", data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const updateDish = async (id, data) => {
    return await axiosAdmin.put(`/dishes/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" }
    });
}

export const deleteDish = async (id) => {
    console.log("🛠️ [API] Intentando eliminar platillo con ID:", id);

    const response = await axiosAdmin.patch(`/dishes/${id}`, { isActive: false });

    console.log("✅ [API] Respuesta del servidor al eliminar:", response.data);
    return response;
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