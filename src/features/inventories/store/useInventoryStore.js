import { create } from "zustand";
import {
    getInventories as getInventoriesRequest,
    createInventory as createInventoryRequest,
    updateInventory as updateInventoryRequest,
    deleteInventory as deleteInventoryRequest
} from "../../../shared/api/";

export const useInventoryStore = create((set, get) => ({
    inventories: [],
    loading: false,
    error: null,

    getInventories: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getInventoriesRequest();

            set({
                inventories: response.data.data || response.data,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener el inventario",
                loading: false
            });
        }
    },

    createInventory: async (data) => {
        try {
            set({ loading: true, error: null });
            const response = await createInventoryRequest(data);

            set({
                inventories: [response.data.data || response.data, ...get().inventories],
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear el inventario."
            });
            throw error;
        }
    },

    updateInventory: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateInventoryRequest(id, data);
            const updated = response.data.data || response.data;

            set({
                inventories: get().inventories.map((i) =>
                    i._id === id ? updated : i
                ),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el ingrediente."
            });
            throw error;
        }
    },

    deleteInventory: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteInventoryRequest(id);

            set({
                inventories: get().inventories.filter(i => i._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el inventario."
            });
            throw error;
        }
    }
}));