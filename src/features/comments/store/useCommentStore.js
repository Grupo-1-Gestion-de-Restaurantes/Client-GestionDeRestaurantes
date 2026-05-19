import { create } from "zustand";
import {
    getComments as getCommentsRequest,
    deleteComment as deleteCommentRequest
} from "../../../shared/api/";

export const useCommentStore = create((set, get) => ({
    comments: [],
    loading: false,
    error: null,
    filters: {
        searchTerm: "",
        activeFilter: "all",
        restaurantFilter: ""
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    getComments: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getCommentsRequest(params);
            set({
                comments: response.data.data || response.data,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener los comentarios",
                loading: false
            });
        }
    },


    deleteComment: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteCommentRequest(id);

            // Recargar la lista completa usando los filtros actuales para mantener la consistencia
            await get().getComments(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el comentario."
            });
            throw error;
        }
    }
}));