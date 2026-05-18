import { create } from "zustand";
import {
	getNotifications as getNotificationsRequest,
	markNotificationAsRead as markNotificationAsReadRequest,
	markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
	deleteNotification as deleteNotificationRequest,
} from "../../../shared/api/admin.js";

export const useNotificationStore = create((set, get) => ({
	notifications: [],
	loading: false,
	error: null,

	getNotifications: async (params = {}) => {
		try {
			set({ loading: true, error: null });
			const response = await getNotificationsRequest(params);

			set({
				notifications: response.data.data || response.data || [],
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al obtener notificaciones",
			});
		}
	},

	markNotificationAsRead: async (id) => {
		try {
			set({ loading: true, error: null });
			const response = await markNotificationAsReadRequest(id);
			const updatedNotification = response.data.data || response.data;

			set({
				notifications: get().notifications.map((notification) =>
					notification._id === id ? updatedNotification : notification
				),
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al marcar la notificación.",
			});
		}
	},

	markAllNotificationsAsRead: async () => {
		try {
			set({ loading: true, error: null });
			await markAllNotificationsAsReadRequest();

			set({
				notifications: get().notifications.map((notification) => ({
					...notification,
					isRead: true,
				})),
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al marcar todas las notificaciones.",
			});
		}
	},

	deleteNotification: async (id) => {
		try {
			set({ loading: true, error: null });
			await deleteNotificationRequest(id);

			set({
				notifications: get().notifications.filter((notification) => notification._id !== id),
				loading: false,
			});
		} catch (error) {
			set({
				loading: false,
				error: error.response?.data?.message || "Error al eliminar la notificación.",
			});
		}
	},
}));
