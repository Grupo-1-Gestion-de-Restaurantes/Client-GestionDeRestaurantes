import { create } from "zustand";
import { getMyInvoices as getInvoicesRequest } from "../../../shared/api";

export const useInvoiceStore = create((set, get) => ({
    invoices: [],
    loading: false,
    error: null,
    pagination: {
        currentPage: 1,
        limit: 10,
        totalRecords: 0,
        totalPages: 0
    },

    getInvoices: async (params = {}) => {
        try {
            set({ loading: true, error: null });
            const queryParams = { 
                page: get().pagination.currentPage, 
                limit: get().pagination.limit, 
                ...params 
            };
            const response = await getInvoicesRequest(queryParams);
            
            set({
                invoices: response.data?.invoices || [],
                pagination: response.data?.pagination || {
                    currentPage: 1,
                    totalPages: 1,
                    totalRecords: (response.data?.invoices || []).length,
                    limit: 10
                },
                loading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || "Error al obtener las facturas",
                loading: false
            });
        }
    }
}));