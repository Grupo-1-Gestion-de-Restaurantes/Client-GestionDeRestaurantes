import { create } from "zustand";
import {
    getReservations as getReservationsRequest,
    createReservation as createReservationRequest,
    updateReservation as updateReservationRequest,
    deleteReservation as deleteReservationRequest
} from "../../../shared/api/";

export const useReservationStore = create((set, get) => ({
    reservations: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },

    getReservations: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getReservationsRequest(queryParams);

            set({
                reservations: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener reservaciones",
                loading: false
            });
        }
    },

    createReservation: async (data) => {
        try {
            set({ loading: true, error: null });
            await createReservationRequest(data);

            // Refrescar la lista de reservaciones tras crear una nueva
            await get().getReservations();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear la reservación."
            });
            throw error;
        }
    },

    updateReservation: async (id, data) => {
        try {
            set({ loading: true, error: null });
            await updateReservationRequest(id, data);

            // Refrescar la lista de reservaciones tras actualizar una
            await get().getReservations();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar la reservación."
            });
            throw error;
        }
    },

    deleteReservation: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteReservationRequest(id);

            // Refrescar la lista de reservaciones tras eliminar una
            await get().getReservations();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar la reservación."
            });
            throw error;
        }
    }
}));