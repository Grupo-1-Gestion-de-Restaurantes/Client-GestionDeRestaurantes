import { create } from "zustand";
import {
    getComments as getCommentsRequest,
    deleteComment as deleteCommentRequest
} from "../../../shared/api/";

export const useCommentStore = create((set, get) => ({
    comments: [],
    loading: false,
    error: null,

    getComments: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getCommentsRequest();  
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

            set({
                comments: get().comments.filter(c => c._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el comentario."
            });
            throw error;
        }
    }
}));