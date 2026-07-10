import { create } from "zustand";
import {
    getOrders as getOrdersRequest,
    createOrder as createOrderRequest,
    updateOrder as updateOrderRequest,
    deleteOrder as deleteOrderRequest,
    updateOrderStatus as updateOrderStatusRequest
} from "../../../shared/api/orders.js";

export const useOrderStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },

    getOrders: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getOrdersRequest(queryParams);

            set({
                orders: response.data.orders || response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener órdenes",
                loading: false
            });
        }
    },

    createOrder: async (data) => {
        try {
            set({ loading: true, error: null });
            await createOrderRequest(data);

            // Refrescar la lista de órdenes tras crear una nueva
            await get().getOrders();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear orden."
            });
            throw error;
        }
    },

    updateOrder: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateOrderRequest(id, data);

            // Refrescar la lista de órdenes tras actualizar una
            await get().getOrders();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar la orden."
            });
            throw error;
        }
    },

    updateOrderStatus: async (id, data) => {
        try {
            await updateOrderStatusRequest(id, data);

            // Refrescar la lista de órdenes tras cambiar el estado
            await get().getOrders();
        } catch (error) {
            console.error("Error en store status:", error);
            throw error;
        }
    },

    deleteOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteOrderRequest(id);

            // Refrescar la lista de órdenes tras eliminar una
            await get().getOrders();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar orden."
            });
            throw error;
        }
    }
}));