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

    getDishes: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getDishesRequest();
            
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
            const response = await createDishRequest(formData);

            set({
                dishes: [response.data.data || response.data, ...get().dishes],
                loading: false
            });
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
            const response = await updateDishRequest(id, formData);
            const updated = response.data.data || response.data;

            set({
                dishes: get().dishes.map((d) =>
                    d._id === id ? updated : d
                ),
                loading: false
            });
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

            set({
                dishes: get().dishes.filter(d => d._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el platillo."
            });
            throw error;
        }
    }
}));