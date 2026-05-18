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

    getReservations: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getReservationsRequest();
            console.log(response.data)

            set({
                reservations: response.data.data || response.data,
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