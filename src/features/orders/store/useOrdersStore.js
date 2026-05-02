import { create } from "zustand";
import {
    getOrders as getOrdersRequest,
    createOrder as createOrderRequest,
    updateOrder as updateOrderRequest,
    deleteOrder as deleteOrderRequest
} from "../../../shared/api/orders.js";

export const useOrderStore = create((set, get) => ({
    orders: [],
    loading: false,
    error: null,

    getOrders: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getOrdersRequest();
            console.log(response.data);

            set({
                orders: response.data.orders || response.data.data || response.data,
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
            const response = await createOrderRequest(data);

            set({
                orders: [response.data.order || response.data.data || response.data, ...get().orders],
                loading: false
            });
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
            const response = await updateOrderRequest(id, data); // Llamada a axios

            // Actualizamos el estado local para que la UI cambie al instante
            set((state) => ({
                orders: state.orders.map((order) =>
                    order._id === id ? { ...order, ...response.data.order } : order
                ),
            }));
        } catch (error) {
            console.error("Error en store:", error);
            throw error; // Lanzamos el error para que el catch del componente lo vea
        }
    },

    deleteOrder: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteOrderRequest(id);

            set({
                orders: get().orders.filter(o => o._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar orden."
            });
            throw error;
        }
    }
}));