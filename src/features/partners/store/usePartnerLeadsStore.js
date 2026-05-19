import { create } from "zustand";
import { getPartnerLeads, updatePartnerLeadStatus } from "../../../shared/api";

export const usePartnerLeadsStore = create((set, get) => ({
    leads: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 20,
        totalRecords: 0,
        totalPages: 0
    },

    getLeads: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getPartnerLeads(queryParams);
            set({
                leads: response.data.data || response.data,
                pagination: response.data.pagination || get().pagination,
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener las solicitudes",
                loading: false
            });
        }
    },

    updateStatus: async (id, status) => {
        try {
            set({ loading: true, error: null });
            await updatePartnerLeadStatus(id, status);
            await get().getLeads();
        } catch (error) {
            set({
                error: error.response?.data?.message || `Error al ${status === 'APPROVED' ? 'aprobar' : 'rechazar'} la solicitud`,
                loading: false
            });
            throw error;
        }
    }
}));