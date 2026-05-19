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
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },

    getInventories: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getInventoriesRequest(queryParams);

            set({
                inventories: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
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
            await createInventoryRequest(data);

            // Refrescar la lista de inventarios tras crear uno nuevo
            await get().getInventories();
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
            await updateInventoryRequest(id, data);

            // Refrescar la lista de inventarios tras actualizar uno
            await get().getInventories();
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

            // Refrescar la lista de inventarios tras eliminar uno
            await get().getInventories();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el inventario."
            });
            throw error;
        }
    }
}));