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

    getRestaurants: async (filters = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getRestaurantsRequest(filters);

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

    deactivateRestaurant: async (id) => {
        try {
            set({ loading: true, error: null });
            const response = await updateRestaurantRequest(id, {
                isActive: false,
                status: "Cerrado",
            });
            const updatedRestaurant = response.data.data || response.data;

            set({
                restaurants: get().restaurants.map((restaurant) =>
                    restaurant._id === id ? updatedRestaurant : restaurant
                ),
                loading: false
            });
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
            const response = await updateRestaurantRequest(id, {
                isActive: true,
                status: "Abierto",
            });
            const updatedRestaurant = response.data.data || response.data;

            set({
                restaurants: get().restaurants.map((restaurant) =>
                    restaurant._id === id ? updatedRestaurant : restaurant
                ),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al activar restaurante."
            });
        }
    }
}));