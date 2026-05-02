import { create } from "zustand";
import {
    getReservations as getReservationsRequest,
    createReservation as createReservationRequest,
    updateReservation as updateReservationRequest,
    deleteReservation as deleteReservationRequest
} from "../../../shared/api";

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
            const response = await createReservationRequest(data);

            set({
                reservations: [response.data.data || response.data, ...get().reservations],
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear reservación."
            });
            throw error;
        }
    },

    updateReservation: async (id, data) => {
        try {
            set({ loading: true, error: null });
            const response = await updateReservationRequest(id, data);
            const updated = response.data.data || response.data;

            set({
                reservations: get().reservations.map((r) =>
                    r._id === id ? updated : r
                ),
                loading: false
            });
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

            set({
                reservations: get().reservations.filter(r => r._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar reservación."
            });
            throw error;
        }
    }
}));