import { create } from "zustand";
import {
    getClients as getClientsRequest,
    createClient as createClientRequest,
    updateClient as updateClientRequest,
    deleteClient as deleteClientRequest,
    activateClient as activateClientRequest
} from "../../../shared/api/";

export const useClientStore = create((set, get) => ({
    clients: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },
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
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getClientsRequest(queryParams);

            set({
                clients: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
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
    },

    activateClient: async (id) => {
        try {
            set({ loading: true, error: null });
            await activateClientRequest(id);

            // Recargar la lista completa usando los filtros actuales
            await get().getClients(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al activar cliente."
            });
            throw error;
        }
    }
}));