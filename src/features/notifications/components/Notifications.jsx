import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Trash2, CheckCheck, Filter, BadgeCheck } from "lucide-react";
import { useNotificationStore } from "../store/useNotificationStore.js";
import { Spinner } from "../../../shared/components/layout/Spinner.jsx";
import { showError } from "../../../shared/utils/toast.js";
import { useUIStore } from "../../../shared/components/ui/store/uiStore.js";
import { NotificationModal } from "./NotificationModal.jsx";
import { LucideMotionIcon } from "../../../shared/components/ui/LucideMotionIcon.jsx";

export const Notifications = () => {
	const { notifications, loading, error, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useNotificationStore();
	const { openConfirm } = useUIStore();

	const [searchTerm, setSearchTerm] = useState("");
	const [activeFilter, setActiveFilter] = useState("all");
	const [selectedNotification, setSelectedNotification] = useState(null);
	const [openModal, setOpenModal] = useState(false);

	useEffect(() => {
		const filters = { limit: 100 };
		if (activeFilter !== "all") {
			filters.isRead = activeFilter === "read";
		}
		getNotifications(filters);
	}, [getNotifications, activeFilter]);

	useEffect(() => {
		if (error) showError(error);
	}, [error]);

	const filteredNotifications = useMemo(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		return notifications.filter((notification) => {
			if (!normalizedSearch) return true;

			const clientName = notification.referenceId?.client?.name || notification.referenceId?.client?.email || "";
			
			return clientName.toLowerCase().includes(normalizedSearch) || 
				   notification.title.toLowerCase().includes(normalizedSearch) ||
				   notification.message.toLowerCase().includes(normalizedSearch);
		});
	}, [notifications, searchTerm]);

	const formatType = (type) => {
		return type.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
	};

	if (loading && notifications.length === 0) return <Spinner />;

	return (
		<div className="p-4">
			<div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<div>
					<h1 className="text-3xl font-bold text-[var(--text-primary)]">Notificaciones</h1>
					<p className="mt-1 text-sm text-[var(--text-muted)]">Consulta y administra las notificaciones del panel</p>
				</div>

				<button
					onClick={() =>
						openConfirm({
							title: "Marcar todo como leído",
							message: "¿Quieres marcar todas las notificaciones como leídas?",
							onConfirm: () => markAllNotificationsAsRead(),
						})
					}
					className="rounded-lg border border-transparent bg-[var(--color-brand-dark)] px-4 py-2 font-medium text-white shadow transition hover:bg-[var(--color-brand-red)]"
				>
					<span className="inline-flex items-center gap-2">
					<LucideMotionIcon icon={CheckCheck} className="!w-4 !h-4 text-white" />
						Marcar todo leído
					</span>
				</button>
			</div>

			<div className="mb-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 shadow-sm">
				<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
					<div className="flex-1">
						<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
							<span className="inline-flex items-center gap-2">
								<LucideMotionIcon icon={Search} />
								Buscar notificaciones
							</span>
						</label>
						<div className="relative">
							<span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[var(--text-muted)]">
								<LucideMotionIcon icon={Search} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-muted)]" />
							</span>
							<input
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								placeholder="Buscar por título, tipo o mensaje"
								className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] py-2.5 pl-10 pr-4 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
							/>
						</div>
					</div>

					<div className="w-full lg:w-64">
						<label className="mb-2 block text-sm font-semibold text-[var(--text-primary)]">
							<span className="inline-flex items-center gap-2">
								<LucideMotionIcon icon={Filter} />
								Estado
							</span>
						</label>
						<select
							value={activeFilter}
							onChange={(e) => setActiveFilter(e.target.value)}
							className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--color-brand-dark)]"
						>
							<option value="all">Todas</option>
							<option value="read">Leídas</option>
							<option value="unread">No leídas</option>
						</select>
					</div>

					<button
						type="button"
						onClick={() => {
							setSearchTerm("");
							setActiveFilter("all");
						}}
						className="rounded-xl border border-[var(--border-color)] px-4 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--bg-base)]"
					>
						<span className="inline-flex items-center gap-2">
							<LucideMotionIcon icon={BadgeCheck} className="!w-4 !h-4 md:!w-5 md:!h-5 text-[var(--text-secondary)]" />
							Limpiar
						</span>
					</button>
				</div>
			</div>

			<div className="overflow-x-auto rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-md">
				<table className="w-full border-collapse text-left">
					<thead className="border-b border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-sm text-[var(--text-secondary)]">
						<tr>
							<th className="px-6 py-4 font-semibold">Título</th>
							<th className="px-6 py-4 font-semibold">Tipo</th>
							<th className="px-6 py-4 font-semibold">Mensaje</th>
							<th className="px-6 py-4 font-semibold">Cliente</th>
							<th className="px-6 py-4 font-semibold">Estado</th>
							<th className="px-6 py-4 font-semibold text-center">Acciones</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[var(--border-color)]">
						{filteredNotifications.length > 0 ? (
							filteredNotifications.map((notification) => (
								<tr key={notification._id} className="transition-colors hover:bg-[var(--bg-base)]">
									<td className="px-6 py-4 font-medium text-[var(--text-primary)]">{notification.title}</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										{formatType(notification.type)}
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">{notification.message}</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<div className="flex flex-col">
											<span className="font-semibold text-[var(--text-primary)]">
												{notification.referenceId?.client?.name || notification.referenceId?.client?.email || "N/A"}
											</span>
											<span className="text-xs opacity-70">
												{notification.referenceType === 'Order' ? 'Pedido' : 'Reservación'}
											</span>
										</div>
									</td>
									<td className="px-6 py-4 text-sm text-[var(--text-secondary)]">
										<span className={`rounded-full px-3 py-1 text-xs font-medium ${notification.isRead ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>
											{notification.isRead ? "Leída" : "Pendiente"}
										</span>
									</td>
									<td className="px-6 py-4">
										<div className="flex items-center justify-center gap-3">
											{!notification.isRead && (
												<button
													onClick={() => markNotificationAsRead(notification._id)}
													className="inline-flex items-center gap-2 font-medium text-green-700 transition hover:opacity-75"
												>
													<LucideMotionIcon icon={CheckCheck} className="!w-4 !h-4 text-green-700 dark:text-[var(--color-brand-yellow)]" />
													Leer
												</button>
											)}
											<button
												onClick={() => {
													setSelectedNotification(notification);
													setOpenModal(true);
												}}
												className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-yellow)] transition hover:opacity-75"
											>
												<LucideMotionIcon icon={Eye} className="!w-4 !h-4 text-[var(--color-brand-yellow)]" />
												Ver
											</button>
											<button
												onClick={() =>
													openConfirm({
														title: "Eliminar Notificación",
														message: "¿Estás seguro de eliminar esta notificación?",
														onConfirm: () => deleteNotification(notification._id),
													})
												}
												className="inline-flex items-center gap-2 font-medium text-[var(--color-brand-red)] transition hover:opacity-75"
											>
												<LucideMotionIcon icon={Trash2} className="!w-4 !h-4 text-[var(--color-brand-red)]" />
												Eliminar
											</button>
										</div>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan="6" className="py-8 text-center text-[var(--text-muted)]">No hay notificaciones para mostrar.</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<NotificationModal
				isOpen={openModal}
				onClose={() => {
					setOpenModal(false);
					setSelectedNotification(null);
				}}
				notification={selectedNotification}
			/>
		</div>
	);
};
