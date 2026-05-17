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

    getClients: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getClientsRequest();

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
            const response = await updateClientRequest(data);
            const updated = response.data.data || response.data;

            set({
                clients: get().clients.map((c) =>
                    c._id === data._id ? updated : c
                ),
                loading: false
            });
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

            set({
                clients: get().clients.filter(c => c._id !== id),
                loading: false
            });
        } catch (error) {
            set({
                loading: false,
                error: error.response?.data?.message || "Error al eliminar cliente."
            });
            throw error;
        }
    }
}));