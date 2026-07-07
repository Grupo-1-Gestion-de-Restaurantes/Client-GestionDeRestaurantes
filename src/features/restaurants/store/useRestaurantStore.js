import { create } from "zustand";
import {
    getRestaurants as getRestaurantsRequest,
    createRestaurant as createRestaurantRequest,
    updateRestaurant as updateRestaurantRequest,
} from "../../../shared/api";

export const useRestaurantStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },
    filters: {
        searchTerm: "",
        activeFilter: "all"
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    getRestaurants: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getRestaurantsRequest(queryParams);

            set({
                restaurants: response.data.data || response.data || [],
                pagination: response.data.pagination || get().pagination,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener restaurantes",
                loading: false
            });
        }
    },

    createRestaurant: async (formData) => {
        try {
            set({ loading: true, error: null });
            const response = await createRestaurantRequest(formData);

            // Recargar la lista completa usando los filtros actuales para mantener la consistencia
            await get().getRestaurants(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear restaurante."
            });
        }
    },

    updateRestaurant: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateRestaurantRequest(id, data);

            // Recargar la lista completa usando los filtros actuales para mantener la consistencia
            await get().getRestaurants(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el restaurante."
            });
        }
    },

    deactivateRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await updateRestaurantRequest(id, {
                isActive: false,
                status: "Cerrado",
            });

            // Recargar la lista completa usando los filtros actuales para mantener la consistencia
            await get().getRestaurants(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al cerrar restaurante."
            });
        }
    },

    activateRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await updateRestaurantRequest(id, {
                isActive: true,
                status: "Abierto",
            });

            // Recargar la lista completa usando los filtros actuales para mantener la consistencia
            await get().getRestaurants(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al activar restaurante."
            });
        }
    }
}));