import { axiosAdmin } from "./api";

export const getGeneralReport = (params) => axiosAdmin.get("/reports/generalReport", { params });

export const getRestaurantReport = (id, params) => axiosAdmin.get(`/reports/restaurantReport/${id}`, { params });

export const exportGeneralReport = async (format, restaurantId) => {
    const response = await axiosAdmin.get("/reports/generalReport", {
        params: { format, restaurantId },
        responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    const extension = format === "excel" ? "xlsx" : "pdf";
    link.setAttribute("download", `Reporte_General.${extension}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};
