import { create } from "zustand";
import {
    getRestaurants as getRestaurantsRequest,
    createRestaurant as createRestaurantRequest,
    updateRestaurant as updateRestaurantRequest,
    deleteRestaurant as deleteRestaurantRequest
} from "../../../shared/api";

export const useRestaurantStore = create((set, get) => ({
    restaurants: [],
    loading: false,
    error: null,

    getRestaurants: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getRestaurantsRequest();

            set({
                restaurants: response.data.data || response.data || [],
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
            const newRestaurant = response.data.data || response.data;

            set({
                restaurants: [newRestaurant, ...get().restaurants],
                loading: false
            });
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
            const response = await updateRestaurantRequest(id, data);
            const updated = response.data.data || response.data;

            set({
                restaurants: get().restaurants.map((r) =>
                    r._id === id ? updated : r
                ),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el restaurante."
            });
        }
    },

    deleteRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteRestaurantRequest(id);

            set({
                restaurants: get().restaurants.filter((r) => r._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar restaurante."
            });
        }
    }
}));