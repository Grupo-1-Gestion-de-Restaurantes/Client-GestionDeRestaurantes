import { create } from "zustand";
import { getMyInvoices as getInvoicesRequest } from "../../../shared/api";

export const useInvoiceStore = create((set) => ({
    invoices: [],
    loading: false,
    error: null,

    getInvoices: async () => {
        try {
            set({ loading: true, error: null });
            const response = await getInvoicesRequest();
            
            set({
                invoices: response.data?.invoices || [],
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