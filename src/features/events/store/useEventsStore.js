import { create } from "zustand";
import {
    getEvents as getEventsRequest,
    createEvent as createEventRequest,
    updateEvent as updateEventRequest,
    deleteEvent as deleteEventRequest
} from "../../../shared/api/";

export const useEventStore = create((set, get) => ({
    events: [],
    loading: false,
    error: null,

    getEvents: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getEventsRequest();
            set({
                events: response.data.data || response.data || [],
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener los eventos",
                loading: false
            });
        }
    },

    createEvent: async (eventData) => {
        try {
            set({ loading: true, error: null });
            await createEventRequest(eventData);

            // Refrescar la lista de eventos tras crear uno nuevo
            await get().getEvents();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al crear el evento"
            });
            throw error;
        }
    },

    updateEvent: async (id, eventData) => {
        try {
            set({ loading: true, error: null });
            await updateEventRequest(id, eventData);

            // Refrescar la lista de eventos tras actualizar uno
            await get().getEvents();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el evento"
            });
            throw error;
        }
    },

    deleteEvent: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteEventRequest(id);

            // Refrescar la lista de eventos tras eliminar uno
            await get().getEvents();
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar el evento"
            });
            throw error;
        }
    }
}));