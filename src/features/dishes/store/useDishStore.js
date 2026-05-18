import { create } from "zustand";
import {
    getDishes as getDishesRequest,
    createDish as createDishRequest,
    updateDish as updateDishRequest,
    deleteDish as deleteDishRequest
} from "../../../shared/api/";

export const useDishStore = create((set, get) => ({
    dishes: [],
    loading: false,
    error: null,
    filters: {
        searchTerm: "",
        activeFilter: "all",
        dishTypeFilter: ""
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    getDishes: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getDishesRequest(params);

            set({
                dishes: response.data.data || response.data,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener los platillos",
                loading: false
            });
        }
    },

    createDish: async (formData) => {
        try {
            set({ loading: true, error: null });
            await createDishRequest(formData);

            // Recargar la lista completa usando los filtros actuales
            await get().getDishes(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear el platillo."
            });
            throw error;
        }
    },

    updateDish: async (id, formData) => {
        try {
            set({ loading: true, error: null });
            await updateDishRequest(id, formData);

            // Recargar la lista completa usando los filtros actuales
            await get().getDishes(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el platillo."
            });
            throw error;
        }
    },

    deleteDish: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteDishRequest(id);

            // Recargar la lista completa usando los filtros actuales
            await get().getDishes(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el platillo."
            });
            throw error;
        }
    }
}));