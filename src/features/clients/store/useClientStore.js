import { create } from "zustand";
import {
    getClients as getClientsRequest,
    createClient as createClientRequest,
    updateClient as updateClientRequest,
    deleteClient as deleteClientRequest
} from "../../../shared/api/";

export const useClientStore = create((set, get) => ({
    clients: [],
    loading: false,
    error: null,
    filters: {
        searchTerm: "",
        activeFilter: "all"
    },

    setFilters: (newFilters) => {
        set((state) => ({
            filters: { ...state.filters, ...newFilters }
        }));
    },

    getClients: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const response = await getClientsRequest(params);

            set({
                clients: response.data.data || response.data,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener clientes",
                loading: false
            });
        }
    },


    updateClient: async (data) => {
        try {
            set({ loading: true, error: null });
            await updateClientRequest(data);

            // Recargar la lista completa usando los filtros actuales
            await get().getClients(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al actualizar el cliente."
            });
            throw error;
        }
    },

    deleteClient: async (id) => {
        try {
            set({ loading: true, error: null });
            await deleteClientRequest(id);

            // Recargar la lista completa usando los filtros actuales
            await get().getClients(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar cliente."
            });
            throw error;
        }
    }
}));