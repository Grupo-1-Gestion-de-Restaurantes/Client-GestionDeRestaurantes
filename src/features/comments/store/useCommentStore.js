import { create } from "zustand";
import {
    getComments as getCommentsRequest,
    deleteComment as deleteCommentRequest
} from "../../../shared/api/";

export const useCommentStore = create((set, get) => ({
    comments: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 10,
        totalRecords: 0,
        totalPages: 0
    },
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
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getCommentsRequest(queryParams);
            set({
                comments: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
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